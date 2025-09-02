import '@styles/FormPage.css';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

import QuoteForm from '@components/surveyjs/quoteForm';
import Logo from '@components/ui/Logo';

const QuotePage = () => {
    return (
        <div className="form-page">
            <motion.div
                className="header-container"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, ease: "easeOut" }}
            >
                <Logo size={32} />
                <div className="secure-badge">
                    <Lock size={14} className="secure-icon" />
                    <span className="secure-text">Secure Connection</span>
                </div>
            </motion.div>

            <motion.div
                className="title-container"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, ease: "easeOut" }}
            >
                <h1 className="page-title">
                    <span className="title-accent">Vehicle Insurance</span> Quote Request
                </h1>
                <p className="page-description">
                    Complete the form below to get your personalized vehicle insurance quote.
                    All fields marked with * are required.
                </p>
            </motion.div>

            <motion.div
                className="form-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, ease: "easeOut" }}
                style={{ maxWidth: '1200px', margin: '0 auto' }}
            >
                <QuoteForm />
            </motion.div>
        </div>
    );
};

export default QuotePage;
