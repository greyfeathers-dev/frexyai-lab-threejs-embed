const { TOOLTIP_BG, TOOLTIP_COLOR } = require('../constants/theme.constant');
const { CHATBOT_PAGE } = require('../constants/definitions');
const { AUDIO_PATH, CLOSE_ICON } = require('../constants/assets.constant');

class UIController {
	constructor() {
		this.isMobile = window.matchMedia('(max-width: 767px)').matches;
		this.audio = new Audio(AUDIO_PATH);
		this.currentlyAnimating = false;
		this.currentAnimationID = null;
		this.timeoutDisappear = null;
		this.sourceLink = '#';
	}

	initialize(sourceLink) {
		this.sourceLink = sourceLink;
		this.appendInput();
		this.appendChatWindow();
	}

	appendInput() {
		const inputContainer = document.createElement('div');
		inputContainer.id = 'input';
		inputContainer.style.cssText = `
            background: linear-gradient(45deg, purple, blue);
            padding: 1px;
            position: fixed;
            border-radius: 20px;
            bottom: ${this.isMobile ? '8px' : '32px'};
            right: ${this.isMobile ? '80px' : '108px'};
            display: none;
        `;

		const input = document.createElement('div');
		input.innerHTML = 'Ask me anything';
		input.style.cssText = `
            color: #8F8F8F;
            background: #fff;
            font-size: 14px;
            line-height: 36px;
            font-family: sans-serif;
            padding: 0px 20px;
            width: ${this.isMobile ? '62vw' : '220px'};
            height: 36px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 10;
        `;

		const imageIcon = document.createElement('img');
		imageIcon.src =
			'https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Ask%20me%20Anything%20Animation.gif';
		imageIcon.style.cssText = `
            position: absolute;
            top: -1px;
            right: 2px;
            width: 48px;
            height: 40px;
        `;

		inputContainer.appendChild(input);
		inputContainer.appendChild(imageIcon);
		document.body.appendChild(inputContainer);

		input.addEventListener('click', (e) => {
			e.preventDefault();
			this.showChatWindow();
		});
	}

	appendChatWindow() {
		const chatWindow = document.createElement('div');
		chatWindow.id = 'chatWindow';
		chatWindow.style.cssText = `
            position: fixed;
            box-sizing: border-box;
            border: ${this.isMobile ? 0 : '0.3px solid #8F8F8F'};
            color: #fff;
            border-radius: ${this.isMobile ? 0 : '16px'};
            background: #fff;
            font-size: 14px;
            width: ${this.isMobile ? '100%' : '390px'};
            height: ${this.isMobile ? '100%' : '625px'};
            bottom: ${this.isMobile ? 0 : '20px'};
            right: ${this.isMobile ? 0 : '20px'};
            z-index: 1000;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
            display: none;
        `;

		const iframeContainer = document.createElement('iframe');
		iframeContainer.id = 'chatbot-iframe';
		iframeContainer.src = this.sourceLink;
		iframeContainer.style.cssText = `
            width: 100%;
            height: 100%;
            border: 0;
            border-radius: ${this.isMobile ? 0 : '16px'};
        `;

		const closeButton = document.createElement('span');
		closeButton.innerHTML = '×';
		closeButton.style.cssText = `
            cursor: pointer;
            position: absolute;
            right: 16px;
            top: 8px;
            font-size: 24px;
            color: #fff;
        `;

		closeButton.onclick = () => {
			chatWindow.style.display = 'none';
		};

		chatWindow.appendChild(iframeContainer);
		chatWindow.appendChild(closeButton);
		document.body.appendChild(chatWindow);
	}

