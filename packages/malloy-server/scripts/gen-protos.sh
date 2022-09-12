#!/bin/bash

CLIENT_PROTO_DEST=./src/client/proto
SERVER_PROTO_DEST=./src/server/proto
JS_PLUGIN=../../node_modules/.bin/grpc_tools_node_protoc_plugin
TS_PLUGIN=../../node_modules/.bin/protoc-gen-ts
WEB_PLUGIN=./scripts/protoc-gen-grpc-web-1.3.1-linux-x86_64
GRPC_TOOLS_NODE_PROTOC=../../node_modules/.bin/grpc_tools_node_protoc

rm -rf ${SERVER_PROTO_DEST}
mkdir -p ${SERVER_PROTO_DEST}

rm -rf ${CLIENT_PROTO_DEST}
mkdir -p ${CLIENT_PROTO_DEST}

${GRPC_TOOLS_NODE_PROTOC} \
  --js_out=import_style=commonjs,binary:${SERVER_PROTO_DEST} \
  --grpc_out=grpc_js:${SERVER_PROTO_DEST} \
  -I ./proto \
  proto/**/*.proto

${GRPC_TOOLS_NODE_PROTOC} \
  --plugin=protoc-gen-ts=${TS_PLUGIN} \
  --ts_out=${SERVER_PROTO_DEST} \
  -I ./proto \
  proto/**/*.proto

${GRPC_TOOLS_NODE_PROTOC} \
  --plugin=protoc-gen-grpc-web=${WEB_PLUGIN} \
  --js_out=import_style=commonjs,binary:${CLIENT_PROTO_DEST} \
  --grpc-web_out=import_style=typescript,mode=grpcweb:${CLIENT_PROTO_DEST} \
  -I ./proto \
  proto/**/*.proto
