import { useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import Card from '../components/atoms/Card';
import api from '../services/api';
import { Clock, Terminal, Shield, Activity } from 'lucide-react';
import './History.css';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/history');
                setHistory(response.data);
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getIcon = (action) => {
        if (action.includes('SESSION')) return <Clock className="text-accent" size={18} />;
        if (action.includes('FLAG')) return <Shield className="text-success" size={18} />;
        if (action.includes('TERMINAL')) return <Terminal className="text-warning" size={18} />;
        if (action.includes('LOGIN')) return <Activity className="text-primary" size={18} />;
        return <Activity size={18} />;
    };

    if (loading) return <Layout><div className="flex-center h-full">Decrypting logs...</div></Layout>;

    return (
        <Layout>
            <div className="history-header mb-xl">
                <h1 className="text-2xl font-bold">Operation <span className="text-accent">History</span></h1>
                <p className="text-muted">A secure audit trail of all platform interactions.</p>
            </div>

            <Card className="history-card">
                {history.length === 0 ? (
                    <div className="text-center py-xl text-muted">No activity found in the secure log.</div>
                ) : (
                    <div className="history-timeline">
                        {history.map((log) => (
                            <div key={log._id} className="history-item">
                                <div className="history-icon">
                                    {getIcon(log.action)}
                                </div>
                                <div className="history-details">
                                    <div className="flex-between">
                                        <h3 className="font-bold">{log.action.replace('_', ' ')}</h3>
                                        <span className="text-xs text-muted">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm">Target: <span className="text-accent">{log.target}</span></p>
                                    {log.details && (
                                        <div className="history-meta text-xs font-mono mt-xs">
                                            {JSON.stringify(log.details)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </Layout>
    );
};

export default History;