	showTooltip(config, animationCB) {
		if (this.currentlyAnimating) return;

		this.currentlyAnimating = true;
		this.currentAnimationID = config.id;
		this.hideInput();

		const tooltipContainer = this.createTooltipContainer();
		const tooltip = this.createTooltip(config.text);
		tooltipContainer.appendChild(tooltip);

		if (config.hasClose) {
			const closeBtn = this.createCloseButton(config, tooltipContainer, animationCB);
			tooltipContainer.appendChild(closeBtn);
		}

		if (config.timerCountdown) {
			const timer = this.createCountdownTimer(config.timerCountdown, tooltipContainer, animationCB);
			tooltipContainer.appendChild(timer);
		}

		if (config.cta) {
			const ctaContainer = this.createCTAContainer(config);
			tooltipContainer.appendChild(ctaContainer);
		}

		document.body.appendChild(tooltipContainer);
		this.audio.play();

		if (config.time) {
			this.timeoutDisappear = setTimeout(() => {
				this.closeTooltip(tooltipContainer, animationCB);
			}, config.time * 1000);
		}
	}

	showOverlay(config, animationCB) {
		if (this.currentlyAnimating) return;

		this.currentlyAnimating = true;
		this.currentAnimationID = config.id;
		this.hideInput();

		const tooltipContainer = document.createElement('div');
		tooltipContainer.id = 'tooltipContainer';
		tooltipContainer.style.cssText = `
			position: fixed;
			font-size: ${this.isMobile ? '14px' : '16px'};
			line-height: ${this.isMobile ? '18px' : '20px'};
			font-family: sans-serif;
		`;

		tooltipContainer.innerHTML = this.createOverlayContent(config);

		if (config.hasClose) {
			const closeBtn = this.createCloseButton(config, tooltipContainer, animationCB);
			tooltipContainer.appendChild(closeBtn);
		}

		if (config.timerCountdown) {
			const timer = this.createCountdownTimer(config.timerCountdown, tooltipContainer, animationCB);
			tooltipContainer.appendChild(timer);
		}

		if (config.cta) {
			const ctaContainer = this.createOverlayCTAContainer(config);
			const textArea = tooltipContainer.querySelector('#text-area');
			if (textArea) {
				textArea.appendChild(ctaContainer);
			}
		}

		document.body.appendChild(tooltipContainer);
		tooltipContainer.style.right = this.isMobile ? '90px' : '120px';
		tooltipContainer.style.bottom = this.isMobile ? '12px' : '20px';
		tooltipContainer.style.display = 'block';

		this.audio.play();

		if (config.time) {
			this.timeoutDisappear = setTimeout(() => {
				this.closeTooltip(tooltipContainer, animationCB);
			}, config.time * 1000);
		}
	}

	createTooltipContainer() {
		const container = document.createElement('div');
		container.id = 'tooltipContainer';
		container.style.cssText = `
            position: fixed;
            max-width: ${this.isMobile ? '260px' : '300px'};
            right: ${this.isMobile ? '90px' : '120px'};
            bottom: ${this.isMobile ? '40px' : '52px'};
            display: block;
        `;
		return container;
	}

	createTooltip(text) {
		const tooltip = document.createElement('div');
		tooltip.id = 'tooltip';
		tooltip.style.cssText = `
            position: relative;
            background-color: ${TOOLTIP_BG};
            color: ${TOOLTIP_COLOR};
            padding: 16px 20px;
            border-radius: 16px;
            font-size: 16px;
            line-height: 24px;
            font-family: sans-serif;
            pointer-events: none;
            white-space: wrap;
            z-index: 10;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
            margin: 8px 0;
        `;

		const textArea = document.createElement('p');
		textArea.innerHTML = text;
		textArea.style.margin = '0';
		textArea.style.overflowWrap = 'break-word';
		tooltip.appendChild(textArea);

		return tooltip;
	}

	createCloseButton(config, container, animationCB) {
		const closeBtn = document.createElement('button');
		closeBtn.style.cssText = `
            background: white;
            padding: 4px;
            border: 0;
            position: absolute;
            top: -6px;
            left: -12px;
            width: 26px;
            height: 26px;
            font-size: 10px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99;
            cursor: pointer;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        `;

		const closeIcon = document.createElement('img');
		closeIcon.src = CLOSE_ICON;
		closeIcon.style.cssText = 'width: 16px; height: 16px;';
		closeBtn.appendChild(closeIcon);

		closeBtn.addEventListener('click', () => {
			if (config.onClickClose?.alertText) {
				this.closeTooltip(container, animationCB);
				this.showTooltip(
					{
						hasClose: false,
						text: config.onClickClose.alertText,
						time: 2000,
						cta: [],
					},
					animationCB
				);
				return;
			}
			this.closeTooltip(container, animationCB);
		});

		return closeBtn;
	}

