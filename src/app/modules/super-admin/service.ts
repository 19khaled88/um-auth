import { SuperAdmin } from "./model";


const checkIfSuperAdminDuplicate=async(data:any)=>{
  try {
    const result = await SuperAdmin.findOne({
        $or:[
          {email: data.email}, 
          {contactNo: data.contactNo}, 
        ],
    });
    return result;
  } catch (error) {
      throw error;
  }
}

export const superAdminSerivce = {
   
    checkIfSuperAdminDuplicate
  };
  