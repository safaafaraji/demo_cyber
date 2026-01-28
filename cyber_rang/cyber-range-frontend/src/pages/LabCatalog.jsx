import { useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { labService } from '../services/lab.service';
import { sessionService } from '../services/session.service';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Terminal as TerminalIcon, Play, AlertCircle, Power, Cpu, Plus, Flag, History as HistoryIcon } from 'lucide-react';
import Terminal from '../components/organisms/Terminal';
import './LabCatalog.css';

const LabCatalog = () => {
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSession, setActiveSession] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [flag, setFlag] = useState('');
    const [flagResult, setFlagResult] = useState(null);
    const { user } = useAuth(); // Get user
    const navigate = useNavigate(); // Add navigate

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [labsData, sessionData] = await Promise.all([
                labService.getAllLabs(),
                sessionService.getActiveSession()
            ]);
            setLabs(labsData);
            setActiveSession(sessionData); // May be null or object
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleStartLab = async (labId) => {
        if (activeSession) {
            alert("You already have an active session. Stop it first.");
            return;
        }
        setActionLoading(true);
        try {
            const session = await sessionService.startSession(labId);
            setActiveSession(session);
            // Refresh logic if needed to get full populated lab info
            loadData();
        } catch (err) {
            alert('Failed to start lab: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleStopSession = async () => {
        if (!activeSession) return;
        setActionLoading(true);
        try {
            await sessionService.stopSession(activeSession._id);
            setActiveSession(null);
            setFlag('');
            setFlagResult(null);
        } catch (err) {
            alert('Failed to stop session: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleVerifyFlag = async (e) => {
        e.preventDefault();
        if (!flag) return;
        setActionLoading(true);
        try {
            const result = await labService.verifyFlag(activeSession.lab._id, flag);
            setFlagResult(result);
            if (result.success) {
                alert(result.message);
            }
        } catch (err) {
            setFlagResult({ success: false, message: 'Error verifying flag' });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Layout>
            <div className="lab-catalog-header mb-xl">
                <div className="flex-center" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        <h1 className="text-2xl font-bold">Lab <span className="text-accent">Catalog</span></h1>
                        <p className="text-muted">Select a vulnerability to practice.</p>
                    </div>
                    <div className="flex-center gap-md">
                        <Button variant="outline" onClick={() => navigate('/history')}>
                            <HistoryIcon size={18} /> Logs
                        </Button>
                        <Button onClick={() => navigate('/labs/create')}>
                            <Plus size={18} /> Create Lab
                        </Button>
                    </div>
                </div>
            </div>

            {activeSession && (
                <>
                    <Card className="active-session-card mb-lg">
                        <div className="active-session-content">
                            <div className="session-info">
                                <span className="live-badge"><span className="pulse"></span> LIVE SESSION</span>
                                <h2 className="text-xl font-bold mt-sm">{activeSession.lab?.name || 'Unknown Lab'}</h2>
                            </div>
                            <div className="session-actions">
                                <Button variant="danger" onClick={handleStopSession} disabled={actionLoading}>
                                    <Power size={18} />
                                    {actionLoading ? 'Stopping...' : 'Stop Instance'}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div className="lab-workspace grid-2 gap-lg mb-xl">
                        <Card className="terminal-container">
                            <div className="flex-between mb-sm">
                                <h3 className="text-sm font-bold flex-center gap-xs"><TerminalIcon size={14} /> SECURE SHELL</h3>
                                <span className="text-xs text-muted">Connected to: {activeSession.containerId?.substring(0, 8)}</span>
                            </div>
                            <Terminal
                                sessionId={activeSession._id}
                                token={localStorage.getItem('accessToken')}
                            />
                        </Card>

                        <Card className="flag-submission-card">
                            <h3 className="text-sm font-bold mb-md uppercase tracking-wider">Verification protocol</h3>
                            <div className="flag-submission-area">
                                <form onSubmit={handleVerifyFlag} className="flex-center" style={{ gap: '10px' }}>
                                    <Input
                                        id="flag-input"
                                        placeholder="Enter Flag {FLAG-...}"
                                        value={flag}
                                        onChange={(e) => setFlag(e.target.value)}
                                        style={{ marginBottom: 0, flex: 1 }}
                                    />
                                    <Button type="submit" disabled={actionLoading || !flag}>
                                        <Flag size={18} /> Check
                                    </Button>
                                </form>
                                {flagResult && (
                                    <div className={`text-sm mt-sm ${flagResult.success ? 'text-success' : 'text-danger'}`}>
                                        {flagResult.message}
                                    </div>
                                )}
                            </div>
                            <div className="mt-xl text-xs text-muted">
                                <p><strong>Instructions:</strong> Use the terminal to exploit the vulnerability. Once you find the hidden flag file, submit it here to claim your points.</p>
                            </div>
                        </Card>
                    </div>
                </>
            )}

            {loading && <div className="flex-center loading-state">Fetching catalog protocols...</div>}

            {error && (
                <div className="alert alert-danger mb-lg">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="labs-grid">
                    {labs.map((lab) => (
                        <Card key={lab._id} className="lab-card">
                            <div className="lab-icon mb-md">
                                <TerminalIcon size={32} />
                            </div>
                            <div className="lab-content">
                                <div className="lab-header mb-sm">
                                    <h3 className="lab-title">{lab.name}</h3>
                                    <span className={`difficulty-badge ${lab.difficulty}`}>
                                        {lab.difficulty}
                                    </span>
                                </div>
                                <p className="lab-description text-muted mb-lg">
                                    {lab.description}
                                </p>
                                <div className="lab-footer">
                                    <div className="lab-meta">
                                        <span className="text-accent">{lab.points} PTS</span>
                                        <span className="text-muted text-sm">{lab.category?.name || 'General'}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleStartLab(lab._id)}
                                        disabled={actionLoading || !!activeSession}
                                        className={activeSession?.lab?._id === lab._id ? 'btn-active-session' : ''}
                                        variant={activeSession?.lab?._id === lab._id ? 'outline' : 'primary'}
                                    >
                                        <Play size={16} />
                                        {activeSession?.lab?._id === lab._id ? 'Active' : 'Start Lab'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default LabCatalog;
