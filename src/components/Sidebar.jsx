import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Clock, Trash2 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggle }) => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadHistory = () => {
            try {
                const saved = JSON.parse(localStorage.getItem('learn_history') || '[]');
                // Filter out invalid entries (legacy strings or malformed objects)
                const validHistory = saved.filter(item => typeof item === 'object' && item !== null && item.query);
                setHistory(validHistory);
            } catch (e) {
                console.error("Failed to load history", e);
                setHistory([]);
            }
        };

        loadHistory();
        window.addEventListener('historyUpdated', loadHistory);
        return () => window.removeEventListener('historyUpdated', loadHistory);
    }, []);

    const handleDelete = (e, itemToDelete) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        const updatedHistory = history.filter(item => item.query !== itemToDelete.query);
        localStorage.setItem('learn_history', JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
        window.dispatchEvent(new Event('historyUpdated'));
    };

    const handleHistoryClick = (query) => {
        navigate('/result', { state: { query } });
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={toggle}
                        className="sidebar-overlay"
                    />
                )}
            </AnimatePresence>

            <button
                onClick={toggle}
                className={`sidebar-toggle-btn ${isOpen ? 'open' : ''}`}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <motion.div
                initial={{ x: -300 }}
                animate={{ x: isOpen ? 0 : -300 }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="sidebar-container"
            >
                <div className="sidebar-header">
                    <h2>Bitzme</h2>
                </div>

                <div className="sidebar-content">
                    <div className="sidebar-section-title">Recent</div>
                    {history.length === 0 ? (
                        <p className="empty-history">No recent chats</p>
                    ) : (
                        <ul className="history-list">
                            {history.map((item, index) => (
                                <li key={index}>
                                    <div
                                        onClick={() => handleHistoryClick(item.query)}
                                        className="history-item"
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="history-content-wrapper">
                                            <div className="history-icon">
                                                <Clock size={16} />
                                            </div>
                                            <span className="history-text">{item.query}</span>
                                        </div>
                                        <button
                                            className="delete-history-btn"
                                            onClick={(e) => handleDelete(e, item)}
                                            aria-label="Delete history item"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;
