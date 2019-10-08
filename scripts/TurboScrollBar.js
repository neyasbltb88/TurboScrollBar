import throttle from './throttle.js';

class TurboScrollBar {
    constructor(color) {
        this.color = color;
        this.root = document.documentElement;
        this.styleId = 'TurboScrollBar';
        this.isRun = false;

        this.thumbHeight = innerHeight / (this.root.scrollHeight / innerHeight);
        this.lastScrollPosition = pageYOffset;

        this.state = {
            shadowSize: 0,
            targetSize: 15
        };

        this.scrollHandler = throttle(this.scrollHandler, 50);

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
        this.changeShadow();
    }

    changeShadow() {
        let { shadowSize, targetSize } = this.state;
        console.log('shadowSize', shadowSize);

        if (targetSize <= 0 && shadowSize <= 0) {
            this.isRun = false;
            return;
        }

        if (shadowSize < targetSize) {
            shadowSize++;
        } else {
            targetSize = 0;
            shadowSize--;
        }

        requestAnimationFrame(() => {
            this.setState({
                shadowSize,
                targetSize
            });
        });
    }

    updateStyle() {
        let { shadowSize, direction } = this.state;
        let offsetY = Math.ceil(direction * shadowSize) + 'px';
        let blur = shadowSize + 'px';
        let size = Math.ceil(shadowSize / 3) + 'px';

        // console.log('offsetY: ', offsetY, 'blur: ', blur, 'size: ', size);

        let styleElem = document.querySelector(`#${this.styleId}`);

        let styleContent = /* css */ `
            ::-webkit-scrollbar-thumb {
                background-color: ${this.color};
                transition: box-shadow 1000ms ease;
                box-shadow: 0 ${offsetY} ${blur} ${size} ${this.color};
                border-radius: 5px;
            }
        `;

        if (!styleElem) {
            styleElem = document.createElement('style');
            styleElem.id = this.styleId;
            document.head.appendChild(styleElem);
        }

        styleElem.textContent = styleContent;
    }

    scrollHandler = () => {
        let { targetSize, direction } = this.state;
        // console.log('pageYOffset', pageYOffset);

        let diff = pageYOffset - this.lastScrollPosition;
        let newDirection = diff > 0 ? -1 : 1;
        targetSize = targetSize + (diff * (direction * newDirection)) / 4;
        this.lastScrollPosition = pageYOffset;

        this.setState({
            targetSize,
            direction: newDirection
        });

        // console.log('diff', diff);
        // console.log('targetSize', targetSize);
    };

    init() {
        document.addEventListener('scroll', this.scrollHandler);
        this.setState({
            targetSize: 15,
            direction: -1
        });
    }
}

window.turboScrollBar = new TurboScrollBar('rgb(255, 192, 0)');
