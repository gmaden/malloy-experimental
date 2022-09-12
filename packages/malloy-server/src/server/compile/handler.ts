import * as grpc from "@grpc/grpc-js";
import {
  CompilerService,
  ICompilerServer,
} from "../proto/services/compiler_grpc_pb";
import { CompileRequest, CompileResponse } from "../proto/services/compiler_pb";
import {
  Connection,
  MalloyQueryData,
  PersistSQLResults,
  PooledConnection,
  Runtime,
  SQLBlock,
  StructDef,
  URLReader,
} from "@malloydata/malloy";
import { RunSQLOptions } from "@malloydata/malloy/src/malloy";
import {
  FetchSchemaAndRunSimultaneously,
  StreamingConnection,
  FetchSchemaAndRunStreamSimultaneously,
} from "@malloydata/malloy/src/runtime_types";

class CompileHandler implements ICompilerServer {
  compile = (
    call: grpc.ServerUnaryCall<CompileRequest, CompileResponse>,
    callback: grpc.sendUnaryData<CompileResponse>
  ): void => {
    const reply: CompileResponse = new CompileResponse();
    console.log(`Received request:\n${JSON.stringify(call.request, null, 2)}`);
    reply.setMessage(`Hello, ${call.request.getDocument()}`);

    const runtime = new Runtime(new CompileReader(), new CompileConnection());
    callback(null, reply);
  };
}

class CompileReader implements URLReader {
  async readURL(url: URL): Promise<string> {
    switch (url.protocol) {
      default:
        throw new Error(`No handler implmeented for protocol: ${url.protocol}`);
    }
  }
}

class CompileConnection implements Connection {
  runSQL(
    sql: string,
    options?: RunSQLOptions | undefined
  ): Promise<MalloyQueryData> {
    throw new Error("Method not implemented.");
  }
  isPool(): this is PooledConnection {
    throw new Error("Method not implemented.");
  }
  canPersist(): this is PersistSQLResults {
    throw new Error("Method not implemented.");
  }
  canFetchSchemaAndRunSimultaneously(): this is FetchSchemaAndRunSimultaneously {
    throw new Error("Method not implemented.");
  }
  canStream(): this is StreamingConnection {
    throw new Error("Method not implemented.");
  }
  canFetchSchemaAndRunStreamSimultaneously(): this is FetchSchemaAndRunStreamSimultaneously {
    throw new Error("Method not implemented.");
  }
  fetchSchemaForTables(tables: string[]): Promise<{
    schemas: Record<string, StructDef>;
    errors: Record<string, string>;
  }> {
    throw new Error("Method not implemented.");
  }
  fetchSchemaForSQLBlocks(sqlStructs: SQLBlock[]): Promise<{
    schemas: Record<string, StructDef>;
    errors: Record<string, string>;
  }> {
    throw new Error("Method not implemented.");
  }
  get name(): string {
    throw new Error("Method not implemented.");
  }
}

export default {
  service: CompilerService,
  handler: new CompileHandler(),
};
