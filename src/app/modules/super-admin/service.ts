import { User } from "../users/users.model";
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

const delete_super_admin_from_events=async(e:any)=>{
  try {
    const ifExist = await SuperAdmin.findOne({
      _id:e.syncId
    });

    if (!ifExist) {
      console.log(`SuperAdmin with ID ${e.id} does not exist.`);
      return;
    }

    const result = await SuperAdmin.deleteOne({_id:e.syncId});
    if(result.acknowledged && result.deletedCount === 1){
      await User.deleteOne({
        superAdmin:e.syncId
      })
    }
    
  } catch (error) {
   
  }
}

export const superAdminSerivce = {
    delete_super_admin_from_events,
    checkIfSuperAdminDuplicate
  };
  