import jwt from "jsonwebtoken"; //tokens for each user


export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '15d'
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //milliseconds of 15 fays
        httpOnly: true, //prevent XSS attacks cross-stire scripting attack
        sameSite: "strict", // CSRF attacks cross-stire request forgery attack 
        secure: process.env.NODE_ENV !== "development",
    });
};