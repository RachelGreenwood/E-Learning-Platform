import { Link } from 'react-router-dom';
import AuthenticationButton from "./AuthenticationButton";

export default function NavBar({ profile }) {
    return (
        <div>
            <nav>
                <ul>
                    <li><AuthenticationButton /></li>
                    <li><Link className='link' to="/profile"><div>Profile</div></Link></li>
                    <li><Link className='link' to="/user-search">See All Users</Link></li>
                    {profile?.role === "Instructor" && (
                        <li><Link className='link' to="/create-course">Create Course</Link></li>
                    )}
                    <li><Link className='link' to="/course-list">Course List</Link></li>
                    <li><Link className='link' to="/enrolled-courses">Enrolled Courses</Link></li>
                </ul>
            </nav>
        </div>
    )
}