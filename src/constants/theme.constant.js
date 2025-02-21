const TOOLTIP_BG = '#fff';
const TOOLTIP_COLOR = '#0D1934';

const LOADER_CSS = `
#loader {
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 36px;
  right: 36px;
  --colorA: #BE0EFF;

  &::before,
  &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border-top: 4px solid #fff;
      filter:
          drop-shadow(0 0 2px var(--colorA))
          drop-shadow(0 0 5px var(--colorA))
          drop-shadow(0 0 10px var(--colorA))
          drop-shadow(0 0 20px var(--colorA));
      animation: rotate 3s infinite linear;
  }

  &::after {
      --colorA: #6622FF;
      animation-delay: -1.5s;
  }
}

@keyframes rotate {
  100% {
      transform: rotate(360deg);
  }
}
`;

module.exports = { TOOLTIP_BG, TOOLTIP_COLOR, LOADER_CSS };
