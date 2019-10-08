import SmoothScroll from './SmoothScroll.js';

class TurboScrollBar {
    constructor(color) {
        this.color = color;
        this.root = document.documentElement;
        this.styleId = 'TurboScrollBar';
        this.isRun = false;
        this.lastScrollPosition = pageYOffset;

        this.thumbHeight = innerHeight / (this.root.scrollHeight / innerHeight);

        this.state = {
            shadowSize: 0,
            targetSize: 0,
            direction: -1
        };

        this.init();
    }

    camelToKebab(string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    setState(newState) {
        this.state = {
            ...this.state,
            ...newState
        };

        // console.log('shadowSize: ', this.state.shadowSize, 'targetSize: ', this.state.targetSize);
        this.updateStyle();
    }

    updateStyle() {
        let { shadowSize, direction } = this.state;
        let blur = shadowSize / 1.5;
        let size = shadowSize;
        let offsetY = Math.ceil(direction * (blur + (size / 4) * 3));

        let styleElem = document.querySelector(`#${this.styleId}`);

        let styleContent = /* css */ `
            ::-webkit-scrollbar-thumb {
                background-color: ${this.color};
                box-shadow: 0 ${offsetY}px ${blur}px ${size}px ${this.color};
            }
        `;

        if (!styleElem) {
            styleElem = document.createElement('style');
            styleElem.id = this.styleId;
            document.head.appendChild(styleElem);
        }

        styleElem.textContent = styleContent;
    }

    isChangeDirection(oldDirection, newDirection) {
        return oldDirection * newDirection;
    }

    scrollHandler = () => {
        let { shadowSize, direction } = this.state;
        let diff = pageYOffset - this.lastScrollPosition;
        this.lastScrollPosition = pageYOffset;
        let newDirection = diff > 0 ? -1 : 1;
        shadowSize = Math.abs(diff * this.isChangeDirection(direction, newDirection));

        this.setState({
            shadowSize,
            direction: newDirection
        });
    };

    init() {
        new SmoothScroll(document, 100, 15);

        this.updateStyle();

        document.addEventListener('scroll', this.scrollHandler);
    }
}

window.turboScrollBar = new TurboScrollBar('rgb(255, 192, 0)');
