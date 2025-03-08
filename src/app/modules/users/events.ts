import { RedisClient } from "../../../shared/redis";
import { EVENT_SUPER_ADMIN_CREATE_RESPONSE } from "./users.constats";


const userEvents =() =>{ 
        RedisClient.subscribe(EVENT_SUPER_ADMIN_CREATE_RESPONSE,async(e:string)=>{
            const data = JSON.parse(e);
            // await superAdminSerivce.delete_super_admin_from_events(data)
            
        })
}

export default userEvents