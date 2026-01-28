import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { GoogleLogin } from '@react-oauth/google';
import './AuthFields.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/');
        } catch (err) {
            setError('Google registration failed. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(username, email, password);
            // Automatically redirect to verify-email
            navigate('/verify-email', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-brand">
                    <h1>CYBER<span className="text-accent">RANGE</span></h1>
                    <p>Initialize Access Protocol</p>
                </div>
                <Card className="auth-card">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center mb-lg">Register</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <Input
                            id="username"
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Input
                            id="email"
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="primary" className="w-full mt-md" disabled={loading}>
                            {loading ? 'Registering...' : 'Initialize Account'}
                        </Button>

                        <div className="auth-divider">SECURE SSO</div>

                        <div className="flex-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google registration failed')}
                                theme="filled_blue"
                                shape="pill"
                                text="continue_with"
                                width="340px"
                            />
                        </div>
                    </form>
                    <div className="auth-footer">
                        <p>Already have clearance? <Link to="/login" className="text-accent">Access Terminal</Link></p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
