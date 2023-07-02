import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path
    .join(__dirname, `../../.env.${process.env.NODE_ENV}`)
    .replace(/\\/g, '/')
    .trim()
});

export const DB_URL = process.env.DB_URL;
export const DB_NAME = process.env.DB_NAME;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET || '';
