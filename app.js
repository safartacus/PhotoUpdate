import express from "express";
import dotenv from "dotenv";
import DbConnection from "./db.js"
import cookieParser from "cookie-parser";
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import loginRoute from "./routes/loginRoute.js"
import cors from 'cors';
import { checkUser } from "./middlewares/authMiddleware.js";


dotenv.config();

//Db connection
DbConnection();
const app = express();
app.use(cookieParser());
app.use(express.json());


//routes
app.use('*',checkUser);
app.use("/", pageRoute);
app.use("/photos", photoRoute);
app.use("/user", userRoute);
app.use("/login", loginRoute);




app.listen(process.env.PORT, () => {
    console.log(`Application running on port : ${process.env.PORT}`);
});
