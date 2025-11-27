import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Brain } from 'lucide-react';
import './Home.css';
import { useLanguage } from '../contexts/LanguageContext';





const Home = ({ isSidebarOpen }) => {
    const { t, language } = useLanguage();
    const [greeting, setGreeting] = useState("");
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [quizMode, setQuizMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const greetings = t('home.greetings');
        // Ensure greetings is an array before accessing
        const greetingList = Array.isArray(greetings) ? greetings : [greetings];
        const randomGreeting = greetingList[Math.floor(Math.random() * greetingList.length)];
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
            const defaultSuggestions = t('home.suggestions');
            const suggestionsList = Array.isArray(defaultSuggestions) ? defaultSuggestions : [];
            setSuggestions(suggestionsList.slice(0, 5));
        }
    }, [language, t]); // Re-run when language changes

    const getSmartSuggestions = (history) => {
        let newSuggestions = new Set();

        // 1. Try to find related topics based on history
        const topicMap = t('home.topic_map');
        // Ensure topicMap is an object
        if (topicMap && typeof topicMap === 'object') {
            history.forEach(item => {
                const lowerItem = item.toLowerCase();
                Object.keys(topicMap).forEach(key => {
                    if (lowerItem.includes(key)) {
                        const topics = topicMap[key];
                        if (Array.isArray(topics)) {
                            topics.forEach(topic => newSuggestions.add(topic));
                        }
                    }
                });
            });
        }

        // 2. Convert to array
        let suggestionArray = Array.from(newSuggestions);

        // 3. Fill with defaults if we don't have enough (target 5)
        if (suggestionArray.length < 5) {
            const defaultSuggestions = t('home.suggestions');
            const suggestionsList = Array.isArray(defaultSuggestions) ? defaultSuggestions : [];
            const shuffledDefaults = [...suggestionsList].sort(() => 0.5 - Math.random());
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
                        placeholder={t('home.placeholder')}
                        className="search-input"
                        rows="1"
                    />
                    <div className="input-actions">
                        <button
                            type="button"
                            onClick={() => setQuizMode(!quizMode)}
                            className={`quiz-icon-btn ${quizMode ? 'active' : ''}`}
                            aria-label={t('home.quiz_mode')}
                            title={t('home.quiz_mode')}
                        >
                            <Brain size={20} />
                            {quizMode && <span className="quiz-mode-text">{t('home.quiz_mode')}</span>}
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
