import express from "express";
import dotenv from "dotenv";
import DbConnection from "./db.js"
import cookieParser from "cookie-parser";
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import messageRoute from "./routes/messageRoute.js"
import loginRoute from "./routes/loginRoute.js"
import dashboardRoute from "./routes/dashboardRoute.js"
import cors from 'cors';
import fileUpload from 'express-fileupload';
import ConfigCloudinary from './cloudinary.js'
import { checkUser } from "./middlewares/authMiddleware.js";
import { initSocket } from "./socketio.js"
import http from "http";



dotenv.config();

ConfigCloudinary();

//Db connection
DbConnection();


const app = express();

const server = http.createServer(app);
initSocket(server);

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Socket server ${PORT} portunda çalışıyor.`);
});


app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({useTempFiles:true}));

//cors
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
  }));

//routes
app.use("/login", loginRoute);

app.use('*',checkUser)
app.use("/", pageRoute);
app.use("/photos", photoRoute);
app.use("/dashboard", dashboardRoute);
app.use("/user", userRoute);
app.use("/messages", messageRoute)




app.listen(process.env.PORT, () => {
    console.log(`Application running on port : ${process.env.PORT}`);
});
