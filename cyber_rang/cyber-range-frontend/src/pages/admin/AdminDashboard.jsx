import { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import { adminService } from '../../services/admin.service';
import { Users, Server, Activity, Trash2, AlertTriangle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsData, usersData, sessionsData] = await Promise.all([
                adminService.getStats(),
                adminService.getUsers(),
                adminService.getActiveSessions()
            ]);
            setStats(statsData);
            setUsers(usersData);
            setSessions(sessionsData);
        } catch (error) {
            console.error("Admin load error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEmergencyStop = async () => {
        if (window.confirm('WARNING: This will forcefully STOP and REMOVE ALL running lab containers for ALL users. Continue?')) {
            try {
                await adminService.emergencyStopAll();
                alert('Emergency Stop Executed.');
                loadData();
            } catch (e) {
                alert('Failed: ' + e.message);
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? Irreversible action.')) {
            try {
                await adminService.deleteUser(userId);
                loadData(); // Refresh
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

    if (loading) return <Layout><div className="flex-center h-full">Loading Admin Console...</div></Layout>;

    return (
        <Layout>
            <div className="admin-header mb-xl">
                <h1 className="text-2xl font-bold text-danger">ADMINISTRATOR <span className="text-white">CONSOLE</span></h1>
                <p className="text-muted">System Level Access</p>
            </div>

            {/* Active Sessions Control */}
            <div className="admin-toolbar">
                <Button className="bg-danger-glow" onClick={handleEmergencyStop}>
                    <AlertTriangle size={20} /> EMERGENCY STOP ALL SESSIONS
                </Button>
            </div>

            <div className="admin-stats-grid mb-xl">
                <Card className="admin-stat-card">
                    <div className="stat-icon"><Users /></div>
                    <div>
                        <h3>Total Users</h3>
                        <span className="stat-num">{stats?.users || 0}</span>
                    </div>
                </Card>
                <Card className="admin-stat-card">
                    <div className="stat-icon"><Server /></div>
                    <div>
                        <h3>Total Labs</h3>
                        <span className="stat-num">{stats?.labs || 0}</span>
                    </div>
                </Card>
                <Card className="admin-stat-card">
                    <div className="stat-icon text-danger"><Activity /></div>
                    <div>
                        <h3>Active Sessions</h3>
                        <span className="stat-num">{stats?.activeSessions || 0}</span>
                    </div>
                </Card>
            </div>

            {/* User Management */}
            <h2 className="section-title mb-md">User Registry</h2>
            <Card className="user-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Points</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar-sm">{user.username.charAt(0)}</div>
                                        {user.username}
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                                </td>
                                <td className="font-mono">{user.stats?.points || 0}</td>
                                <td>
                                    {user.role !== 'admin' && (
                                        <button className="btn-icon-danger" onClick={() => handleDeleteUser(user._id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </Layout>
    );
};

export default AdminDashboard;
