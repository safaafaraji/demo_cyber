import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import './AuthFields.css';

const VerifyEmail = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from query params or state
    const email = new URLSearchParams(location.search).get('email') || location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Missing email address. Please try registering again.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await verifyEmail(email, code);
            alert('Verification successful! You can now access the platform.');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-brand">
                    <h1>CYBER<span className="text-accent">RANGE</span></h1>
                    <p>Verification Protocol</p>
                </div>
                <Card className="auth-card">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center mb-md">Verify Email</h2>
                        <p className="text-center text-muted mb-lg">A 6-digit code has been sent to <strong>{email}</strong></p>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <Input
                            id="code"
                            label="Verification Code"
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />

                        <Button type="submit" variant="primary" className="w-full mt-md" disabled={loading}>
                            {loading ? 'Verifying...' : 'Finalize Activation'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default VerifyEmail;
