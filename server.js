import morgan from "morgan";
import * as dotenv from "dotenv"
dotenv.config()
import express from "express";
const app = express()
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cloudinary from 'cloudinary';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// router
import jobRouter from "./routes/jobRouter.js"
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js"

// middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(cookieParser());
// The primary function of express. json() is to parse requests with a Content-Type header of application/json. 
// Once parsed, the resulting data is stored in the req.body, allowing easy access to the JSON content sent 
// from the client.
app.use(express.json())
app.use(helmet());
app.use(mongoSanitize());

app.use("/api/v1/jobs",authenticateUser,jobRouter)
app.use("/api/v1/users",authenticateUser,userRouter)
app.use("/api/v1/auth",authRouter)

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.use("*",(req,res) => {
    res.status(404).json({ message: 'not found'});
})

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5100;

try {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(port,() => {
        console.log(`server is running on port ${port}`)
    })
}
catch(error) {
    console.log(error)
    process.exit(1)
}