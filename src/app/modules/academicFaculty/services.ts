// only business logic intregrated in services

import { SortOrder } from "mongoose"
import config from "../../../config"
import { paginationHelper } from "../../../helper/paginationHelper"
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces"
import { IAcademicFaculty, IAcademicFacultyFilters, IAcademicFacultyFromEvents } from "./interface"
import { AcademicFaculty } from "./model"
import { academicFacultySearchableFiels } from "../../../constants/academicFaculty"

const createAcademicFaculty = async(academicFaculty:IAcademicFaculty):Promise<IAcademicFaculty | null>=>{
    const result = await AcademicFaculty.create(academicFaculty) 

    return result
   
}

const getAllAcademicFaculties = async(filters:IAcademicFacultyFilters,paginationOptions:IPagniationOptions):Promise<IGenericResponse<IAcademicFaculty[]>>=>{
    const {searchTerm,...filtersData} = filters
    const {page,limit,skip,sortBy, sortOrder} = paginationHelper.calculatePagination(paginationOptions)

    const sortConditions:{[key:string] : SortOrder} ={}

    
    const andCondition = []

    // Initial search using string fields with regex
    if(searchTerm){
        andCondition.push({
            $or:academicFacultySearchableFiels.map((field)=>({
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

    let result = await AcademicFaculty
    .find({$and:andCondition.length > 0 ? andCondition: [{}] })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

    // const total = await AcademicSemester.countDocuments()
    let total = await AcademicFaculty.countDocuments({ $and: andCondition.length > 0 ? andCondition : [{}] });

    return {
        meta:{
            page,
            limit,
            total,
        },
        data:result
    }

}

const singleAcademicFaculty = async(id:string)=>{
    const result = await AcademicFaculty.findById(id)

    return result
}

const deleteAcademicFaculty = async(id:string)=>{
    const result = await AcademicFaculty.findByIdAndDelete({_id:id},{new:true})
    return result
}

const updateAcademicFaculty = async(id:string,payload:Partial<IAcademicFaculty>)=>{
    const result = await AcademicFaculty.findByIdAndUpdate({_id:id},payload,{new:true})
    return result
}

const createFacultyFromEvents = async (
  e:IAcademicFacultyFromEvents
): Promise<void> => {
  await AcademicFaculty.create({
    title: e.title,
    syncId: e.id,
  });
};

const updateFacultyFromEvents = async (e:IAcademicFacultyFromEvents): Promise<void> => {
  await AcademicFaculty.findOneAndUpdate({ syncId: e.id },{
    $set:{
        title: e.title
    }
  }
    
  );
};


export const academicFacultyService = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    singleAcademicFaculty,
    deleteAcademicFaculty,
    updateAcademicFaculty,
    createFacultyFromEvents,
    updateFacultyFromEvents
}