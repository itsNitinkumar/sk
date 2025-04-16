import express from 'express';
import fileUpload from 'express-fileupload';

const app = express();
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max-file-size
    abortOnLimit: true,
    debug: true // Enable debugging
}));
