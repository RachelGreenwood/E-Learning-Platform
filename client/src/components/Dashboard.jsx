import Profile from "./Profile.jsx";
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
        <nav>
            <ul>
                <li></li>
            </ul>
        </nav>
        <h1>Welcome to your Dashboard!</h1>;
        <li><Link className='link' to="/profile"><div>Profile</div></Link></li>
    </div>
  )
}