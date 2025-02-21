const AnimationController = require('./modules/animation');
const UIController = require('./modules/ui');
const ActivityTracker = require('./modules/activity');
const { getSourceLink, getSource } = require('./utils/common.util');
const { LOADER_CSS } = require('./constants/theme.constant');

class App {
	constructor() {
		this.animationController = new AnimationController();
		this.uiController = new UIController();
		this.activityTracker = new ActivityTracker();
		this.CONFIG = [];
		this.displayState = {};
		this.isFirstLandTriggered = false;
	}

	/**
	 * @name initialize
	 * @description Initialize the app
	 */
	async initialize() {
		// Initialize activity tracking
		await this.activityTracker.fetchInteractionConfig();

		// Setup canvas
		const fallbackLoader = this.appendFallbackLoader();
		const canvas = this.createCanvas();
		await this.animationController.initialize(canvas, fallbackLoader);

		// Initialize UI with source link
		const sourceLink = getSourceLink();
		this.uiController.initialize(sourceLink);

		// Fetch and setup interaction config
		this.CONFIG = this.activityTracker.getConfig();

		// Setup event listeners
		this.setupPathChangeObserver();

		// Track button events
		this.activityTracker.trackButtonEvents();

		// Trigger initial config
		this.triggerConfig();
	}

	appendFallbackLoader() {
		const fallbackLoader = document.createElement('div');
		fallbackLoader.id = 'loader';

		if (document.body) {
			document.body.appendChild(fallbackLoader);
		} else {
			document.addEventListener('DOMContentLoaded', () => document.body.appendChild(fallbackLoader));
		}

		const style = document.createElement('style');
		style.type = 'text/css';
		style.appendChild(document.createTextNode(LOADER_CSS));
		document.head.appendChild(style);

		return fallbackLoader;
	}

	createCanvas() {
		const canvas = document.createElement('canvas');
		canvas.id = 'threejs-canvas';
		document.body.appendChild(canvas);

		const isMobile = window.matchMedia('(max-width: 767px)').matches;
		canvas.style.position = 'fixed';
		canvas.style.bottom = '-40px';
		canvas.style.right = isMobile ? '-76px' : '-60px';
		canvas.style.height = isMobile ? '260px' : '280px';
		canvas.style.width = isMobile ? '260px' : '280px';

		return canvas;
	}

	setupPathChangeObserver() {
		let previousPathname = window.location.href;
		const observer = new MutationObserver(() => {
			if (window.location.href !== previousPathname) {
				previousPathname = window.location.href;
				this.handlePathChange();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	handlePathChange() {
		const tooltipContainer = document.getElementById('tooltipContainer');
		if (tooltipContainer) {
			tooltipContainer.remove();
		}

		this.uiController.showInput();
		this.activityTracker.addInterationActivity({
			type: 'pageVisit',
			source: getSource(),
		});
	}

	triggerConfig() {
		this.CONFIG.forEach((config) => {
			if (!this.isConfigValid(config)) return;

			switch (config.type) {
				case 'onFirstLand':
					if (!this.isFirstLandTriggered) {
						this.showUIAnimation(config);
					}
					break;
				case 'inActive':
					this.handleInactiveConfig(config);
					break;
				case 'scroll':
					this.handleScrollConfig(config);
					break;
				case 'popstate':
					this.handlePopstateConfig(config);
					break;
			}
		});
	}

	isConfigValid(config) {
		let isTrafficSourceValid = this.validateTrafficSource(config.traffic_source);
		let isLocationValid = this.validateLocation(config.location);
		return isTrafficSourceValid && isLocationValid;
	}

	validateTrafficSource(trafficSources) {
		if (!trafficSources?.length || trafficSources.includes('any')) {
			return true;
		}

		const source = getSource();
		return trafficSources.includes(source);
	}

	validateLocation(locations) {
		if (!locations?.length) {
			return true;
		}

		const currTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return locations.includes(currTimezone);
	}

	handleInactiveConfig(config) {
		let timer;
		const resetTimer = () => {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => this.showUIAnimation(config), config.inActiveTime);
		};

		resetTimer();
		['click', 'scroll'].forEach((event) => {
			window.addEventListener(event, resetTimer);
		});
		document.addEventListener('mousemove', resetTimer);
	}

	handleScrollConfig(config) {
		window.addEventListener('scroll', () => {
			const scrollTop = window.scrollY || window.pageYOffset;
			const docHeight = document.documentElement.scrollHeight;
			const winHeight = window.innerHeight;
			const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
			const path = window.location.href;

			const isPathMatch = config.match === 'equals' ? path === config.pagePath : path.includes(config.pagePath);

			if (isPathMatch && Number(scrollPercent) > Number(config.scrollValue)) {
				if (this.displayState[config.id]) return;
				this.displayState[config.id] = true;
				this.showUIAnimation(config);
			}
		});
	}

	handlePopstateConfig(config) {
		const path = window.location.href;
		const isPathMatch = config.match === 'equals' ? path === config.pagePath : path.includes(config.pagePath);

		if (isPathMatch) {
			this.showUIAnimation(config);
		}

		window.addEventListener('pathChange', () => {
			const pagePath = window.location.href;
			const isNewPathMatch =
				config.match === 'equals' ? pagePath === config.pagePath : pagePath.includes(config.pagePath);

			if (isNewPathMatch) {
				if (this.displayState[config.id]) return;

				const showAnimation = () => {
					this.displayState[config.id] = true;
					this.showUIAnimation(config);
				};

				if (config.delay) {
					setTimeout(showAnimation, config.delay);
				} else {
					showAnimation();
				}
			}
		});
	}

	showUIAnimation(config) {
		if (this.uiController.currentlyAnimating) return;

		this.animationController.resetHead();

		if (config.animation) {
			const animationIdx = this.animationController.possibleAnims?.findIndex(
				(animation) => animation.name === config.animation
			);

			if (animationIdx >= 0) {
				this.animationController.playModifierAnimation(
					this.animationController.idle,
					1,
					this.animationController.possibleAnims[animationIdx],
					1.5
				);
			}
		}

		this.activityTracker.incrementImpression(config.id);
		this.uiController.hideInput();

		const type = config.imageUrl ? 'overlay' : 'tooltip';
		if (type === 'tooltip') {
			this.uiController.showTooltip(config, () => {
				if (config.onEnd) {
					const nextConfig = this.CONFIG.find((c) => c.id === config.onEnd);
					if (nextConfig) {
						this.showUIAnimation(nextConfig);
					}
				} else {
					this.uiController.showInput();
				}
			});
		} else {
			this.uiController.showOverlay(config, () => {
				if (config.onEnd) {
					const nextConfig = this.CONFIG.find((c) => c.id === config.onEnd);
					if (nextConfig) {
						this.showUIAnimation(nextConfig);
					}
				} else {
					this.uiController.showInput();
				}
			});
		}
	}
}

// Initialize the app
module.exports = App;
