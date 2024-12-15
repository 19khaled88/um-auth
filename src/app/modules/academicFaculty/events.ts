import { RedisClient } from "../../../shared/redis"
import { EVENT_ACADEMIC_FACULTY_CREATED, EVENT_ACADEMIC_FACULTY_UPDATED } from "./constant";
import { IAcademicFacultyFromEvents } from "./interface";
import { academicFacultyService } from "./services";


const academicFacultyEvent = () =>{
    RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_CREATED,async(e:string)=>{
        const data:IAcademicFacultyFromEvents = JSON.parse(e);
        await academicFacultyService.createFacultyFromEvents(data)
    });

    RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_UPDATED,async(e:string)=>{
        const data = JSON.parse(e);
        await academicFacultyService.updateFacultyFromEvents(data)
    })
}


export default academicFacultyEvent;