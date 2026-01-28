import { useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import Card from '../components/atoms/Card';
import { userService } from '../services/user.service';
import { User, Shield, Activity, Clock, Github } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        githubProfile: '',
        profilePicture: ''
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await userService.getProfile();
            setProfile(data);
            setFormData({
                username: data.username,
                password: '',
                githubProfile: data.githubProfile || '',
                profilePicture: data.profilePicture || ''
            });
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const updateData = {
                username: formData.username,
                githubProfile: formData.githubProfile,
                profilePicture: formData.profilePicture
            };
            if (formData.password) updateData.password = formData.password;

            await userService.updateProfile(updateData);
            alert('Profile updated successfully');
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            alert('Update failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return <Layout><div className="flex-center h-full">Loading Profile...</div></Layout>;

    return (
        <Layout>
            <div className="profile-header mb-xl flex-between">
                <h1 className="text-2xl font-bold">Operative <span className="text-accent">Profile</span></h1>
                {!isEditing && (
                    <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
            </div>

            <div className="profile-grid">
                <Card className="profile-info-card">
                    <div className="profile-avatar mb-md">
                        {profile?.profilePicture ? (
                            <img src={profile.profilePicture} alt="Profile" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <User size={64} />
                        )}
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="profile-edit-form w-full">
                            <div className="input-group mb-sm">
                                <label className="text-xs text-muted mb-xs block">PROFILE PICTURE URL</label>
                                <input
                                    className="input"
                                    value={formData.profilePicture}
                                    onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                                />
                            </div>
                            <div className="input-group mb-sm">
                                <label className="text-xs text-muted mb-xs block">USERNAME</label>
                                <input
                                    className="input"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group mb-sm">
                                <label className="text-xs text-muted mb-xs block">GITHUB PROFILE</label>
                                <input
                                    className="input"
                                    value={formData.githubProfile}
                                    onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                                    placeholder="github.com/username"
                                />
                            </div>
                            <div className="input-group mb-lg">
                                <label className="text-xs text-muted mb-xs block">NEW PASSWORD</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="flex-center gap-md">
                                <button type="submit" className="btn btn-primary" disabled={updateLoading}>
                                    {updateLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-center">{profile?.username}</h2>
                            <p className="text-center text-muted mb-md">{profile?.email}</p>

                            {profile?.githubProfile && (
                                <div className="flex-center text-muted text-sm mb-lg">
                                    <Github size={14} style={{ marginRight: 5 }} /> {profile.githubProfile}
                                </div>
                            )}

                            <div className="profile-badges flex-center">
                                <span className={`sc-badge ${profile?.role}`}>
                                    <Shield size={14} /> {profile?.role?.toUpperCase()}
                                </span>
                            </div>
                            {profile?.isVerified === false && (
                                <div className="text-xs text-warning mt-md text-center">Email not verified</div>
                            )}
                        </>
                    )}
                </Card>

                <div className="profile-stats-container">
                    <Card className="mb-lg">
                        <h3 className="card-title mb-md">Performance Statistics</h3>
                        <div className="stats-row">
                            <div className="stat-unit">
                                <span className="stat-label">Total Points</span>
                                <span className="stat-number text-accent">{profile?.stats?.points || 0}</span>
                            </div>
                            <div className="stat-unit">
                                <span className="stat-label">Labs Clear</span>
                                <span className="stat-number text-success">{profile?.stats?.labsCompleted || 0}</span>
                            </div>
                            <div className="stat-unit">
                                <span className="stat-label">Rank</span>
                                <span className="stat-number">#1</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="card-title mb-md">Recent Activity Log</h3>
                        <ul className="activity-list">
                            <li className="activity-item">
                                <Activity size={16} className="text-accent" />
                                <div>
                                    <p>System Login Successful</p>
                                    <span className="text-xs text-muted">Just now</span>
                                </div>
                            </li>
                            <li className="activity-item">
                                <Clock size={16} className="text-muted" />
                                <div>
                                    <p>Session Expired</p>
                                    <span className="text-xs text-muted">2 hours ago</span>
                                </div>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
