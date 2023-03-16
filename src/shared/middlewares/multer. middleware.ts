import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../modules/users/entities/user.entity";
import multer from "multer";

export class MulterMiddleware {
  public upload!: multer.Multer;

  constructor() {
    this.multerSingle();
  }

  public multerSingle = (req: Request, res: Response, next: NextFunction) => {
    try {
      const storage = multer.diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const fileName = this.generateFileName(file.originalname);
          cb(null, fileName);
        },
      });
      this.upload = multer({ storage });

      // upload.single("avatar");

      next();
    } catch (err) {
      res.status(500).send({ message: "Internal server error." });
    }
  };

  private generateFileName = (originalFileName: string) => {
    const timestamp = new Date().getTime().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalFileName.split(".").pop();
    return `${timestamp}-${randomString}.${extension}`;
  };
}
