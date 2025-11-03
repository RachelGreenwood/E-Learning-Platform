import { Link } from 'react-router-dom';
import AuthenticationButton from "./AuthenticationButton";

export default function NavBar({ profile }) {
    return (
        <div>
            <nav>
                <ul>
                    <li><AuthenticationButton /></li>
                    {profile && <li><Link className='link' to="/profile"><div>Profile</div></Link></li>}
                    {profile && <li><Link className='link' to="/user-search">See All Users</Link></li>}
                    {profile?.role === "Instructor" && (
                        <li><Link className='link' to="/create-course">Create Course</Link></li>
                    )}
                    {profile && <li><Link className='link' to="/course-list">Course List</Link></li>}
                    {profile?.role === "Student" && (
                        <li><Link className='link' to="/enrolled-courses">Enrolled Courses</Link></li>
                    )}
                    {profile?.role === "Instructor" && (
                        <li><Link className='link' to="/handle-enrollment">Handle Enrollments</Link></li>
                    )}
                    <li><Link className='link' to="/grades">Grades</Link></li>
                    {profile?.role === "Instructor" && (
                        <li><Link className='link' to="/my-courses">My Courses</Link></li>
                    )}
                </ul>
            </nav>
        </div>
    )
}