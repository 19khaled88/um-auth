import academicFacultyEvent from "../modules/academicFaculty/events";
import academicSemesterEvent from "../modules/academicSemester/academicSemester.event"

const subscribeToEvents =()=>{
    academicSemesterEvent();
    academicFacultyEvent();
}

export default subscribeToEvents;