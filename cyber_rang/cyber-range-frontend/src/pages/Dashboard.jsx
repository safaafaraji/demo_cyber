import { useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import Card from '../components/atoms/Card';
import './Dashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Award, Server } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ labsCompleted: 0, points: 0, activeSessions: 0 });
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (user) {
            setStats({
                labsCompleted: user.stats?.labsCompleted || 0,
                points: user.stats?.points || 0,
                activeSessions: 0
            });
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/history');
            setHistory(res.data.slice(0, 5));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout>
            <header className="dashboard-header mb-xl">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, <span className="text-accent">{user?.username || 'Operator'}</span></h1>
                    <p className="text-muted">System Status: <span className="text-success">OPERATIONAL</span></p>
                </div>
            </header>

            <div className="stats-grid mb-xl">
                <Card className="stat-card">
                    <div className="stat-icon bg-blue"><Activity /></div>
                    <div className="stat-info">
                        <h3>Active Labs</h3>
                        <span className="stat-value">{stats.activeSessions}</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon bg-purple"><Award /></div>
                    <div className="stat-info">
                        <h3>Points Earned</h3>
                        <span className="stat-value">{stats.points}</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon bg-green"><Server /></div>
                    <div className="stat-info">
                        <h3>Machines Pwned</h3>
                        <span className="stat-value">{stats.labsCompleted}</span>
                    </div>
                </Card>
            </div>

            <h2 className="section-title mb-md">Recent Activity</h2>
            <Card>
                {history.length === 0 ? (
                    <div className="empty-state">
                        <p>No recent activity detected. Start a lab to begin.</p>
                    </div>
                ) : (
                    <ul className="activity-list">
                        {history.map(item => (
                            <li key={item._id} className="activity-item flex-between p-sm border-b">
                                <div className="flex-center gap-md">
                                    <div className="text-accent text-xs font-mono">{item.action}</div>
                                    <div className="text-sm">{item.target}</div>
                                </div>
                                <div className="text-xs text-muted">{new Date(item.createdAt).toLocaleDateString()}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </Layout>
    );
};

export default Dashboard;
