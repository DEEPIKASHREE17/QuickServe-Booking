import { Link } from 'react-router-dom';

function Navbar() {
    const user = JSON.parse(localStorage.getItem('user') || '{}') || {};
    const isAdmin = user.role === 'ADMIN';
    const isProvider = user.role === 'PROVIDER';

    return (
        <nav className="navbar">
            <Link to={isAdmin ? "/admin-dashboard" : isProvider ? "/provider-dashboard" : "/categories"} className="navbar-brand">QuickServe</Link>
            <div className="navbar-links">
                {isAdmin ? (
                    <Link to="/admin-dashboard" className="navbar-link">Admin Panel</Link>
                ) : isProvider ? (
                    <>
                        <Link to="/provider-dashboard" className="navbar-link">Dashboard</Link>
                        <Link to="/module5" className="navbar-link">Service Portal</Link>
                    </>
                ) : (
                    <>
                        <Link to="/categories" className="navbar-link">Categories</Link>
                        <Link to="/providers" className="navbar-link">Providers</Link>
                        <Link to="/my-bookings" className="navbar-link">My Bookings</Link>
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
