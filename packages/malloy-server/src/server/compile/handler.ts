import * as grpc from "@grpc/grpc-js";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  CompilerService,
  ICompilerServer,
} from "../proto/services/compiler_grpc_pb";
import { CompileRequest, CompileResponse } from "../proto/services/compiler_pb";
import {
  Connection,
  LookupConnection,
  Malloy,
  URLReader,
  Runtime,
} from "../../../../malloy";
import { DuckDBConnection } from "../../../../malloy-db-duckdb";
import { URL } from "node:url";

class CompileHandler implements ICompilerServer {
  compile = (
    call: grpc.ServerUnaryCall<CompileRequest, CompileResponse>,
    callback: grpc.sendUnaryData<CompileResponse>
  ): void => {
    const response: CompileResponse = new CompileResponse();
    const urlReader = new CompileUrlReader(call.request);
    const compileConnection = new CompileConnection(
      path.dirname(fileURLToPath(new URL(call.request.getDocument()!.getUrl())))
    );
    const runtime = new Runtime(urlReader, compileConnection);
    // const sql = runtime
    //   .loadModel(call.request.getDocument()!.getUrl())
    //   .loadQuery("query: flights -> { project: * }")
    //   .getSQL()
    //   .then((sql) => callback(null, response.setMessage(sql)))
    //   .catch((error) => callback(error, null));

    Malloy.parse({
      url: new URL(call.request.getDocument()?.getUrl() ?? ""),
      urlReader: urlReader,
    })
      .then((parse) => {
        return Malloy.compile({
          urlReader: urlReader,
          connections: compileConnection,
          parse: parse,
        });
      })
      .then((model) => {
        console.log(JSON.stringify(model));
        callback(null, response);
      })
      .catch((error) => {
        callback(error, null);
      });
  };;
}

class CompileUrlReader implements URLReader {
  private request: CompileRequest = new CompileRequest();

  constructor(request: CompileRequest) {
    this.request = request;
  }

  async readURL(url: URL): Promise<string> {
    const urlString = decodeURI(url.toString());

    console.log(`readURL: ${urlString}`);
    if (urlString == this.request.getDocument()!.getUrl()) {
      return this.request.getDocument()!.getContent();
    }

    for (let reference of this.request.getReferenceList()) {
      if (urlString == reference.getUrl()) {
        return reference.getContent();
      }
    }
    throw new Error(`Unable to read url: ${url}`);
  }
}

class CompileConnection implements LookupConnection<Connection> {
  private workingDir: string;
  constructor(workingDir: string) {
    this.workingDir = workingDir;
  }
  async lookupConnection(
    connectionName?: string | undefined
  ): Promise<Connection> {
    switch (connectionName) {
      case "duckdb":
        return new DuckDBConnection("duckdb", ":memory:", this.workingDir);
      default:
        throw new Error(`Connnection type not implemented: ${connectionName}`);
    }
  }
}

export default {
  service: CompilerService,
  handler: new CompileHandler(),
};
