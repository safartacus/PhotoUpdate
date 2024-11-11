import User from "../models/userModel.js";
import UserDetail from "../models/userDetailModel.js";
import Photo from "../models/photoModel.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import {indexUser,searchUser} from "../elacticsearch.js";
import {v2 as cloudinary} from "cloudinary";

const createUser = async (req, res) => {
    try {
        req.body.passWord = await bcrypt.hash(req.body.passWord, 10);
        const user = await User.create(req.body);
        await UserDetail.create({ user: user._id });
        res.status(200).json({
            succeded: true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            succeded: true,
            users,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
const getUserbyId = async (req, res) => {
    try {
        const user = await UserDetail.findOne({ user: req.params.id }).populate('user');
        if (!user) {
            return res.status(404).json({
                succeded: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            succeded: true,
            userInfo: user,
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            message: error.message
        });
    }
};
const getAllPhotoByUser = async (req, res) => {
    try {
        if (!res.locals.user || !res.locals.user._id) {
            return res.status(401).json({
                succeded: false,
                message: "User not authenticated.",
            });
        }
        
        const photos = await Photo.find({ user: res.locals.user._id }).populate('user').populate('comments.user');
        if (photos.length === 0) {
            return res.status(404).json({
                succeded: false,
                message: "No photos found for this user.",
            });
        }

        res.status(200).json({
            succeded: true,
            photos,
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
const getAllPhotoByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const photos = await Photo.find({ user: userId}).populate('user').populate('comments.user');
        if (photos.length === 0) {
            return res.status(404).json({
                succeded: false,
                message: "No photos found for this user.",
            });
        }

        res.status(200).json({
            succeded: true,
            photos,
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
const searchUsers = async (req, res) =>{
    const { userName } = req.query;
  if (userName.length < 3) {
    return res.status(400).json({ message: 'Arama en az 3 karakter olmalı.' });
  }

  try {
    const users = await User.find({ userName: { $regex: userName, $options: 'i' } }).limit(5);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
  
};
const indexUsertoElactic = async (user) => {
    try {
        await indexUser(user);
        res.status(201).json({ message: 'Kullanıcı başarıyla eklendi' });
      } catch (error) {
        res.status(500).json({ error: 'Kullanıcı ekleme sırasında bir hata oluştu' });
      }
}
const searchUserElacticIndex = async (userName) => {
    try {
        const users = await searchUser(userName);
        res.json(users);
      } catch (error) {
        console.error('Elasticsearch arama hatası:', error);
        res.status(500).json({ error: 'Arama sırasında bir hata oluştu' });
      }
}
const followUnfollowUser = async (req, res) =>{
    try {
        const user = await UserDetail.findOne({user: req.body.userId});
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        if (JSON.parse(req.body.follow)) {
            user.followers.addToSet(res.locals.user._id);
        } else {
            user.followers.pull(res.locals.user._id);
        }

        await user.save();
        res.json(
            {
                followers: user.followers
            });
    } catch (error) {
        res.status(500).json({ message: error.message,

         });
    }
  
};
const updateUserDetail = async (req,res) => {
    let profilePictureUrl = null;
        
        if (req.files && req.files.profilePicture && req.files.profilePicture.tempFilePath) {
            const result = await cloudinary.uploader.upload(req.files.profilePicture.tempFilePath, {
                use_filename: true,
                folder: 'ProfilePic'
            });
            profilePictureUrl = result.secure_url;
        }
    console.log(req.body.interests)
    const interest = JSON.parse(req.body.interests);
    console.log(interest);
    try {
        const userDetailId = req.body.userDetailId; // URL'den id'yi al
        const updateData = {
          bio: req.body.bio,
          location: req.body.location,
          website: req.body.website,
          interests: JSON.parse(req.body.interests), // JSON formatındaki ilgileri ayrıştır
          profilePicture: profilePictureUrl // Profil resmi var mı kontrol et
        };
    
        // Kullanıcı detaylarını güncelle
        const updatedUserDetail = await UserDetail.findByIdAndUpdate(userDetailId, updateData, { new: true });
    
        if (!updatedUserDetail) {
          return res.status(404).send('Kullanıcı detayları bulunamadı');
        }
    
        res.status(200).json(updatedUserDetail); // Güncellenmiş kullanıcı detaylarını döndür
      } catch (error) {
        console.error('Güncellenirken hata oluştu:', error);
        res.status(500).send('Sunucu hatası');
    }
    
}
const getUserdetail = async (req, res) => {
    try {
        const userDetail = await UserDetail.findOne({ user: res.locals.user._id }).populate('user', 'userName eMail');
        if (!userDetail) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        res.status(200).json(userDetail);

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}
export {
    createUser,
    getAllUsers,
    getUserbyId,
    getAllPhotoByUser,
    getAllPhotoByUserId,
    searchUsers,
    searchUserElacticIndex,
    indexUsertoElactic,
    followUnfollowUser,
    updateUserDetail,
    getUserdetail
};