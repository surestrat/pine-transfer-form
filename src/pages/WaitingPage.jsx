import '@styles/WaitingPage.css';

import {
  useEffect,
  useState,
} from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@components/ui/Button';
import Logo from '@components/ui/Logo';
import { transformQuotePayload } from '@services/payloadTransformer';
import {
  pollQuoteResult,
  submitQuote,
} from '@services/quoteApiService';
import { useFormStore } from '@store/formStore';

const WaitingPage = () => {
    const [status, setStatus] = useState('processing'); // processing, complete, error
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const navigate = useNavigate();
    const { updateField } = useFormStore();

    useEffect(() => {
        // Check what data we have in session storage
        const quoteId = sessionStorage.getItem('quoteId');
        const quoteStatus = sessionStorage.getItem('quoteStatus');
        const quoteResult = sessionStorage.getItem('quoteResult');
        const quoteError = sessionStorage.getItem('quoteError');

        // If we have a direct result (no polling needed)
        if (quoteStatus === 'complete' && quoteResult) {
            try {
                const result = JSON.parse(quoteResult);
                setQuote(result);
                setStatus('complete');
                return;
            } catch (err) {
                console.error('[WaitingPage] Error parsing quote result:', err);
            }
        }

        // If we have an error from the quote submission
        if (quoteStatus === 'error' && quoteError) {
            try {
                const errorData = JSON.parse(quoteError);
                console.log('[WaitingPage] Error data received:', errorData);
                
                let displayMessage = errorData.message || 'An error occurred while processing your quote';
                
                // If we have validation details, show more specific message
                if (errorData.details && Array.isArray(errorData.details)) {
                    const validationMessages = errorData.details.map(detail => {
                        if (typeof detail === 'object' && detail.msg) {
                            return detail.msg;
                        }
                        return String(detail);
                    }).join(', ');
                    
                    if (validationMessages) {
                        displayMessage = `Validation Error: ${validationMessages}`;
                    }
                }
                
                setError(displayMessage);
                setStatus('error');
                return;
            } catch (err) {
                console.error('[WaitingPage] Error parsing quote error:', err);
                setError('An error occurred while processing your quote');
                setStatus('error');
                return;
            }
        }

        // Traditional polling flow - need quote ID
        if (!quoteId) {
            navigate('/quote');
            return;
        }

        let pollTimer;
        let timeTimer;

        // Start polling for quote result
        const startPolling = async () => {
            try {
                const result = await pollQuoteResult(quoteId);
                if (result.status === 'complete') {
                    setQuote(result.quote);
                    setStatus('complete');
                    sessionStorage.setItem('quoteResult', JSON.stringify(result.quote));
                } else if (result.status === 'error') {
                    setError(result.error || 'An error occurred while processing your quote');
                    setStatus('error');
                }
            } catch (err) {
                console.error('Polling error:', err);
                setError('Failed to retrieve quote status. This could be due to network issues or server timeout.');
                setStatus('error');
            }
        };

        // Start elapsed time counter
        const startTimer = () => {
            timeTimer = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        };

        startPolling();
        startTimer();

        return () => {
            if (pollTimer) clearInterval(pollTimer);
            if (timeTimer) clearInterval(timeTimer);
        };
    }, [navigate]);

    // Fallback: if status is still processing but we don't have valid session data, show error
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (status === 'processing') {
                const quoteId = sessionStorage.getItem('quoteId');
                const quoteStatus = sessionStorage.getItem('quoteStatus');
                
                if (!quoteId && quoteStatus !== 'complete' && quoteStatus !== 'error') {
                    console.warn('[WaitingPage] No valid session data found, redirecting to error state');
                    setError('Session data missing. Please try submitting your quote again.');
                    setStatus('error');
                }
            }
        }, 2000); // Give 2 seconds for initial load

        return () => clearTimeout(timeoutId);
    }, [status]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRetryQuote = async () => {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
        
        try {
            // Get the original form data
            const originalQuoteData = sessionStorage.getItem('quoteData');
            if (!originalQuoteData) {
                throw new Error('Original quote data not found');
            }

            const quoteData = JSON.parse(originalQuoteData);
            console.log('[WaitingPage] Retrying quote with data:', quoteData);

            // Transform and resubmit the quote
            const apiPayload = transformQuotePayload(quoteData);
            const quoteResponse = await submitQuote(apiPayload);

            // Clear previous error states
            sessionStorage.removeItem('quoteError');
            sessionStorage.removeItem('quoteStatus');

            // Handle the response based on type
            if (quoteResponse && (quoteResponse.premium !== undefined || quoteResponse.quoteId)) {
                // Check if we have both immediate results and a quote ID
                if (quoteResponse.premium !== undefined && quoteResponse.quoteId) {
                    // Best case: we have immediate results AND a quote ID for future reference
                    const quoteResult = {
                        premium: quoteResponse.premium,
                        excess: quoteResponse.excess,
                        quoteId: quoteResponse.quoteId,
                        referenceId: apiPayload.externalReferenceId,
                        timestamp: new Date().toISOString(),
                        status: 'complete'
                    };
                    
                    sessionStorage.setItem('quoteResult', JSON.stringify(quoteResult));
                    sessionStorage.setItem('quoteId', quoteResponse.quoteId);
                    sessionStorage.setItem('quoteStatus', 'complete');
                    
                    setQuote(quoteResult);
                    setStatus('complete');
                    setError(null);
                    setIsRetrying(false);
                } else if (quoteResponse.quoteId) {
                    // Traditional polling flow
                    sessionStorage.setItem('quoteId', quoteResponse.quoteId);
                    setStatus('processing');
                    setElapsedTime(0);
                    setError(null);
                    setIsRetrying(false);
                    // Restart the polling process
                    window.location.reload();
                } else if (quoteResponse.premium !== undefined) {
                    // Direct quote result without quote ID
                    const quoteResult = {
                        premium: quoteResponse.premium,
                        excess: quoteResponse.excess,
                        referenceId: apiPayload.externalReferenceId,
                        timestamp: new Date().toISOString(),
                        status: 'complete'
                    };
                    
                    sessionStorage.setItem('quoteResult', JSON.stringify(quoteResult));
                    sessionStorage.setItem('quoteStatus', 'complete');
                    
                    setQuote(quoteResult);
                    setStatus('complete');
                    setError(null);
                    setIsRetrying(false);
                }
            } else {
                throw new Error('Invalid response from server - no quote data received');
            }
        } catch (err) {
            console.error('[WaitingPage] Retry failed:', err);
            setError(`Retry failed: ${err.message || 'Please try again or contact support.'}`);
            setIsRetrying(false);
        }
    };

    const handleNewQuote = () => {
        // Clear all quote-related data
        sessionStorage.removeItem('quoteId');
        sessionStorage.removeItem('quoteResult');
        sessionStorage.removeItem('quoteData');
        sessionStorage.removeItem('quoteStatus');
        sessionStorage.removeItem('quoteError');
        navigate('/quote');
    };

    const handleTransferToLeadForm = () => {
        try {
            // Get the original quote data to prefill the lead form
            const originalQuoteData = sessionStorage.getItem('quoteData');
            const quoteResult = sessionStorage.getItem('quoteResult');
            
            let quoteId = null;
            
            // Try to get quote ID from multiple sources
            if (quoteResult) {
                try {
                    const result = JSON.parse(quoteResult);
                    quoteId = result.quoteId || null;
                } catch (err) {
                    console.error('[WaitingPage] Error parsing quote result:', err);
                }
            }
            
            // If no quote ID from result, try from session storage
            if (!quoteId) {
                quoteId = sessionStorage.getItem('quoteId');
            }
            
            if (originalQuoteData) {
                const quoteData = JSON.parse(originalQuoteData);
                
                // Extract relevant data for lead form prefilling using correct field names
                const leadFormData = {
                    first_name: quoteData.firstName || '',
                    last_name: quoteData.lastName || '',
                    email: quoteData.email || '',
                    contact_number: quoteData.mobileNumber || '',
                    id_number: quoteData.idNumber || '',
                    quote_id: quoteId || '', // Add the quote ID
                };

                // Update the form store with prefilled data using updateField
                Object.entries(leadFormData).forEach(([field, value]) => {
                    if (value) { // Only update fields that have values
                        updateField(field, value);
                    }
                });
                console.log('[WaitingPage] Prefilled lead form with:', leadFormData);
            } else if (quoteId) {
                // If we only have quote ID but no original data, just prefill the quote ID
                updateField('quote_id', quoteId);
                console.log('[WaitingPage] Prefilled lead form with quote ID:', quoteId);
            }

            // Navigate to the lead form page
            navigate('/');
        } catch (err) {
            console.error('[WaitingPage] Error transferring to lead form:', err);
            // Still navigate even if prefilling fails
            navigate('/');
        }
    };

    return (
        <div className="waiting-page">
            <motion.div
                className="header-container"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, ease: "easeOut" }}
            >
                <Logo size={32} />
            </motion.div>

            <motion.div
                className="waiting-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, ease: "easeOut" }}
            >
                {status === 'processing' && (
                    <div className="processing-content">
                        <div className="spinner-container">
                            <RefreshCw className="spinner" size={48} />
                        </div>
                        <h1 className="waiting-title">Processing Your Quote</h1>
                        <p className="waiting-description">
                            We're analyzing your information and calculating the best rates for you.
                            This usually takes 30-60 seconds.
                        </p>
                        <div className="time-display">
                            <Clock size={16} />
                            <span>Elapsed time: {formatTime(elapsedTime)}</span>
                        </div>
                        <div className="progress-steps">
                            <div className="step completed">
                                <div className="step-icon">✓</div>
                                <span>Information received</span>
                            </div>
                            <div className="step active">
                                <div className="step-icon">
                                    <RefreshCw size={12} className="step-spinner" />
                                </div>
                                <span>Calculating rates</span>
                            </div>
                            <div className="step">
                                <div className="step-icon">3</div>
                                <span>Preparing quote</span>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'complete' && (
                    <div className="success-content">
                        <CheckCircle className="success-icon" size={64} />
                        <h1 className="success-title">Quote Ready!</h1>
                        <p className="success-description">
                            Your personalized vehicle insurance quote has been prepared.
                        </p>
                        {quote && (
                            <div className="quote-preview">
                                <div className="quote-amount">
                                    R{quote.premium ? quote.premium.toFixed(2) : (quote.monthlyPremium || 'N/A')}/month
                                </div>
                                <div className="quote-details">
                                    {quote.excess && (
                                        <span>Excess: R{quote.excess.toFixed(2)}</span>
                                    )}
                                    {quote.coverageType && (
                                        <span>Coverage: {quote.coverageType}</span>
                                    )}
                                    {quote.deductible && (
                                        <span>Deductible: R{quote.deductible}</span>
                                    )}
                                    {quote.quoteId && (
                                        <span>Quote ID: {quote.quoteId}</span>
                                    )}
                                    {quote.referenceId && (
                                        <span>Reference: {quote.referenceId}</span>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="action-buttons">
                            <Button 
                                onClick={handleTransferToLeadForm}
                                variant="primary"
                                size="large"
                            >
                                <FileText size={18} />
                                Continue with Lead Form
                            </Button>
                            <Button 
                                onClick={handleNewQuote}
                                variant="secondary"
                                size="large"
                            >
                                Get Another Quote
                            </Button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="error-content">
                        <AlertCircle className="error-icon" size={64} />
                        <h1 className="error-title">Quote Processing Failed</h1>
                        <div className="error-details">
                            <p className="error-description">
                                {error || 'We encountered an issue while processing your quote.'}
                            </p>
                            {retryCount > 0 && (
                                <p className="retry-info">
                                    Attempt {retryCount + 1} - If this continues, please try a different approach below.
                                </p>
                            )}
                        </div>
                        
                        <div className="error-actions">
                            <div className="primary-actions">
                                <Button 
                                    onClick={handleRetryQuote}
                                    variant="primary"
                                    size="large"
                                    disabled={isRetrying}
                                    className="retry-button"
                                >
                                    <RotateCcw size={18} />
                                    {isRetrying ? 'Retrying...' : 'Retry Quote'}
                                </Button>
                            </div>
                            
                            <div className="alternative-actions">
                                <p className="alternative-text">
                                    Or choose an alternative option:
                                </p>
                                <div className="action-buttons alternative">
                                    <Button 
                                        onClick={handleNewQuote}
                                        variant="secondary"
                                        size="medium"
                                        className="action-button"
                                    >
                                        <Plus size={16} />
                                        Start New Quote
                                    </Button>
                                    <Button 
                                        onClick={handleTransferToLeadForm}
                                        variant="outline"
                                        size="medium"
                                        className="action-button"
                                    >
                                        <FileText size={16} />
                                        Transfer to Lead Form
                                    </Button>
                                    <Button 
                                        onClick={() => navigate('/')}
                                        variant="outline"
                                        size="medium"
                                        className="action-button"
                                    >
                                        <ArrowLeft size={16} />
                                        Go Home
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default WaitingPage;
