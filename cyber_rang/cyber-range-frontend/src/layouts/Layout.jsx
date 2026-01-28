import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Terminal, Shield, FileText, User, LogOut, Clock } from 'lucide-react';
import './Layout.css';
import PropTypes from 'prop-types';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <Shield size={24} className="text-accent" />
                <span>CYBERRANGE</span>
            </div>

            <nav className="sidebar-nav">
                <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/labs" className={`nav-item ${isActive('/labs') ? 'active' : ''}`}>
                    <Terminal size={20} />
                    <span>Lab Catalog</span>
                </Link>
                <Link to="/docs" className={`nav-item ${isActive('/docs') ? 'active' : ''}`}>
                    <FileText size={20} />
                    <span>Documentation</span>
                </Link>
                <Link to="/history" className={`nav-item ${isActive('/history') ? 'active' : ''}`}>
                    <Clock size={20} />
                    <span>History</span>
                </Link>
                {user?.role === 'admin' && (
                    <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <Shield size={20} className="text-danger" />
                        <span className="text-danger">Admin Console</span>
                    </Link>
                )}
            </nav>

            <div className="sidebar-footer">
                <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
                    <User size={20} />
                    <span>Profile</span>
                </Link>
                <button className="nav-item btn-logout" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node
};

export default Layout;
