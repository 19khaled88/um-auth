import { RedisClient } from "../../../shared/redis"
import { EVENT_ACADEMIC_SEMESTER_CREATED, EVENT_ACADEMIC_SEMESTER_DELETED, EVENT_ACADEMIC_SEMESTER_UPDATED } from "./academicSemester.constant"
import { IAcademicSemesterFromEvent } from "./academicSemester.interface";
import { AcademicSemesterService } from "./academicSemester.service";


const academicSemesterEvent = () =>{
    RedisClient.subscribe(EVENT_ACADEMIC_SEMESTER_CREATED,async(e:string)=>{
        const data:IAcademicSemesterFromEvent = JSON.parse(e);
        await AcademicSemesterService.createSemesterFromEvents(data);
    });

    RedisClient.subscribe(EVENT_ACADEMIC_SEMESTER_UPDATED,async(e:string)=>{
        const data = JSON.parse(e);
        await AcademicSemesterService.updateSemesterFromEvents(data);
    });

    RedisClient.subscribe(EVENT_ACADEMIC_SEMESTER_DELETED,async(e:string)=>{
        const data = JSON.parse(e);
        await AcademicSemesterService.deleteSemesterFromEvents(data);
    });
    
}


export default academicSemesterEvent;
