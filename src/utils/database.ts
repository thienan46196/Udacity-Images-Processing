import { DB_NAME, DB_URL } from '../configs/env-variables';
import mongodb, { MongoClient } from 'mongodb';

let _db: mongodb.Db;

export const createServer = (callback: Function) => {
  let uri = DB_URL;
  if (uri) {
    let dbName = DB_NAME;
    MongoClient.connect(uri)
      .then(client => {
        _db = client.db(dbName);
        console.log('Connected successfully to the database!');
        callback();
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    // throw new Error(
    //   'Error on setting up database connection! Check URI string!'
    // );
    console.log(
      'Error on setting up database connection! Check URI string!',
      uri
    );
    callback();
  }
};

export const getDb = () => {
  if (_db) return _db;
  return console.log('DB connect failed');
};
