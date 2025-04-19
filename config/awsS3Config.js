// config/s3.js
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load .env variables

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // from .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // from .env
  region: process.env.AWS_REGION, // e.g., "us-east-1"
});

const bucketName = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3();

export { s3, bucketName };
