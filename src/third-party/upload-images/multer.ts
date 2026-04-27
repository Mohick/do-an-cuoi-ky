import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
const upload = multer({ dest: "uploads/" }); 


const ob = {

    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,

}

cloudinary.config({
  cloud_name: "drzmyhioi",
  api_key: "145254998947473",
  api_secret: "PSK8Tpp-tofeBM2auvKmvrCFUx0",
});


export { upload, cloudinary };