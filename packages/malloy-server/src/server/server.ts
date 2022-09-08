import * as grpc from "@grpc/grpc-js";
import compileHandler from "./compile/handler";
import { CompilerService } from "../proto/services/compiler_grpc_pb";

const PORT = process.env.PORT || 8084;

function startServer() {
  const server = new grpc.Server();

  // @ts-ignore see: https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/master/doc/server_impl_signature.md
  server.addService(CompilerService, compileHandler.handler);

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err: Error | null, port: number) => {
      if (err != null) {
        return console.error(err);
      }

      console.log(`Server listening on ${port}`);
      server.start();
    }
  );
}

startServer();

process.on("uncaughtException", (ex) => {
  console.error(ex);
});

process.on("unhandledRejection", (ex) => {
  console.error(ex);
});
