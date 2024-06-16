import { memoryStorage } from 'multer';

export const multerConfigByDb = {
  storage: memoryStorage(),
};
