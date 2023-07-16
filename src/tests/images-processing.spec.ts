import { getExtractedFileName, getFileExtension, imageFileNameParser } from './../utils/helpers';

import app from '../app';
import supertest from 'supertest';

const request = supertest(app);

// unit tests
describe('Helpers tests', () => {
  it('getFileExtension return file extension', () => {
    expect(getFileExtension('file.ext')).toEqual('.ext');
  });

  it('getExtractedFileName return object { name: [name], ext: [ext] }', () => {
    expect(getExtractedFileName('fileName.ext')).toEqual({ name: 'fileName', ext: '.ext' });
  });

  it('imageFileNameParser return thumb name', () => {
    expect(imageFileNameParser('assets/fileName.jpg', 10, 20)).toEqual('assets/fileName-w10xh20.jpg');
  });
});

// endpoint tests
describe('Endpoint test for images-processing module', () => {
  // happy cases
  it('get list-all-files api endpoint', async () => {
    const response = await request.get('/api/list-all-files');
    expect('files' in response.body).toBeTruthy();
  });

  it('get image full', async () => {
    const response = await request
      .get('/api/images-processing?fileName=camera.jpg')
      .expect('Content-Type', 'image/jpeg')
      .expect(200);
    expect(response).toBeTruthy();
  });

  it('get image thumb', async () => {
    await request.get('/api/images-processing?fileName=camera.jpg&height=100');
    const response = request
      .get('/api/images-processing?fileName=camera.jpg&height=100')
      .expect('Content-Type', 'image/jpeg')
      .expect(200);
    expect(response).toBeTruthy();
  });

  // image does not exist
  it('get non existent file', async () => {
    const response = await request.get('/api/images-processing?fileName=not-exist&height=100').expect(404);

    expect(response.body).toEqual({
      code: 'file_error',
      message: 'The full file does not exist',
    });
  });
});
