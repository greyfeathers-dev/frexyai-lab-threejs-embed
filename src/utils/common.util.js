const { CHATBOT_PAGE } = require('../constants/definitions');

const getLeadId = () => {
	let leadId = localStorage.getItem('leadId');
	if (!leadId) {
		leadId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
		localStorage.setItem('leadId', leadId);
	}
	return leadId;
};

const getOrUpdateOfferIds = (offerId) => {
	const existingOfferIds = JSON.parse(localStorage.getItem('offerIds')) || [];
	if (existingOfferIds.includes(offerId)) return existingOfferIds;
	existingOfferIds.push(offerId);
	localStorage.setItem('offerIds', JSON.stringify(existingOfferIds));
	return existingOfferIds;
};

const getSource = () => {
	const referrer = document.referrer;
	const path = window.location.href;
	if (referrer === 'https://www.google.com/') return 'google';
	else if (referrer === 'https://www.yahoo.com/') return 'yahoo';
	else if (referrer === 'https://www.bing.com/') return 'bing';
	else if (referrer === 'https://www.youtube.com/') return 'youtube';
	else if (referrer === 'https://www.linkedin.com/') return 'linkedin';
	else if (referrer === 'https://www.reddit.com/') return 'reddit';
	else if (path.includes('gclid')) return 'paid_google';
	else if (path.includes('msclkid')) return 'paid_bing';
	else if (path.includes('li_fat_id')) return 'paid_linkedin';
	else if (path.includes('fbclid')) return 'paid_meta';
	else if (path.includes('wbraid')) return 'paid_youtube';
	else if (path.includes('cid')) return 'paid_reddit';
	else return 'direct';
};

const getSourceLink = () => {
	const leadId = getLeadId();
	const source = getSource();
	const country = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const firstPageVisited = window.location.href;

	return `${CHATBOT_PAGE}/chat?lead=${leadId}&source=${source}&country=${country}&firstPageVisited=${firstPageVisited}&conversion_page=${window.location.href}`;
};

module.exports = { getLeadId, getOrUpdateOfferIds, getSource, getSourceLink };
