import crypto from "crypto";
import multer from "multer";
import fs from "fs/promises";
import type { MulterFile } from "../../unit/type_project/multerfile.type";
import type { CloudinaryUploadResponse } from "../../unit/type_project/cloudinary_upload_response.type";
const upload = multer({ dest: "uploads/" });

const uploadImage = async (
  files: MulterFile[],
): Promise<CloudinaryUploadResponse | { valid: false; message: string }> => {
  const fileImg = files[0];
  if (fileImg.size > 1000000) {
    await fs.unlink(fileImg.path);
    return { valid: false, message: "File size must be less than 1MB" };
  }
  if (fileImg.mimetype !== "image/jpeg" && fileImg.mimetype !== "image/png") {
    await fs.unlink(fileImg.path);
    return {
      valid: false,
      message: "File type must be image/jpeg or image/png",
    };
  }
  const fileBuffer = (await fs.readFile(fileImg.path)) as BlobPart;
  const form = new FormData();
  form.append(
    "file",
    new Blob([fileBuffer], { type: fileImg.mimetype }),
    fileImg.originalname,
  );
  form.append("upload_preset", process.env.CLOUDINARY_PRESET as string);
  form.append("public_id", `groups/${Date.now()}`);
  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  const uploadResult = (await uploadRes.json()) as CloudinaryUploadResponse;
  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  await fs.unlink(fileImg.path);
  return uploadResult;
};

const destroyImage = async (public_id: string) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Lấy đúng từ process.env của bro
  const cloudName = process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_KEY;
  const apiSecret = process.env.CLOUDINARY_SECRET;
  const stringToSign = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");

  // 3. Gửi FormData bằng POST
  const form = new FormData();
  form.append("public_id", public_id);
  form.append("timestamp", timestamp.toString());
  form.append("api_key", apiKey as string);
  form.append("signature", signature);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: form,
      },
    );

    const result = await res.json();

    if (result.error) {
      console.error("Lỗi từ Cloudinary:", result.error.message);
      throw new Error(result.error.message);
    }

    return result; // Thành công sẽ trả về { result: 'ok' }
  } catch (error) {
    console.error("Lỗi fetch:");
    throw error;
  }
};

export { upload, uploadImage, destroyImage };
