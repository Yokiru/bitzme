import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ title, content }) => {
    return (
        <motion.div
            className="card-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }}
        >
            <h2 className="card-title">{title}</h2>
            <p className="card-content">{content}</p>
        </motion.div>
    );
};

export default Card;
