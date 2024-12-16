import academicDepartmentEvent from "../modules/academicDepartment/events";
import academicFacultyEvent from "../modules/academicFaculty/events";
import academicSemesterEvent from "../modules/academicSemester/academicSemester.event"

const subscribeToEvents =()=>{
    academicSemesterEvent();
    academicFacultyEvent();
    academicDepartmentEvent();
}

export default subscribeToEvents;