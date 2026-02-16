import { fetch } from "@/src/libs/helpers";
import axios from "axios";

interface UploadResponse {
  preSignedUrl: string;
  outPutUrl: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  // Get presigned URL
  const res = await fetch<UploadResponse>({
    url: "/upload/upload-file",
    method: "POST",
    data: {
      fileName: file.name,
      type: "image",
    },
  });

  // Upload to S3
  await axios.put(res.preSignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  // Return final image URL
  return res.outPutUrl;
};

export const deleteFile = async (fileName: string) => {
  return await fetch({
    url: "/upload/deleteFile",
    method: "POST",
    data: { fileName },
  });
};