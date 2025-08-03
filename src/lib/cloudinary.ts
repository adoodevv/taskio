import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: string, folder: string = 'taskio'): Promise<string> => {
   try {
      const result = await cloudinary.uploader.upload(file, {
         folder,
         resource_type: 'auto',
         transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
         ]
      });
      return result.secure_url;
   } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
   }
};

export const deleteImage = async (publicId: string): Promise<void> => {
   try {
      await cloudinary.uploader.destroy(publicId);
   } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image');
   }
};

export default cloudinary; 