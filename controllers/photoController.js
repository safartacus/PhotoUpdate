import Photo from "../models/photoModel.js";
import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';

const createPhoto = async (req, res) => {

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'NodeJS'
        }
    );

    try {
        const photo = await Photo.create({
            name:req.body.name,
            description: req.body.description,
            user:res.locals.user._id,
            url: result.secure_url
        });

        fs.unlinkSync(req.files.tempFilePath)
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
const getAllPhoto = async (req, res) => {

    try {
        const photos = await Photo.find();
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
export {createPhoto,getAllPhoto,getPhotobyId};