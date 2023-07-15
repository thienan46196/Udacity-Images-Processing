// import AuthRoute from './routes/auth';

import { PORT } from './configs/env-variables';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import swaggerUi from "swagger-ui-express";

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(cookieParser());

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(express.static(path.join(__dirname, '../public')));

    //url encoded config
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());

    this.app.all('*', function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });
    
    this.app.use("/docs",swaggerUi.serve, swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "/swagger.json",
      }
    }))

    //landing page
    this.app.get('/', (req, res) => {
      res.send(new Date());
    });
    
    //routes
    // this.app.use("/auth",AuthRoute);
    
    //fallback
    this.app.get('*', (req, res) => {
      res.send('404 Not Found');
    });


    // createServer(() => {
    //     this.app.listen(port, () => {
    //       console.log('App is listening at port:', port);
    //     });
    //   });



    
    const port = PORT || 4000;
    
    this.app.listen(port, () => {
      console.log('App is listening at port:', port);
    });
  } 
}

export default new App().app;
