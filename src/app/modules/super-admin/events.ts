import { RedisClient } from "../../../shared/redis";
import { EVENT_SUPER_ADMIN_DELETED } from "./constant";
import { superAdminSerivce } from "./service";



const supserAdminEvents =() =>{
    RedisClient.subscribe(EVENT_SUPER_ADMIN_DELETED,async(e:string)=>{
        const data = JSON.parse(e);
        await superAdminSerivce.delete_super_admin_from_events(data)
    })
}

export default supserAdminEvents