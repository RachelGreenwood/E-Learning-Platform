import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <div>
            <nav>
                <ul>
                    <li>Login</li>
                    <li><Link className='link' to="/profile"><div>Profile</div></Link></li>
                </ul>
            </nav>
        </div>
    )
}