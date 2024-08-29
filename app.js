import express from "express";
import dotenv from "dotenv";
import DbConnection from "./db.js"
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"

dotenv.config();

//Db connection
DbConnection();
const app = express();
app.use(express.json())


//routes
app.use("/", pageRoute);
app.use("/photos", photoRoute);


app.listen(process.env.PORT, () => {
    console.log(`Application running on port : ${process.env.PORT}`);
});
