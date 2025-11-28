import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Home } from 'lucide-react';
import { authService } from '../services/auth';
import './Login.css';
import './Register.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const getPasswordStrength = (password) => {
        if (!password) return null;

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return { level: 'weak', label: 'Weak', color: '#ef4444' };
        if (strength <= 3) return { level: 'medium', label: 'Medium', color: '#f59e0b' };
        return { level: 'strong', label: 'Strong', color: '#10b981' };
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.password || !formData.confirmPassword) {
            setError('Please fill in both password fields');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await authService.updatePassword(formData.password);

            if (updateError) {
                setError(updateError.message || 'Failed to update password. Please try again.');
            } else {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="back-to-home-fixed">
                <Home size={20} />
            </Link>
            <div className="auth-header-outside">
                <h1 className="auth-logo-large">
                    {success ? "Password updated!" : "Create new password"}
                </h1>
                <p className="auth-subtitle-large">
                    {success
                        ? "Your password has been successfully updated"
                        : "Enter your new password below"
                    }
                </p>
            </div>

            <div className="auth-card">
                {success ? (
                    <div className="verification-success">
                        <div className="verification-icon">✅</div>
                        <p className="verification-instructions">
                            Redirecting you to login page...
                        </p>
                        <Link
                            to="/login"
                            className="auth-button primary"
                            style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginTop: '1rem' }}
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="New password (min. 8 characters)"
                                disabled={loading}
                                autoComplete="new-password"
                                autoFocus
                                className="auth-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                disabled={loading}
                                autoComplete="new-password"
                                className="auth-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="password-toggle"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {formData.password && (
                            <div className="password-strength">
                                <div className="strength-label">
                                    Password strength: <span style={{ color: getPasswordStrength(formData.password).color }}>
                                        {getPasswordStrength(formData.password).label}
                                    </span>
                                </div>
                                <div className="strength-bar">
                                    <div
                                        className={`strength-fill ${getPasswordStrength(formData.password).level}`}
                                        style={{ backgroundColor: getPasswordStrength(formData.password).color }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-button primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
