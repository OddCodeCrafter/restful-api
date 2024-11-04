import { deleteUserById, getUserById, getUsers } from "../users";
import express from "express"

export const getAllUsers = async(req: express.Request, res: express.Response ) =>{
    try{
        const user = await getUsers();
        return res.status(200).json(user);
    } catch(error) {
        console.log(error);
        return res.status(400);
    }
}

export const deleteUser = async(req: express.Request, res: express.Response ) =>{
    try{
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.status(200).json(deletedUser);
    } catch(error) {
        console.log(error);
        return res.status(400);
    }
}

export const updateUser = async(req: express.Request, res: express.Response ) =>{
    try{
        const { username } = req.body;
        const { id } = req.params;

        if(!username){
            return res.status(403);
        }

        const user = await getUserById(id);

        user.username = username;

        await user.save();

        return res.status(200).json(user);

    } catch(error) {
        console.log(error);
        return res.status(400);
    }
}