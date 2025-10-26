import { useLocation } from "react-router-dom";

export default function CourseEnrollments() {
    const location = useLocation();
    const course = location.state?.course;

    return (
        <div>
            <h1>{course?.name}</h1>
        </div>
    )
}