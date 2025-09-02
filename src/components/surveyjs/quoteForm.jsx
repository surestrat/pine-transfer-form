import 'survey-core/survey-core.min.css';
import './index.css';

import { useNavigate } from 'react-router-dom';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

import { transformQuotePayload } from '@services/payloadTransformer';
import { submitQuote } from '@services/quoteApiService';

import { json } from './json';
import { themeJson } from './theme';

function QuoteForm() {
    const navigate = useNavigate();
    const form = new Model(json);
    form.applyTheme(themeJson);
    
    form.onComplete.add(async (sender) => {
        let apiPayload = null;
        
        try {
            console.log('[QuoteForm] Survey completed with data:', JSON.stringify(sender.data, null, 3));
            
            // Transform the survey data to API payload format
            apiPayload = transformQuotePayload(sender.data);
            console.log('[QuoteForm] Transformed payload:', JSON.stringify(apiPayload, null, 3));
            
            // Submit the quote to the API
            const quoteResponse = await submitQuote(apiPayload);
            console.log('[QuoteForm] Quote submission response:', quoteResponse);
            
            // Check if we have a successful quote response
            if (quoteResponse && (quoteResponse.premium !== undefined || quoteResponse.quoteId)) {
                // Store the original form data for potential retry/prefill
                sessionStorage.setItem('quoteData', JSON.stringify(sender.data));
                
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
                    
                    // Navigate to waiting page which will show the complete result
                    navigate('/waiting');
                } else if (quoteResponse.quoteId) {
                    // Traditional flow with quote ID for polling
                    sessionStorage.setItem('quoteId', quoteResponse.quoteId);
                    navigate('/waiting');
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
                    
                    // Navigate to waiting page which will show the result
                    navigate('/waiting');
                }
            } else {
                throw new Error('Invalid response from server - no quote data received');
            }
        } catch (error) {
            console.error('[QuoteForm] Error submitting quote:', error);
            
            // Extract detailed error information
            let errorMessage = 'An error occurred while processing your quote';
            let errorDetails = null;
            
            if (error.name === 'QuoteApiError' && error.details) {
                errorMessage = 'Validation failed: Please check your information and try again';
                errorDetails = error.details;
            } else if (error.response?.data?.detail) {
                errorMessage = 'Server validation error: Please verify your information';
                errorDetails = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Store error data for the waiting page to handle
            sessionStorage.setItem('quoteData', JSON.stringify(sender.data));
            sessionStorage.setItem('quoteError', JSON.stringify({
                message: errorMessage,
                details: errorDetails,
                timestamp: new Date().toISOString(),
                apiPayload: apiPayload,
                originalError: error.message
            }));
            sessionStorage.setItem('quoteStatus', 'error');
            
            // Navigate to waiting page which will show error state
            navigate('/waiting');
        }
    });
    
    return (<Survey model={form} />);
}

export default QuoteForm;