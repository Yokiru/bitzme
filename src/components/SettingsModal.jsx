import React, { useState } from 'react';
import { X, User, Lock, Trash2, AlertTriangle, Check, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
    const { user, profile, updateProfile, updatePassword, deleteAccount } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form states
    const [displayName, setDisplayName] = useState(profile?.display_name || '');
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState('');

    if (!isOpen) return null;

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const { success, error } = await updateProfile({ display_name: displayName });

        if (success) {
            setMessage({ type: 'success', text: t('settings.saved') });
        } else {
            setMessage({ type: 'error', text: error?.message || t('settings.error') });
        }
        setLoading(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const { success, error } = await updatePassword(passwordData.newPassword);

        if (success) {
            setMessage({ type: 'success', text: t('settings.saved') });
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } else {
            setMessage({ type: 'error', text: error?.message || t('settings.error') });
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== 'DELETE') {
            setMessage({ type: 'error', text: 'Please type DELETE to confirm' });
            return;
        }

        setLoading(true);
        const { success, error } = await deleteAccount();

        if (!success) {
            setMessage({ type: 'error', text: error?.message || t('settings.error') });
            setLoading(false);
        }
        // If success, user will be logged out and redirected by AuthContext/App
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <div className="settings-header">
                    <h2>{t('settings.title')}</h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="settings-content">
                    <div className="settings-sidebar">
                        <button
                            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('profile'); setMessage({ type: '', text: '' }); }}
                        >
                            <User size={18} />
                            <span>{t('settings.profile')}</span>
                        </button>
                        <button
                            className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('security'); setMessage({ type: '', text: '' }); }}
                        >
                            <Lock size={18} />
                            <span>{t('settings.security')}</span>
                        </button>
                        <button
                            className={`sidebar-item danger ${activeTab === 'danger' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('danger'); setMessage({ type: '', text: '' }); }}
                        >
                            <Trash2 size={18} />
                            <span>{t('settings.danger')}</span>
                        </button>
                    </div>

                    <div className="settings-main">
                        {message.text && (
                            <div className={`settings-message ${message.type}`}>
                                {message.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
                                <span>{message.text}</span>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <form onSubmit={handleUpdateProfile} className="settings-form">
                                <h3>{t('settings.profile')}</h3>
                                <div className="form-group">
                                    <label>Display Name</label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="settings-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={user?.email}
                                        disabled
                                        className="settings-input disabled"
                                    />
                                    <span className="input-hint">Email cannot be changed</span>
                                </div>
                                <button type="submit" className="save-btn" disabled={loading}>
                                    {loading ? <Loader className="spin" size={18} /> : t('settings.save')}
                                </button>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handleUpdatePassword} className="settings-form">
                                <h3>{t('settings.security')}</h3>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Enter new password"
                                        className="settings-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        className="settings-input"
                                    />
                                </div>
                                <button type="submit" className="save-btn" disabled={loading}>
                                    {loading ? <Loader className="spin" size={18} /> : t('settings.save')}
                                </button>
                            </form>
                        )}

                        {activeTab === 'danger' && (
                            <div className="danger-zone">
                                <h3>{t('settings.danger')}</h3>
                                <div className="danger-warning">
                                    <AlertTriangle size={24} />
                                    <div>
                                        <h4>Warning: This action is irreversible</h4>
                                        <p>All your data, including chat history and preferences, will be permanently deleted.</p>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Type "DELETE" to confirm</label>
                                    <input
                                        type="text"
                                        value={deleteConfirm}
                                        onChange={(e) => setDeleteConfirm(e.target.value)}
                                        placeholder="DELETE"
                                        className="settings-input danger-input"
                                    />
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="delete-btn"
                                    disabled={loading || deleteConfirm !== 'DELETE'}
                                >
                                    {loading ? <Loader className="spin" size={18} /> : 'Delete My Account'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
