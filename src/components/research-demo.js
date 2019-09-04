import {LitElement, html, css} from "lit-element";
/**
* @polymer
* @extends HTMLElement
*/
class ResearchDemo extends LitElement {
    static get properties() {
        return {
            demo: {type: Object}
        }
    }
    constructor() {
        super();
        this.demo = {};
    }
    static get styles() {
        return css`
            .demo {
                display: flex;
                flex-direction: column;
                width: 200px;
                justify-content: space-between;
                margin-top: 10px;
                margin-right: 10px;
                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.15);
                min-height: 300px;
            }
            a {
                text-decoration: none;
                color: black;
            }
            a:visited {
                color: gray;
            }
            .preview { 
                width: 100%; 
                height: 150px; 
                display: flex; 
                justify-content: center;
                align-items: flex-start;
            }
            .preview img {max-width: 100%; height: auto; max-height: 100%;}
            .description {
                background: whitesmoke;
                position: absolute;
                top: 0;
                left: 0;
                width: calc(100% - 10px);
                height: 0px;
                overflow: auto;
                transition: height .5s;
                margin: 5px;
            }
            .preview:hover + .description, .description:hover {
                height: calc(150px - 20px);
            }
            .info {
                height: 150px;
            }
            .date {
                font-style: italic;
                color: #333333;
                font-size: 14px;
                font-weight: 300;
                padding: 0 10px;
                height: 20px;
            }
            .title {
                font-size: 16px;
                color: #333333;
                font-weight: 600;
                padding: 0 10px;
                height: 90px;
            }
            .todemo {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 0 0 10px;
                color: #1c5a6d;
                font-size: 14px;
                font-weight: 600;
                height: 40px;
            }
            .arrow {
                height: 40px;
                width: 40px;
                background-color: #1c5a6d;
                padding-top: 8px;
                box-sizing: border-box;
            }
            .arrow img {
                display: block;
                margin: auto;
            }
        `
    }
    render() {
        const demo = this.demo;
        if (this.demo.error) {
            return html`${demo.error}`
        }
        return html`
        <div class="demo">
            <div class="preview">
                <img src="${demo.thumbnail}" rel:auto_play="0">
            </div>
            <div class="info">
                <a href="${demo.url}" target="researchdemo">
                    <div class="date">
                        ${demo.date}
                    </div>
                    <div class="description">
                        ${demo.description}
                    </div>
                    <div class="title">
                        ${demo.title}
                    </div>
                    <div class="todemo">
                        <div>Demo</div><div class="arrow"><img src="images/icon-arrow.svg"></div>
                    </div>
                </a>
            </div>
        </div>
        `;
    }
    firstUpdated() {
        if (this.demo.thumbnail.endsWith('.gif')) {
            let img = this.shadowRoot.querySelector('.preview img');
            this.sup = new SuperGif({
                gif: img,
                progressbar_height: 0
            });
            this.sup.load();
            let preview = this.shadowRoot.querySelector('.preview');
            preview.addEventListener('mouseover', ()=>this.startgif());
            preview.addEventListener('mouseout', ()=>this.stopgif());
            preview.addEventListener('click', ()=>this.togglegif())
        }
    }
    startgif(){
        if (!this.sup.get_loading()) {
            this.sup.play();
            this.justStartedPlaying = true; // touch-devices: mouseover and click both fire at same time
            window.setTimeout(()=>this.justStartedPlaying = false, 1000);
        }
    }
    stopgif(){
        if (this.justStartedPlaying) {
            return false;
        }
        if (this.sup.get_playing()) {
            this.sup.pause();
            return true;
        }
        return false;
    }
    togglegif() {
        if (!this.stopgif()) {
            this.startgif();
        }
    }
}

customElements.define('research-demo', ResearchDemo);
