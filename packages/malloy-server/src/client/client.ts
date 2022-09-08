import * as grpc from "@grpc/grpc-js";
import { CompilerClient } from "../proto/services/compiler_grpc_pb";
import { CompileRequest } from "../proto/services/compiler_pb";

function main() {
  const target = "localhost:8084";

  const client = new CompilerClient(target, grpc.credentials.createInsecure());

  const request = new CompileRequest();
  request.setDocument("dummy document");

  client.compile(request, (err, response) => {
    if (err) {
      return console.error(err);
    }

    console.log(response.getMessage());
  });
}

main();