	createCountdownTimer(duration, container, animationCB) {
		const timer = document.createElement('div');
		timer.style.cssText = `
            text-align: center;
            padding: 2px 6px;
            color: #ff0000;
            font-size: 12px;
            font-weight: bold;
            position: absolute;
            top: -8px;
            left: -10px;
            border-radius: 8px;
            z-index: 99;
            background: white;
        `;

		let timeLeft = duration;
		const updateTimer = () => {
			if (timeLeft > 0) {
				timer.innerText = this.formatTime(timeLeft);
				timeLeft--;
			} else {
				this.closeTooltip(container, animationCB);
			}
		};

		setInterval(updateTimer, 1000);
		return timer;
	}

	formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	}

	createCTAContainer(config) {
		const ctaContainer = document.createElement('div');
		ctaContainer.style.marginTop = '12px';

		config.cta.forEach((ctaItem) => {
			const btn = document.createElement('button');
			btn.innerHTML = ctaItem.text;
			btn.style.cssText = `
                border-radius: 28px;
                border: 0;
                font-size: 14px;
                line-height: 24px;
                font-family: sans-serif;
                background: ${ctaItem.bg};
                color: ${ctaItem.color};
                padding: 10px 14px;
                margin-right: 6px;
                cursor: pointer;
            `;

			btn.addEventListener('click', () => {
				this.handleCTAClick(config);
			});

			ctaContainer.appendChild(btn);
		});

		return ctaContainer;
	}

	handleCTAClick(config) {
		if (config.format === 'leadGen') {
			this.sourceLink = `${CHATBOT_PAGE}/form/${config.id}`;
			this.showChatWindow();
		} else if (config.format === 'pageVisit' && config.destination_page) {
			window.location.href = `https://${config.destination_page}`;
		}
	}

	closeTooltip(container, animationCB) {
		container.remove();
		this.currentlyAnimating = false;
		animationCB();
		this.timeoutDisappear = null;
	}

	showInput() {
		if (this.currentlyAnimating) return;
		const input = document.getElementById('input');
		if (input) input.style.display = 'block';
	}

	hideInput() {
		const input = document.getElementById('input');
		if (input) input.style.display = 'none';
	}

	showChatWindow() {
		const chat = document.getElementById('chatWindow');
		const chatbot = document.getElementById('chatbot-iframe');
		if (chat && chatbot) {
			chatbot.src = this.sourceLink;
			setTimeout(() => {
				chat.style.display = 'block';
			}, 200);
		}
	}

	createOverlayContent(config) {
		return `
			<div style="display:flex;flex-direction:column;background:${TOOLTIP_BG};padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0, 0, 0, 0.3)">
				<img src=${config.imageUrl} style="height:200px;width:200px;border-radius:10px;margin-bottom:12px"/>
				<div id="text-area">
					<div style="color:${TOOLTIP_COLOR};font-size: 14px;line-height:20px">${config.text}</div>
				</div>
			</div>
		`;
	}

	createOverlayCTAContainer(config) {
		const ctaContainer = document.createElement('div');
		ctaContainer.style.marginTop = '4px';

		config.cta.forEach((ctaItem) => {
			const btn = document.createElement('button');
			btn.innerHTML = ctaItem.text;
			btn.style.cssText = `
				border-radius: 28px;
				width: 100%;
				border: 0;
				background: ${ctaItem.bg};
				color: ${ctaItem.color};
				padding: 10px 14px;
				margin-top: 4px;
				cursor: pointer;
			`;

			btn.addEventListener('click', () => {
				this.handleCTAClick(config);
			});

			ctaContainer.appendChild(btn);
		});

		return ctaContainer;
	}
}

module.exports = UIController;
