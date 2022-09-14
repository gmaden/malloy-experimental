import * as grpc from "@grpc/grpc-js";
import * as fs from "fs";
import * as path from "path";
import { describe, expect, test } from "@jest/globals";
import { CompileRequest, CompileDocument } from "../proto/services/compiler_pb";
import { CompilerClient } from "../proto/services/compiler_grpc_pb";
import { fileURLToPath } from "url";
import compileHandler from "../compile/handler";

const testPort = "8888";
const testServer = new grpc.Server();

beforeAll(() => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    testServer.addService(compileHandler.service, compileHandler.handler);
    testServer.bindAsync(
      `localhost:${testPort}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) return reject(err);

        testServer.start();
        console.log(`Test server listening on port: ${port}`);
        resolve(port);
      }
    );
  });
});

function genCompileDocument(relativePath: string): CompileDocument {
  const fileUrl = new URL(`file:///${path.join(process.cwd(), relativePath)}`);
  return new CompileDocument()
    .setUrl(decodeURI(fileUrl.toString()))
    .setContent(fs.readFileSync(fileURLToPath(fileUrl), { encoding: "utf-8" }));
}

describe("CompileHandler", () => {
  test("compile", (done) => {
    const client = new CompilerClient(
      `localhost:${testPort}`,
      grpc.credentials.createInsecure()
    );
    const request = new CompileRequest();
    request.setDocument(
      genCompileDocument("/../../samples/duckdb/faa/8_dashboard.malloy")
    );
    request.addReference(
      genCompileDocument("../../samples/duckdb/faa/2_flights.malloy")
    );

    client.compile(request, (err, response) => {
      try {
        expect(err).toBe(null);
        expect(response.getMessage()).toBe(
          fs.readFileSync(
            path.join(process.cwd(), "/src/server/compile/handler.spec.01.sql"),
            {
              encoding: "utf-8",
            }
          )
        );
        done();
      } catch (ex) {
        done(ex);
      }
    });
  });
});

afterAll(() => {
  testServer.forceShutdown();
});
