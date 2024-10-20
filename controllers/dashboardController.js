import User from "../models/userModel.js";
import Photo from "../models/photoModel.js";

const getDashboardPagebyId = async (req, res) => {

    try {
        const photos = await Photo.find({user: res.locals.user._id})
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
export {getDashboardPagebyId};