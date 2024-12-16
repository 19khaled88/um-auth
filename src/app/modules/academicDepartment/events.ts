import { RedisClient } from "../../../shared/redis"
import { EVENT_ACADEMIC_DEPARTMENT_CREATED, EVENT_ACADEMIC_DEPARTMENT_DELETED, EVENT_ACADEMIC_DEPARTMENT_UPDATED } from "./constant";
import { IAcademicDepartmentFromEvents } from "./interface";

import { academicDepartmentService } from "./services";


const academicDepartmentEvent = () =>{
    RedisClient.subscribe(EVENT_ACADEMIC_DEPARTMENT_CREATED,async(e:string)=>{
        const data:IAcademicDepartmentFromEvents = JSON.parse(e);
        await academicDepartmentService.createDepartmentFromEvents(data)
    });

    RedisClient.subscribe(EVENT_ACADEMIC_DEPARTMENT_UPDATED,async(e:string)=>{
        const data:IAcademicDepartmentFromEvents = JSON.parse(e);
        await academicDepartmentService.updateDepartmentFromEvents(data)
    });

    RedisClient.subscribe(EVENT_ACADEMIC_DEPARTMENT_DELETED,async(e:string)=>{
        const data:IAcademicDepartmentFromEvents = JSON.parse(e);
        await academicDepartmentService.deleteDepartmentFromEvents(data)
    })
}


export default academicDepartmentEvent;