import User from "../models/user.model.js"
import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({ message:"User not found" });

        const userNotifications = await Notification.find({ to: userId })
        .populate({
            path: "from",
            select: "username profileImg"
        });
        //.sort({ createdAt: -1 });

        await Notification.updateMany({to: userId}, {read:true});
        
        return res.status(200).json(userNotifications);


    } catch (error) {
        console.log("Error in getNotifications route: ", error.message);
        res.status(500).json({ error:"Internal sever error" });
    }
}

export const deleteNotifications = async(req, res) =>{
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        res.status(200).json({ message:"Notifications deleted sucessfully" });

    } catch (error) {
        console.log("Error in deleteNotifications route: ", error.message);
        res.status(500).json({ error:"Internal sever error" });
    }
}