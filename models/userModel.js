import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    userName:{
        type: String,
        required: true,
        trim: true
    },
    passWord: {
        type: String,
        required: true,
        trim: true,
    },
    eMail:{
        type: String,
        required: true,
        trim: true,
    }
},
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;