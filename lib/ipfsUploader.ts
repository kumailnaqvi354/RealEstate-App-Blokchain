import axios from "axios";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!;
const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export const uploadFileToIPFS = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_KEY,
    },
  };

  try {
    const response = await axios.post(PINATA_URL, formData, config);
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload file to IPFS");
  }
};
