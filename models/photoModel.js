import mongoose from "mongoose";

const {Schema} = mongoose;

const photoSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    uploadAt:{
        type: Date,
        default: Date.now,
    },
    
},
    {
        timestamps: true
    }
);

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;