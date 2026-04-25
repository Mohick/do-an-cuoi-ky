import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
const upload = multer({ dest: "uploads/" }); 




cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});


export { upload, cloudinary };