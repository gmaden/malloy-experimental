#!/bin/bash

PROTO_DEST=./src/proto
JS_PLUGIN=../../node_modules/.bin/grpc_tools_node_protoc_plugin
TS_PLUGIN=../../node_modules/.bin/protoc-gen-ts
GRPC_TOOLS_NODE_PROTOC=../../node_modules/.bin/grpc_tools_node_protoc

rm -rf ${PROTO_DEST}
mkdir -p ${PROTO_DEST}

${GRPC_TOOLS_NODE_PROTOC} \
  --js_out=import_style=commonjs,binary:${PROTO_DEST} \
  --grpc_out=grpc_js:${PROTO_DEST} \
  -I ./proto \
  proto/**/*.proto


  ${GRPC_TOOLS_NODE_PROTOC} \
    --plugin=protoc-gen-ts=${TS_PLUGIN} \
    --ts_out=${PROTO_DEST} \
    -I ./proto \
    proto/**/*.proto
