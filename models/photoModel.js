import mongoose from "mongoose";

const {Schema} = mongoose;

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Yorum yapan kullanıcının ID'si
    createdAt: { type: Date, default: Date.now } // Yorumun oluşturulma tarihi
  });

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
    location:{
        type: String
    },
    user:{
        type:Schema.Types.ObjectId,
        ref: 'User',
    },
    url:{
        type: [String],
        required: true,
    },
    likeCount:{
        type: Number,
        default: 0,
        required:true
    },
    likedBy: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    comments: [
        CommentSchema
    ]

    
},
    {
        timestamps: true
    }
);



const Photo = mongoose.model("Photo", photoSchema);

export default Photo;