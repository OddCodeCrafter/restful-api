import { getUserByEmail, createUser } from "../users";
import { random, authentication } from "../helpers/index";
import express from "express";


export const login = async (req:express.Request, res: express.Response) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "All fields are Required"});
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }

        const salt = random();

        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('SUALEH-AUTH', user.authentication.sessionToken, {domain:'localhost',path: '/'});

        return res.status(200).json(user);

    }
    catch(err) {
        console.log(err);
        return res.status(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exist" });
        }

        const salt = random();

        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
