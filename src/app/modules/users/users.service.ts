// only business logic intregrated in services

import { SortOrder } from "mongoose"
import config from "../../../config"
import { paginationHelper } from "../../../helper/paginationHelper"
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces"
import { IUser, IUserFilters } from "./users.interface"
import { User } from "./users.model"
import { generateUserId } from "./users.utils"
import { usersSearchableFiels } from "../../../constants/user"

const createUser = async(user:IUser):Promise<IUser | null>=>{
    
    //generated pass
    const id = await generateUserId()
    user.id = id

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

const getAllUsers = async(filters:IUserFilters,paginationOptions:IPagniationOptions):Promise<IGenericResponse<IUser[]>>=>{
    const {searchTerm,...filtersData} = filters
    const {page,limit,skip,sortBy, sortOrder} = paginationHelper.calculatePagination(paginationOptions)

    const sortConditions:{[key:string] : SortOrder} ={}

    
    const andCondition = []

    // Initial search using string fields with regex
    if(searchTerm){
        andCondition.push({
            $or:usersSearchableFiels.map((field)=>({
                [field]:{
                    $regex:searchTerm,
                    $options:'i'
                }
            }))
        })
    }

    if(Object.keys(filtersData).length){
        andCondition.push({
            $and:Object.entries(filtersData).map(([field, value])=>({
                [field]:value
            }))
        })
    }

    if(sortBy && sortOrder){
        sortConditions[sortBy] = sortOrder;
    }

    let result = await User
    .find({$and:andCondition.length > 0 ? andCondition: [{}] })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

    // const total = await AcademicSemester.countDocuments()
    let total = await User.countDocuments({ $and: andCondition.length > 0 ? andCondition : [{}] });

    return {
        meta:{
            page,
            limit,
            total,
        },
        data:result
    }

}

const singleUser = async(id:string)=>{
    const result = await User.findById(id)

    return result
}

const deleteUser = async(id:string)=>{
    const result = await User.findByIdAndDelete({_id:id},{new:true})
    return result
}

const updateUser = async(id:string,payload:Partial<IUser>)=>{
    const result = await User.findByIdAndUpdate({_id:id},payload,{new:true})
    return result
}


export const userService = {
    createUser,
    getAllUsers,
    singleUser,
    deleteUser,
    updateUser
}