import multer from "multer";

// Use memory storage for temporary file storage
const storage = multer.memoryStorage();

// Middleware to handle single file upload named "file"
export const singleUpload = multer({ storage }).single("file");