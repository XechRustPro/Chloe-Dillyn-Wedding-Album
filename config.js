/*
 * PHOTO STORAGE CONFIGURATION
 * GitHub Pages hosts the website but does not receive/store uploaded files.
 *
 * To enable uploads, create a Cloudinary account and an UNSIGNED upload preset.
 * Then enter your Cloudinary cloud name and preset name below.
 *
 * IMPORTANT:
 * - Never put an API secret or private key in this file.
 * - Restrict your unsigned preset to image uploads and set sensible file/size limits.
 * - Anyone who can see this public website can see these public configuration values.
 */
window.ALBUM_CONFIG = {
  cloudinaryCloudName: "YOUR_CLOUD_NAME",
  cloudinaryUploadPreset: "YOUR_UNSIGNED_UPLOAD_PRESET",
  maxPhotos: 10,
  maxFileSizeMB: 10
};
