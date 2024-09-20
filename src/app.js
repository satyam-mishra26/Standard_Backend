import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json({
    limit: '16kb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))

app.use(express.static("public"))


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())

// routes import

import userRouter from './routes/user.routes.js'
import enquiryRouter from './routes/enquiry.routes.js'
import topperRouter from './routes/topper.routes.js'
import facultyRouter from './routes/faculty.routes.js'


// routes decleration

app.use("/api/v1/users" ,userRouter)
app.use("/api/v1/enquiries",enquiryRouter)
app.use("/api/v1/toppers",topperRouter)
app.use("/api/v1/faculty",facultyRouter)

export {app};