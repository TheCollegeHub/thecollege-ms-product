import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { checkStock } from './service/stock-service';
import "./queue/cosumers/kafka-consumer"
const PROTO_PATH = './grpc/protos/stock.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const stockProto = grpc.loadPackageDefinition(packageDefinition).stock;

const server = new grpc.Server();

server.addService(stockProto.StockService.service, {
  CheckStock: async (call, callback) => {
    const { productIds } = call.request;
    console.log(`Checking stock for productIds: ${productIds.join(', ')}`);

    try {
      const productsOutOfStock = await checkStock(productIds);

      const response = {
        productsOutOfStock,
      };

      callback(null, response);
    } catch (error) {
      console.error('Error to check the stock:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Error to check the stock',
      });
    }
  },
});

server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`gRPC Stock service running on port ${port}`);
});
