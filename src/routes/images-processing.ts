import ImageProcessingController from '../controllers/images-processing';
import express from 'express';

class ImageProcessingRoute {
  public imageProcessingRoute: express.Router;
  constructor() {
    this.imageProcessingRoute = express();
    this.activate();
  }

  private activate() {
    this.imageProcessingRoute.get('/images-processing', (req, res, next) => {
      new ImageProcessingController().Process(req, res, next);
    });

    this.imageProcessingRoute.get('/list-all-files', (req, res, next) => {
      new ImageProcessingController().ListAllImages(req, res, next);
    });
  }
}

export default new ImageProcessingRoute().imageProcessingRoute;
