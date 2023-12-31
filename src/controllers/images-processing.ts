import { Common, Constant } from '../resources/common';
import { NextFunction, Request, Response as Res } from 'express';

import fs from 'fs';
import { imageFileNameParser } from '../utils/helpers';
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
    let returnMessage = '';

    if (!fileName) {
      returnMessage = 'fileName is null or empty.Please input fileName.'
      response
        .status(Common.bad_request.status)
        .json({ code: Common.bad_request.code, message: returnMessage });
      return;
    }

    const width = requestQueries.width
      ? parseInt(requestQueries.width.toString())
      : null;
    const height = requestQueries.height
      ? parseInt(requestQueries.height.toString())
      : null;
    try {
      const fullPath = `${Constant.fullPath}${fileName}`;

      const thumbFileName = imageFileNameParser(
        `${Constant.thumbPath}${fileName}`,
        width,
        height,
      );

      // check thumb existing
      if (fs.existsSync(thumbFileName)) {
        fs.readFile(thumbFileName, function (err, data) {
          if (err) {
            returnMessage = 'Error reading thumb file';
            console.log(err.message);
            response
              .status(Common.server_error.status)
              .json({ code: Common.server_error.code, message: returnMessage });
          } else {
            response.writeHead(Common.success.status, {
              'Content-Type': 'image/jpeg',
            });
            response.end(data);
            return;
          }
        });
      }
      // process full image
      else {
        if (!fs.existsSync(fullPath)) {
          returnMessage = 'The file does not exist';
          response
            .status(Common.not_found.status)
            .json({ code: Common.not_found.code, message: returnMessage });
        } else {
          fs.readFile(fullPath, async function (err, data) {
            if (err) {
              returnMessage = 'Error reading file';
              response
                .status(Common.server_error.status)
                .json({ code: Common.server_error.code, message: returnMessage });
              return;
            }
            // get original width & height
            const metaData = await sharp(data.buffer).metadata();
            response.writeHead(Common.success.status, {
              'Content-Type': 'image/jpeg',
            });

            if (
              (height && metaData.height != height) ||
              (width && metaData.width != width)
            ) {
              const _height = height ? height : metaData.height;
              const _width = width ? width : metaData.width;
              // resize image
              const finalImage = await sharp(data)
                .resize({ width: _width, height: _height })
                .toBuffer();
              fs.writeFile(thumbFileName, finalImage, function (err) {
                if (err) {
                  console.log(
                    'There is an error in writing the thumb file',
                    err.message,
                  );
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

  public async ListAllImages(
    request: Request,
    response: Res,
    next: NextFunction,
  ) {
    fs.readdir(Constant.fullPath, function (err, files) {
      if (err) {
        console.error(err);
        response.status(Common.server_error.status).json({
          code: 'file_error',
          message: 'There is an error in reading files',
        });
      } else {
        response.json({ files });
        return;
      }
    });
  }
}

export default ImagesProcessingController;
