import '@styles/SuccessPage.css';

import {
  useEffect,
  useState,
} from 'react';

import { motion } from 'framer-motion';
import {
  Check,
  CheckCircle,
  Copy,
  DollarSign,
  FileText,
  Mail,
  Plus,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@components/ui/Button';
import Logo from '@components/ui/Logo';
import { getQuoteById } from '@services/quoteApiService';
import { useFormStore } from '@store/formStore';

const SuccessPage = () => {
	const navigate = useNavigate();
	const resetForm = useFormStore((state) => state.resetForm);
	const [quoteInfo, setQuoteInfo] = useState(null);
	const [copiedField, setCopiedField] = useState(null);

	// Copy to clipboard handler
	const copyToClipboard = async (text, fieldName) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedField(fieldName);
			// Reset the copied state after 2 seconds
			setTimeout(() => setCopiedField(null), 2000);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			setCopiedField(fieldName);
			setTimeout(() => setCopiedField(null), 2000);
		}
	};

	// Get quote information if available
	useEffect(() => {
		const fetchQuoteInfo = async () => {
			try {
				// First check sessionStorage for quote information
				const quoteResult = sessionStorage.getItem('quoteResult');
				if (quoteResult) {
					const parsedQuote = JSON.parse(quoteResult);
					setQuoteInfo(parsedQuote);
					console.log("[SuccessPage] Found quote information in sessionStorage:", parsedQuote);
					return;
				}
				
				// If no sessionStorage data, try to fetch from API using quote_id from form
				const customer_info = useFormStore.getState().customer_info;
				if (customer_info.quote_id) {
					console.log("[SuccessPage] Fetching quote info for quote_id:", customer_info.quote_id);
					const apiQuoteInfo = await getQuoteById(customer_info.quote_id);
					setQuoteInfo(apiQuoteInfo);
					console.log("[SuccessPage] Fetched quote information from API:", apiQuoteInfo);
				}
			} catch (error) {
				console.error("[SuccessPage] Error fetching quote information:", error);
				// Don't show error to user, just continue without quote info
			}
		};
		
		fetchQuoteInfo();
	}, []);

	// Reset form on component mount
	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const handleNewQuote = () => {
		// Clear any existing quote data
		sessionStorage.removeItem('quoteResult');
		sessionStorage.removeItem('quoteId');
		sessionStorage.removeItem('quoteData');
		sessionStorage.removeItem('quoteStatus');
		navigate('/quote');
	};

	const handleNewTransfer = () => {
		// Clear form data and navigate to transfer form
		resetForm();
		navigate('/');
	};

	return (
		<div className="success-page">
			<motion.div
				className="header-container"
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1, ease: "easeOut" }}
			>
				<Logo size={32} />
			</motion.div>

			<motion.div
				className="success-card"
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
			>
				<motion.div
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						delay: 0.4,
						type: "spring",
						stiffness: 300,
						damping: 15,
					}}
					className="success-icon-wrapper"
				>
					<CheckCircle className="success-icon" />
				</motion.div>

				<h1 className="success-title">
					<span className="success-title-accent">Transfer</span> Successful!
				</h1>
				
				{quoteInfo ? (
					<div className="success-content">
						<p className="success-message">
							Your quote and customer information have been successfully transferred to Pineapple Insurance.
						</p>
						
						<motion.div
							className="quote-summary"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
						>
							<div className="quote-header">
								<DollarSign className="quote-icon" size={20} />
								<h3>Your Insurance Quote</h3>
							</div>
							
							<div className="quote-copy-notice">
								<Mail size={16} className="notice-icon" />
								<span>A copy of this quote will be emailed to you</span>
							</div>
							
							<div className="quote-details">
								<button 
									className="quote-item clickable" 
									onClick={() => copyToClipboard(`R${quoteInfo.premium ? quoteInfo.premium.toFixed(2) : 'N/A'}`, 'premium')}
									title="Click to copy premium amount"
									type="button"
								>
									<span className="quote-label">Monthly Premium:</span>
									<span className="quote-value-container">
										<span className="quote-value">R{quoteInfo.premium ? quoteInfo.premium.toFixed(2) : 'N/A'}</span>
										{copiedField === 'premium' ? (
											<Check size={16} className="copy-icon copied" />
										) : (
											<Copy size={16} className="copy-icon" />
										)}
									</span>
								</button>
								
								{quoteInfo.excess && (
									<button 
										className="quote-item clickable"
										onClick={() => copyToClipboard(`R${quoteInfo.excess.toFixed(2)}`, 'excess')}
										title="Click to copy excess amount"
										type="button"
									>
										<span className="quote-label">Excess:</span>
										<span className="quote-value-container">
											<span className="quote-value">R{quoteInfo.excess.toFixed(2)}</span>
											{copiedField === 'excess' ? (
												<Check size={16} className="copy-icon copied" />
											) : (
												<Copy size={16} className="copy-icon" />
											)}
										</span>
									</button>
								)}
								
								{quoteInfo.quoteId && (
									<button 
										className="quote-item clickable"
										onClick={() => copyToClipboard(quoteInfo.quoteId, 'quoteId')}
										title="Click to copy Quote ID"
										type="button"
									>
										<span className="quote-label">Quote ID:</span>
										<span className="quote-value-container">
											<span className="quote-value">{quoteInfo.quoteId}</span>
											{copiedField === 'quoteId' ? (
												<Check size={16} className="copy-icon copied" />
											) : (
												<Copy size={16} className="copy-icon" />
											)}
										</span>
									</button>
								)}
								
								{quoteInfo.referenceId && (
									<button 
										className="quote-item clickable"
										onClick={() => copyToClipboard(quoteInfo.referenceId, 'referenceId')}
										title="Click to copy Reference ID"
										type="button"
									>
										<span className="quote-label">Reference:</span>
										<span className="quote-value-container">
											<span className="quote-value">{quoteInfo.referenceId}</span>
											{copiedField === 'referenceId' ? (
												<Check size={16} className="copy-icon copied" />
											) : (
												<Copy size={16} className="copy-icon" />
											)}
										</span>
									</button>
								)}
							</div>
						</motion.div>

						<motion.div
							className="next-steps"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.0 }}
						>
							<div className="steps-header">
								<Shield className="steps-icon" size={20} />
								<h3>What Happens Next?</h3>
							</div>
							<ul className="steps-list">
								<li>Pineapple Insurance will contact you within 24 hours</li>
								<li>They'll review your quote and finalize your policy details</li>
								<li>You'll receive your policy documents via email</li>
								<li>Your coverage will begin as per the agreed start date</li>
							</ul>
						</motion.div>
					</div>
				) : (
					<div className="success-content">
						<p className="success-message">
							Thank you! The customer's information has been successfully transferred to Pineapple Insurance.
						</p>
						
						<motion.div
							className="next-steps"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
						>
							<div className="steps-header">
								<FileText className="steps-icon" size={20} />
								<h3>What Happens Next?</h3>
							</div>
							<ul className="steps-list">
								<li>Pineapple Insurance will contact the customer within 24 hours</li>
								<li>They'll provide a personalized insurance quote</li>
								<li>The customer will receive policy options via email</li>
								<li>Coverage can begin once the policy is finalized</li>
							</ul>
						</motion.div>
					</div>
				)}

				<div className="action-container">
					<Button
						onClick={handleNewTransfer}
						variant="primary"
						className="action-button"
					>
						<RefreshCw size={18} className="button-icon" />
						New Transfer
					</Button>

					<Button
						onClick={handleNewQuote}
						variant="outline"
						className="action-button"
					>
						<Plus size={18} className="button-icon" />
						Get New Quote
					</Button>
				</div>
			</motion.div>
		</div>
	);
};

export default SuccessPage;
