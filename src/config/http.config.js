const { ENDPOINT } = require('../constants/definitions');

const BASE_URL = `${ENDPOINT}/api`;

const getRequest = async (endpoint) => {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`);
		return response.json();
	} catch (error) {
		console.error('Error fetching config:', error);
	}
};

const postRequest = async (endpoint, data, config = {}) => {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				...config,
			},
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching config:', error);
	}
};

module.exports = { getRequest, postRequest };
