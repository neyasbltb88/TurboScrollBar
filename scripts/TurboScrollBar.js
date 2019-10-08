import throttle from './throttle.js';
import Easing from './Easing.js';

window.Easing = Easing;

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

        // this.scrollHandler = throttle(this.scrollHandler, 50);
        // this.scrollHandler = throttle(this.scrollHandler, 1000 / 60);

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
        !this.isRun && this.changeShadow();
    }

    changeShadow() {
        this.isRun = true;
        let { shadowSize, targetSize } = this.state;

        if (targetSize <= 1 && shadowSize <= 1) {
            targetSize = 0;
            shadowSize = 0;
            this.setState({
                shadowSize,
                targetSize
            });
            this.isRun = false;
            return;
        }

        if (shadowSize < targetSize) {
            shadowSize = Math.ceil(
                shadowSize +
                    (1 +
                        Easing.easeOutQuart(shadowSize / this.thumbHeight) +
                        Easing.easeInQuart(shadowSize / targetSize))
            );
        } else if (shadowSize >= targetSize) {
            targetSize = 0;
            shadowSize = Math.ceil(
                shadowSize - (2 + Easing.easeInQuart(shadowSize / this.thumbHeight))
                // Easing.easeInCubic(targetSize / this.thumbHeight)
            );
        }

        console.log('shadowSize', shadowSize, ' / ', targetSize);

        requestAnimationFrame(() => {
            this.setState({
                shadowSize,
                targetSize
            });

            this.changeShadow();
        });
    }

    updateStyle() {
        let { shadowSize, targetSize, direction } = this.state;
        let blur = shadowSize;
        let size = shadowSize / 2;
        let offsetY = Math.ceil(direction * (blur + size / 2));

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
        let { targetSize, shadowSize, direction } = this.state;
        // console.log('pageYOffset', pageYOffset);

        this.thumbHeight = innerHeight / (this.root.scrollHeight / innerHeight);
        let diff = pageYOffset - this.lastScrollPosition;
        let newDirection = diff > 0 ? -1 : 1;
        targetSize = Math.abs(shadowSize + diff * this.isChangeDirection(direction, newDirection));

        targetSize = targetSize <= this.thumbHeight ? targetSize : this.thumbHeight;

        // targetSize = Math.abs(shadowSize + diff);
        this.lastScrollPosition = pageYOffset;

        this.setState({
            targetSize,
            direction: newDirection
        });

        // console.log('diff', diff);
        // console.log('targetSize', targetSize);
    };

    init() {
        this.updateStyle();

        document.addEventListener('scroll', this.scrollHandler);
        // this.setState({
        //     targetSize: 15,
        //     direction: -1
        // });
    }
}

window.turboScrollBar = new TurboScrollBar('rgb(255, 192, 0)');
