import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import './Card.css'; // Reuse card styles

const FeedbackCard = ({ onSubmit }) => {
    const [showInput, setShowInput] = useState(false);
    const [confusion, setConfusion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confusion.trim()) {
            onSubmit('confused', confusion);
            setConfusion("");
            setShowInput(false);
        }
    };

    return (
        <motion.div
            className="card-container feedback-mode"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="card-title">Lesson Complete!</h2>

            {!showInput ? (
                <>
                    <p className="card-content">Did you understand everything clearly?</p>
                    <div className="card-feedback-actions">
                        <button onClick={() => onSubmit('understood')} className="action-btn yes">
                            Yes, I got it!
                        </button>
                        <button onClick={() => setShowInput(true)} className="action-btn no">
                            No, I'm confused
                        </button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="confusion-form">
                    <p className="card-content">What part is still confusing?</p>
                    <div className="input-wrapper">
                        <textarea
                            value={confusion}
                            onChange={(e) => setConfusion(e.target.value)}
                            placeholder="e.g., I don't understand how the connection works..."
                            className="confusion-input"
                            autoFocus
                        />
                        <button type="submit" className="send-btn">
                            <ArrowUp size={20} />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowInput(false)}
                        className="back-text-btn"
                    >
                        Back
                    </button>
                </form>
            )}
        </motion.div>
    );
};

export default FeedbackCard;
