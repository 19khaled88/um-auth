// only business logic intregrated in services

import config from "../../../config"
import { IUser } from "./users.interface"
import { User } from "./users.model"
import { generateUserId } from "./users.utils"

const createUser = async(user:IUser):Promise<IUser | null>=>{
    //generated pass
    const id =await generateUserId()
    user.id

    //default pass
    if(!user.password){
        user.password = config.default_st_pass as string
    }

    const createdUser = await User.create(user)

    if(!createdUser){
        throw new Error('Failed to create user')
    }
    return createdUser;
}


export default {
    createUser
}