import Photo from "../models/photoModel.js";
import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';

const createPhoto = async (req, res) => {

    try {
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
            use_filename: true,
            folder: 'NodeJS'
        });
        const photo = await Photo.create({
            name: req.body.name,
            description: req.body.description,
            user: res.locals.user._id,
            url: result.secure_url,
            location: req.body.location
        });

        // Geçici dosyayı sil
        // fs.unlinkSync(req.file.tempFilePath);

        res.status(200).json({
            succeeded: true,
            photo,
        });
    } catch (error) {
        res.status(500).json({
            succeeded: false,
            error,
        });
    }
};

const getAllPhoto = async (req, res) => {

    try {
        const photos = await Photo.find().populate('user').populate('comments.user').sort({ createdAt: -1 });
        res.status(200).json({
            succeded: true,
            photos,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
const getPhotobyId = async (req, res) => {

    try {
        const photo = await Photo.findById(req.body._id);
        res.status(200).json({
            succeded: true,
            photo,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
const likePhoto = async (req, res) =>{
    try {
        const photo = await Photo.findById(req.body.photoId);

        if (photo.likedBy.includes(res.locals.user._id)) {
            const test = photo.likedBy.filter(id => id.toString() === res.locals.user._id.toString());
            photo.likedBy = photo.likedBy.filter(id => id.toString() !== res.locals.user._id.toString());
            photo.likeCount -= 1;

            await photo.save();
            res.status(200).json({
                success: true, 
                message: "Like removed.", 
                likeCount: photo.likeCount,
                likedBy: photo.likeCount,
                likeable: true
            });
        }
        else{
            photo.likedBy.push(res.locals.user._id);
            photo.likeCount += 1;

            await photo.save();

            res.status(200).json({
                success: true, 
                message: "Liked Succesfully.", 
                likeCount: photo.likeCount,
                likedBy: photo.likedBy,
                likeable: false
            });
        }

        

    } catch (error) {
        
    }
};

const addComment = async (req,res) => {
    try {
        // Veritabanında ilgili fotoğrafı bul
        const photo = await Photo.findById(req.body.photoId);
        if (!photo) return res.status(404).send('Fotoğraf bulunamadı.');
    
        // Yorumları güncelle
        const newComment = {
          text: req.body.comment,
          user: res.locals.user._id, 
          createdAt: new Date() 
        };
        photo.comments.push(newComment);
    
        await photo.save();
    
        // Yorum bilgilerini popüle et
        await photo.populate('comments.user'); 
    
        return res.status(200).json({ comment: photo.comments[photo.comments.length - 1] }); 
      } catch (err) {
        console.error(err);
        return res.status(500).send('Bir hata oluştu.');
      }
}
const deleteComment = async (req,res) =>{
    try {
        const photo = await Photo.findById(req.body.photoId);
        if (!photo) return res.status(404).send('Fotoğraf bulunamadı.');
    
        const commentIndex = photo.comments.findIndex(comment => comment._id.toString() === req.body.commentId);
        if (commentIndex === -1) return res.status(404).send('Yorum bulunamadı.');
    
        // Yorumları güncelle
        photo.comments.splice(commentIndex, 1); // İlgili yorumu sil
    
        await photo.save(); // Güncellenmiş fotoğrafı kaydet
    
        return res.status(200).json({
            succeeded: true,
            photoId: req.body.photoId
        })
      } catch (err) {
        return res.status(500).json({
            succeeded: false
        })
      }
};
export {createPhoto,getAllPhoto,getPhotobyId,likePhoto,addComment,deleteComment};