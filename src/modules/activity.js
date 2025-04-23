const { getLeadId } = require('../utils/common.util');
const { getRequest, postRequest } = require('./http.config');

class ActivityTracker {
	leadId;
	config;

	constructor() {
		this.leadId = getLeadId();
	}

	/**
	 * @name fetchInteractionConfig
	 * @description Fetch interaction config from server
	 */
	async fetchInteractionConfig() {
		try {
			const response = await getRequest(`/get-interaction?id=${this.leadId}`);
			this.config = response.data;
		} catch (error) {
			console.error('Error fetching config:', error);
		}
	}

	/**
	 * @name getConfig
	 * @description Get interaction config
	 * @returns {Object} - interaction config
	 */
	getConfig() {
		return this.config;
	}

	/**
	 * @name addInterationActivity
	 * @description Add interaction activity to server
	 * @param {Object} activity - interaction activity
	 */
	async addInterationActivity(activity) {
		try {
			const response = await postRequest(`/add-activity`, {
				id: this.leadId,
				activity: {
					...activity,
					page_source: window.location.href,
					created_at: Date.now(),
				},
			});
			return response;
		} catch (error) {
			console.error('Error adding interaction activity:', error);
		}
	}

	/**
	 * @name incrementClick
	 * @description Increment click
	 * @param {string} id - offer id
	 */
	async incrementClick(id) {
		try {
			await this.addInterationActivity({
				type: 'offerClicked',
				offer_id: id,
			});
			const response = await postRequest(`/increment-click`, {
				id: this.leadId,
			});
			return response;
		} catch (error) {
			console.error('Error incrementing click:', error);
		}
	}

	/**
	 * @name incrementImpression
	 * @description Increment impression
	 * @param {string} id - offer id
	 */
	async incrementImpression(id) {
		try {
			await Promise.all([
				this.addInterationActivity({
					type: 'offerView',
					offer_id: id,
				}),
				getOrUpdateOfferIds(id),
			]);
			const response = await postRequest(`/increment-impressions`, {
				id,
			});
			return response;
		} catch (error) {
			console.error('Error incrementing impression:', error);
		}
	}

	trackButtonEvents() {
		const buttons = document.querySelectorAll('button');

		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.addInterationActivity({
					type: 'buttonClicked',
					button_name: button.innerText || 'UNNAMED',
				});
			});

			let hoverTimeout;
			button.addEventListener('mouseenter', () => {
				hoverTimeout = setTimeout(() => {
					this.addInterationActivity({
						type: 'buttonHovered',
						button_name: button.innerText || 'UNNAMED',
					});
				}, 2000);
			});

			button.addEventListener('mouseleave', () => {
				clearTimeout(hoverTimeout);
			});
		});
	}
}

module.exports = ActivityTracker;
