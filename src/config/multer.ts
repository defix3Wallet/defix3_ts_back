import multer, { Multer } from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

class MulterConfig {
  private storage: multer.StorageEngine;

  constructor() {
    this.storage = multer.diskStorage({
      destination: path.resolve("./uploads/"),
      filename: (req, file, cb) => {
        const fileName = this.generateFileName(file.originalname);
        cb(null, fileName);
      },
    });
  }

  private generateFileName = (originalFileName: string) => {
    const uuid = uuidv4();
    const extension = originalFileName.split(".").pop();
    return `${uuid}.${extension}`;
  };

  public upload(): Multer {
    return multer({
      storage: this.storage,
    });
  }
}

export default MulterConfig;
