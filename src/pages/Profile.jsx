import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { user, profile, logout, updateProfile, loading } = useAuth();
    const [languagePreference, setLanguagePreference] = useState(profile?.language_preference || 'auto');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleLanguageChange = async (e) => {
        const newLang = e.target.value;
        setLanguagePreference(newLang);

        setSaving(true);
        setMessage({ type: '', text: '' });

        const { success, error } = await updateProfile({
            language_preference: newLang,
        });

        setSaving(false);

        if (success) {
            setMessage({ type: 'success', text: 'Language preference saved!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
            setMessage({ type: 'error', text: error?.message || 'Failed to save preference' });
        }
    };

    const handleLogout = async () => {
        const { success } = await logout();
        if (success) {
            navigate('/');
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // TODO: Implement delete account
            alert('Delete account functionality will be implemented in Phase 2');
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div>Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-header">
                    <h1>Profile Settings</h1>
                    <p>Manage your account and preferences</p>
                </div>

                {message.text && (
                    <div className={`profile-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Information */}
                <div className="profile-section">
                    <h2>Profile Information</h2>
                    <div className="profile-info">
                        <div className="info-item">
                            <label>Display Name</label>
                            <div className="info-value">{profile?.display_name || user?.user_metadata?.display_name || 'Not set'}</div>
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <div className="info-value">{user?.email}</div>
                        </div>
                    </div>
                </div>

                {/* Language Preference */}
                <div className="profile-section">
                    <h2>Language Preference</h2>
                    <p className="section-description">
                        Choose your preferred language for AI responses
                    </p>
                    <div className="language-selector">
                        <select
                            value={languagePreference}
                            onChange={handleLanguageChange}
                            disabled={saving}
                        >
                            <option value="auto">Auto-detect</option>
                            <option value="en">English</option>
                            <option value="id">Bahasa Indonesia</option>
                        </select>
                        {saving && <span className="saving-indicator">Saving...</span>}
                    </div>
                </div>

                {/* Account Actions */}
                <div className="profile-section">
                    <h2>Account Actions</h2>
                    <div className="action-buttons">
                        <button
                            onClick={handleLogout}
                            className="logout-button"
                            disabled={loading}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="profile-section danger-zone">
                    <h2>Danger Zone</h2>
                    <p className="section-description">
                        Irreversible actions
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        className="delete-button"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
