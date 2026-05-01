import multer from "multer";
import fs from "fs/promises";
import type { MulterFile } from "../../unit/type_project/multerfile.type";
import type { CloudinaryUploadResponse } from "../../unit/type_project/cloudinary_upload_response.type";
const upload = multer({ dest: "uploads/" });



const uploadImage = async (files: MulterFile[]): Promise<CloudinaryUploadResponse> => {
  const fileImg = files[0];
  const fileBuffer = await fs.readFile(fileImg.path) as BlobPart;
  const form = new FormData();
  form.append('file', new Blob([fileBuffer], { type: fileImg.mimetype }), fileImg.originalname);
  form.append('upload_preset', process.env.CLOUDINARY_PRESET as string);
  form.append('public_id', `groups/${Date.now()}`);
  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/drzmyhioi/image/upload`,
    { method: 'POST', body: form }
  );
  const uploadResult = await uploadRes.json() as CloudinaryUploadResponse;
  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }
  await fs.unlink(fileImg.path);
  return uploadResult;
}


export { upload, uploadImage };