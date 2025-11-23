import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Brain } from 'lucide-react';
import './Home.css';

const GREETINGS = [
    "Hi, ready to learn something new?",
    "Hello, what's on your mind today?",
    "Greetings, let's make it simple.",
    "Hey there, curious mind!",
    "Welcome, what shall we explore?"
];

const DEFAULT_SUGGESTIONS = [
    "Explain Quantum Physics",
    "How does photosynthesis work?",
    "What is the theory of relativity?",
    "Explain blockchain like I'm 5",
    "History of the Roman Empire",
    "How do airplanes fly?",
    "What is Artificial Intelligence?",
    "The water cycle explained"
];

// Static map for smart suggestions
const TOPIC_MAP = {
    "physics": ["Newton's Laws", "Gravity", "Thermodynamics", "Speed of Light"],
    "quantum": ["Schrödinger's Cat", "Entanglement", "Wave-Particle Duality"],
    "biology": ["Cell Structure", "DNA vs RNA", "Evolution", "Ecosystems"],
    "plant": ["Photosynthesis", "Plant Cells", "Pollination"],
    "history": ["World War II", "Ancient Egypt", "The Industrial Revolution", "The Cold War"],
    "tech": ["How the Internet works", "Coding for beginners", "Cybersecurity"],
    "ai": ["Machine Learning", "Neural Networks", "Robotics"],
    "space": ["Black Holes", "The Solar System", "Mars Colonization", "Big Bang Theory"],
    "money": ["Inflation", "Stock Market", "Cryptocurrency", "Supply and Demand"],
    "art": ["Renaissance", "Impressionism", "Color Theory", "Famous Painters"]
};

const Home = ({ isSidebarOpen }) => {
    const [greeting, setGreeting] = useState("");
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [quizMode, setQuizMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
        setGreeting(randomGreeting);

        // Generate smart suggestions
        try {
            const history = JSON.parse(localStorage.getItem('learn_history') || '[]');
            // Extract queries from object-based history
            const historyQueries = history.map(item => typeof item === 'object' ? item.query : item);
            const smartSuggestions = getSmartSuggestions(historyQueries);
            setSuggestions(smartSuggestions);
        } catch (e) {
            console.error("Failed to load history for suggestions", e);
            setSuggestions(DEFAULT_SUGGESTIONS.slice(0, 5));
        }
    }, []);

    const getSmartSuggestions = (history) => {
        let newSuggestions = new Set();

        // 1. Try to find related topics based on history
        history.forEach(item => {
            const lowerItem = item.toLowerCase();
            Object.keys(TOPIC_MAP).forEach(key => {
                if (lowerItem.includes(key)) {
                    TOPIC_MAP[key].forEach(topic => newSuggestions.add(topic));
                }
            });
        });

        // 2. Convert to array
        let suggestionArray = Array.from(newSuggestions);

        // 3. Fill with defaults if we don't have enough (target 5)
        if (suggestionArray.length < 5) {
            const shuffledDefaults = [...DEFAULT_SUGGESTIONS].sort(() => 0.5 - Math.random());
            for (let item of shuffledDefaults) {
                if (!suggestionArray.includes(item)) {
                    suggestionArray.push(item);
                }
                if (suggestionArray.length >= 5) break;
            }
        }

        // 4. Shuffle final result and take top 5
        return suggestionArray.sort(() => 0.5 - Math.random()).slice(0, 5);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            // Don't save to history here, let Result page handle it after generation
            navigate('/result', { state: { query, quizMode } });
        }
    };

    const handleSuggestionClick = (suggestion) => {
        // Don't save to history here, let Result page handle it after generation
        navigate('/result', { state: { query: suggestion, quizMode } });
    };



    return (
        <div className="home-container">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hero-title"
            >
                {greeting}
            </motion.h1>


            <motion.form
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onSubmit={handleSearch}
                className="search-form"
            >
                <div className="input-container">
                    <textarea
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            // Auto-resize textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSearch(e);
                            }
                        }}
                        placeholder="Ask anything..."
                        className="search-input"
                        rows="1"
                    />
                    <div className="input-actions">
                        <button
                            type="button"
                            onClick={() => setQuizMode(!quizMode)}
                            className={`quiz-icon-btn ${quizMode ? 'active' : ''}`}
                            aria-label="Toggle Quiz Mode"
                            title="Quiz Mode"
                        >
                            <Brain size={20} />
                            {quizMode && <span className="quiz-mode-text">Quiz Mode</span>}
                        </button>
                        <button
                            type="submit"
                            className="search-button"
                        >
                            <ArrowUp size={20} />
                        </button>
                    </div>
                </div>
            </motion.form>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="suggestions-container"
            >
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="suggestion-chip"
                    >
                        {suggestion}
                    </button>
                ))}
            </motion.div>
        </div>
    );
};

export default Home;
