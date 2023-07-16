import { Common, Constant } from '../resources/common';
import { NextFunction, Request, Response as Res } from 'express';

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface ImageProcessingSchema {
  fileName: string;
  width: number | null;
  height: number | null;
}

const defaultRequestQuery: ImageProcessingSchema = {
  fileName: '',
  width: null,
  height: null,
};

class ImagesProcessingController {
  public async Process(request: Request, response: Res, next: NextFunction) {
    const requestQueries = request.query || defaultRequestQuery;

    const fileName = requestQueries.fileName ? requestQueries?.fileName : '';
    const width = requestQueries.width ? parseInt(requestQueries.width.toString()) : null;
    const height = requestQueries.height ? parseInt(requestQueries.height.toString()) : null;
    let returnMessage = '';
    try {
      const fullPath = `${Constant.fullPath}${fileName}`;
      const ext = path.extname(fullPath);
      const _tempFileName = fileName.toString().replace(ext, '');
      const thumbFileName = `${Constant.thumbPath}${_tempFileName}${width}x${height}${ext}`;

      // check thumb existing
      if (fs.existsSync(thumbFileName)) {
        fs.readFile(thumbFileName, function (err, data) {
          if (err) {
            returnMessage = 'Error reading thumb file';
            console.log(err.message);
            response.status(Common.server_error.status).json({ code: 'file_error', message: returnMessage });
          } else {
            console.log('Return thumb');
            response.writeHead(Common.success.status, { 'Content-Type': 'image/jpeg' });
            response.end(data);
            return;
          }
        });
      }
      // process full image
      else {
        if (!fs.existsSync(fullPath)) {
          returnMessage = 'The full file does not exist';
          console.log(returnMessage);
          response.status(Common.bad_request.status).json({ code: 'file_error', message: returnMessage });
        } else {
          fs.readFile(fullPath, async function (err, data) {
            if (err) {
              returnMessage = 'Error reading full file';
              console.log(returnMessage);
              response.status(Common.server_error.status).json({ code: 'file_error', message: returnMessage });
              return;
            }
            // get original width & height
            const metaData = await sharp(data.buffer).metadata();
            response.writeHead(Common.success.status, { 'Content-Type': 'image/jpeg' });

            if ((height && (metaData.height != height))  || (width && (metaData.width != width))) {
              const _height = height ? height : metaData.height;
              const _width = width ? width : metaData.width;
              // resize image
              const finalImage = await sharp(data).resize({ width: _width, height: _height }).toBuffer();
              fs.writeFile(thumbFileName, finalImage, function (err) {
                if (err) {
                  console.log('There is an error in writing the thumb file', err.message);
                }
              });

              response.end(finalImage);
              return;
            }

            response.end(data);
            return;
          });
        }
      }
    } catch (err) {
      console.error('Try-catch error handling', err);
    }
  }

  public async ListAllImages(request: Request, response: Res, next: NextFunction) {
    fs.readdir(Constant.fullPath, function (err, files) {
      if (err) {
        console.error(err);
        response.status(Common.server_error.status).json({ code: 'file_error', message: 'There is an error in reading files' });
      } else {
        response.json({ files });
        return;
      }
    });
  }
}

export default ImagesProcessingController;
