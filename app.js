import express from "express";
import dotenv from "dotenv";
import DbConnection from "./db.js"
import cookieParser from "cookie-parser";
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import loginRoute from "./routes/loginRoute.js"
import dashboardRoute from "./routes/dashboardRoute.js"
import cors from 'cors';
import fileUpload from 'express-fileupload';
import ConfigCloudinary from './cloudinary.js'
import { checkUser } from "./middlewares/authMiddleware.js";


dotenv.config();

ConfigCloudinary();



//Db connection
DbConnection();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({useTempFiles:true}));

//cors
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
  }));

//routes
app.use((req, res, next) => {
  const publicRoutes = ['/login'];
  if (publicRoutes.includes(req.path)) {
      return next();
  }
  checkUser(req, res, next);
});
app.use("/", pageRoute);
app.use("/photos", photoRoute);
app.use("/dashboard", dashboardRoute);
app.use("/user", userRoute);
app.use("/login", loginRoute);




app.listen(process.env.PORT, () => {
    console.log(`Application running on port : ${process.env.PORT}`);
});
