import api from './api';
import axios from 'axios';

export const s3Service = {
  /**
   * Step 1: Ask backend for a presigned PUT URL
   * Backend verifies JWT, then generates the URL
   */
  getUploadUrl: async (fileType) => {
    const res = await api.post('/s3/upload-url', { fileType });
    return res.data.data; // { uploadUrl, key }
  },

  /**
   * Step 2: Upload file directly to S3 using the presigned URL
   * Note: We use plain axios (NOT o instance) because:
   * - The presigned URL already has auth embedded in the URL
   * - Adding our JWT Authorization header would break the S3 request
   */
  uploadToS3: async (uploadUrl, file) => {
    await axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type },
    });
  },

  /**
   * Get a presigned GET URL to display the user's profile picture
   */
  getViewUrl: async (key) => {
    const res = await api.post('/s3/view-url', { key });
    return res.data.data.viewUrl;
  },
};
