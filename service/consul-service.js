import Consul from 'consul';

const consulClient = new Consul({
  host: process.env.CONSUL_HOST || 'localhost',
  port: process.env.CONSUL_PORT || '8500',
  promisify: true
});

export const registerWithConsul = async () => {
  const serviceConfig = {
    id: `products-service-${process.env.PORT || 4001}`,
    name: 'products-service',
    address: 'localhost',
    port: parseInt(process.env.PORT || 4001),
    check: {
      http: `http://host.docker.internal:${process.env.PORT || 4001}/health`,
      interval: '10s',
      timeout: '5s'
    }
  };

  try {
    await consulClient.agent.service.register(serviceConfig);
    console.log('✅ Registered with Consul:', serviceConfig.id);
  } catch (error) {
    console.error('❌ Consul registration failed:', error);
  }
};

export default consulClient;
