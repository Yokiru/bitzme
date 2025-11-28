import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { authService } from '../services/auth';
import './Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }

        setLoading(true);

        try {
            const { error: resetError } = await authService.resetPassword(email);

            if (resetError) {
                setError(resetError.message || 'Failed to send reset email. Please try again.');
            } else {
                setSuccess(true);
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
                    {success ? "Check your email" : "Reset your password"}
                </h1>
                <p className="auth-subtitle-large">
                    {success
                        ? `We've sent a password reset link to ${email}`
                        : "Enter your email and we'll send you a reset link"
                    }
                </p>
            </div>

            <div className="auth-card">
                {success ? (
                    <div className="verification-success">
                        <div className="verification-icon">📧</div>
                        <p className="verification-instructions">
                            Please check your email and click the link to reset your password.
                        </p>
                        <div className="verification-note">
                            <p>Didn't receive the email?</p>
                            <ul>
                                <li>Check your spam or junk folder</li>
                                <li>Make sure you entered the correct email address</li>
                                <li>Wait a few minutes and check again</li>
                            </ul>
                        </div>
                        <Link
                            to="/login"
                            className="auth-button primary"
                            style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginTop: '1rem' }}
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={loading}
                            autoComplete="email"
                            autoFocus
                            className="auth-input"
                        />

                        <button
                            type="submit"
                            className="auth-button primary"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send reset link'}
                        </button>

                        <div className="auth-footer" style={{ marginTop: '1rem', paddingTop: '1rem' }}>
                            <p>
                                Remember your password?{' '}
                                <Link to="/login" className="auth-link">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
