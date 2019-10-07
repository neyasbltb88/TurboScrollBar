import throttle from './throttle.js';
// window.addEventListener('scroll', winScrollHandler);

class TurboScrollBar {
    constructor(color) {
        this.color = color;
        this.root = document.documentElement;
        this.styleId = 'TurboScrollBar';

        this.state = {
            shadowSize: 0,
            targetSize: 15
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
        this.changeShadow();
    }

    changeShadow() {
        let { shadowSize, targetSize } = this.state;
        if (targetSize <= 0 && shadowSize <= 0) return;

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
        let offsetY = direction * shadowSize + 'px';
        let blur = shadowSize + 'px';
        let size = shadowSize / 3 + 'px';

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

    init() {
        this.setState({
            targetSize: 15,
            direction: -1
        });
    }
}

window.turboScrollBar = new TurboScrollBar('rgb(255, 192, 0)');
