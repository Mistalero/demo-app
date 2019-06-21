import { ApolloError } from 'apollo-server-express';
import { omit, set } from 'lodash';
import { Record } from 'tiesdb-client';
import uuid from 'uuid/v4';
import { number, object, string } from 'yup';

// Database
import DB from '../../database';

// Models
import File from '../../models/file';

const SIGN = Buffer.from(
  'f1d03dbc7ab2022506f7aa7c6f4897dfdee9bcd3d7416c50097767430d1b4513',
  'hex',
);

export default {
  Query: {
    getFileList: async () => {
      const records = await DB.recollect(
        'SELECT id, createdAt, extension, name, size  FROM "filestorage"."files"',
      );

      return records.map(record => ({
        id: record.getValue('id'),
        createdAt: record.getValue('createdAt').toISOString(),
        extension: record.getValue('extension'),
        name: record.getValue('name'),
        size: record.getValue('size'),
      }));
    },
  },
  Mutation: {
    createFile: {
      validation: object().shape({
        extension: string()
          // eslint-disable-next-line
          .matches(/^(jpg|png|pdf)+$/, 'File extension is not correct!')
          .required('File name is required!'),
        name: string()
          // eslint-disable-next-line
          .matches(/^[A-я0-9-_]+$/, 'File name is not correct!')
          .required('File name is required!'),
        size: number()
          .lessThan(8388608, 'File size must be less than 8mb!')
          .required('File size is required!'),
      }),
      resolve: async (root, { extension, name, size }) => {
        // Create a ties.db record
        const record = new Record('filestorage', 'files');
        // Generate id and file object
        const id = uuid();
        const newFile = {
          id,
          extension,
          size,
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        record.putFields(newFile, File);

        const result = await DB.modify([record], SIGN);

        return newFile;
      },
    },
    deleteFile: {
      validation: object().shape({
        id: string().required('ID is required!'),
      }),
      resolve: async (root, { id }) => {
        // Find the file in DB
        const records = await DB.recollect(
          `SELECT id FROM "filestorage"."files" WHERE id IN (${id})`,
        );

        // Throw error if file not exist
        if (!records || records.length === 0) {
          throw new ApolloError('File does not exist!', 'FILE_NOT_EXIST');
        }

        // Mark record as delete
        records[0].delete(['id']);
        // Write rows
        await DB.modify(records, SIGN);

        return true;
      },
    },
    updateFile: {
      validation: object().shape({
        id: string().required('ID is required!'),
        name: string()
          // eslint-disable-next-line
          .matches(/^[A-z0-9]+$/, 'File name is not correct!')
          .required('File name is required!'),
      }),
      resolve: async (root, { id, description, name }) => {
        console.log(123);
        // Find the file in DB
        const records = await DB.recollect(
          `SELECT id, description, name FROM "filestorage"."files" WHERE id IN (${id})`,
        );

        if (!records || records.length === 0) {
          throw new ApolloError('File does not exist!', 'FILE_NOT_EXIST');
        }

        description &&
          records[0].putValue('description', description, File.description);
        name && records[0].putValue('name', name, File.name);

        // Write rows
        const result = await DB.modify(records, SIGN);
        console.log(result);
        return true;
      },
    },
  },
};
