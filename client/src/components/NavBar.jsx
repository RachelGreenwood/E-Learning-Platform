import { Link } from 'react-router-dom';
import AuthenticationButton from "./AuthenticationButton";

export default function NavBar() {
    return (
        <div>
            <nav>
                <ul>
                    <li><AuthenticationButton /></li>
                    <li><Link className='link' to="/profile"><div>Profile</div></Link></li>
                    <li><Link className='link' to="/user-search">See All Users</Link></li>
                </ul>
            </nav>
        </div>
    )
}