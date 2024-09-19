import express from "express";
import * as userController from "../controllers/userController.js";
import * as authhMiddleWare from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/").get(authhMiddleWare.authenticationToken,userController.getAllUsers);
router.route("/register").post(userController.createUser);
router.route("/:id").get(userController.getUserbyId);


export default router;