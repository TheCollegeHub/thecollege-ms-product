import express, { json, static as static_ } from "express";
import { connectDatabase } from "./service/database-service";
import { registerWithConsul } from "./service/consul-service"; 
import cors from "cors";
import { serve, setup } from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes/routes';

const port = process.env.PRODUCTS_SERVICE_PORT || 5002;
const app = express();


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'The College Store API',
      version: '1.0.0',
      description: '',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./routes/*.js'], 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);



app.use(json());
app.use(cors());
app.use('/api-docs', serve, setup(swaggerDocs));
app.use('/api', routes);
app.use('/images', static_('upload/images'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get("/", (req, res) => {
  res.send("Server Running on port " + port);
});


async function start() {
  await connectDatabase(); 

  app.listen(port, async (error) => {
    if (!error){
        console.log("Server Running on port " + port);
        await registerWithConsul();
    }
    else console.log("Error : ", error);
  });
}

start();
