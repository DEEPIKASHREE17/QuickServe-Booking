import { Link } from 'react-router-dom';

function Navbar() {
    const user = JSON.parse(localStorage.getItem('user') || '{}') || {};
    const isProvider = user.role === 'PROVIDER';

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-brand">QuickServe</Link>
            <div className="navbar-links">
                {isProvider ? (
                    <>
                        <Link to="/bookings" className="navbar-link">Manage Bookings</Link>
                    </>
                ) : (
                    <>
                        <Link to="/categories" className="navbar-link">Categories</Link>
                        <Link to="/providers" className="navbar-link">Providers</Link>
                        <Link to="/bookings" className="navbar-link">My Bookings</Link>
                    </>
                )}
                <Link to="/profile" className="navbar-link">Profile</Link>
                <button onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                }} className="btn btn-outline" style={{ marginLeft: '10px' }}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
