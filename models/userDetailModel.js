import mongoose from "mongoose";

const {Schema} = mongoose;

const FollowersSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
    createdAt: { type: Date, default: Date.now } 
  });
const FollowedSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: { type: Date, default: Date.now } 
  });


const userDetailSchema = new Schema({
    followers: [FollowersSchema],
    followed: [FollowedSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bio: { type: String, maxlength: 150 },
    profilePicture: { type: String },
    location: { type: String },
    website: { type: String },
    interests: [{ type: String }],
}, { timestamps: true });

const UserDetail = mongoose.model("UserDetail", userDetailSchema);

export default UserDetail;