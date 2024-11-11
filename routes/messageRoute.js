import express from "express";
import * as messageController from "../controllers/messageController.js"
const router = express.Router();

router.route("/sendMessage").post(messageController.sendMessage);
router.route("").get(messageController.conversation);
router.route("/getLatest").get(messageController.getLastMessagesFromAllSenders);


export default router;