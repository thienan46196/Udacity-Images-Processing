import { NextFunction, Request, Response as Res } from 'express';

import fs from 'fs';

interface ImageProcessingSchema {
  fileName: string;
  width: number;
  height: number;
}

class ImagesProcessingController {
  public async Process(request: Request, response: Res, next: NextFunction) {
    const requestQueries = request.query;
    const { fileName, width, height } = requestQueries;

    try {
      let fullpath = `public/assets/full/${fileName}`;
      // check thumb existing
      console.log(fullpath);
      // check file existing
      fs.access(fullpath, fs.constants.F_OK, function (err) {
        if (err) {
          console.log('Not exists');
          response.json({ code: 'not_found', messsage: 'file not found' });
          return;
        } else {
          fs.readFile(fullpath, function (err, data) {
            if (err) {
              console.log('file error');
              response.json({ code: 'file_error', messsage: 'unknown error' });
              return;
            }
            response.writeHead(200, { 'Content-Type': 'image/jpeg' });
            response.end(data);
            return;
          });
        }
      });

      // convert to right scale
    } catch {}
  }
}

export default ImagesProcessingController;
