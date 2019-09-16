import {LitElement, html, css} from "lit-element";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'
/**
* @polymer
* @extends HTMLElement
*/
class ResearchDemo extends LitElement {
    static get properties() {
        return {
            demo: {
                type: Object
            }
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
                background-color: white;
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
            .preview img {
                max-width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .preview .jsgif {
                height: 100%
            }
            .preview .jsgif canvas {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
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
        let linkUrl = demo.url;
        let isVideo = false;
        if (linkUrl.startsWith('https://www.youtube.com') ||
            linkUrl.startsWith('https://youtu.be') ||
            linkUrl.startsWith('https://vimeo.com/')) {
                linkUrl = `./video.html?url=${encodeURIComponent(demo.url)}`;
                isVideo = true;
        } else {
            linkUrl = `./more.html?url=${encodeURIComponent(demo.url)}`;
        }
        // using unsafeHTML for img in preview so that superGif can update the html
        // otherwise litelement would try to update the (no longer existing) img src part only
        return html`
        <div class="demo">
            <div class="preview">
                ${unsafeHTML(`<img src="${demo.thumbnail}" rel:auto_play="0">`)}
            </div>
            <div class="info">
                <a href="${linkUrl}">
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
                        <div>More...</div><div class="arrow"><img src="images/icon-arrow.svg"></div>
                    </div>
                </a>
            </div>
        </div>
        `;
    }
    updated(changedProperties) {
        changedProperties.forEach((oldValue, propertyName) => {
            if (propertyName === 'demo') {
                if (this.demo.thumbnail.endsWith('.gif')) {
                    let img = this.shadowRoot.querySelector('.preview img');
                    this.sup = new SuperGif({
                        gif: img,
                        progressbar_height: 2,
                        progressbar_foreground_color: "#1c5a6d",
                        progressbar_background_color: "#ffffff"
                    });
                    this.sup.load();
                    let preview = this.shadowRoot.querySelector('.preview');
                    if (!this.startgifBound) {
                        this.startgifBound = this.startgif.bind(this);
                        this.stopgifBound = this.stopgif.bind(this);
                        this.togglegifBound =this.togglegif.bind(this);
                    }
                    preview.addEventListener('mouseover', this.startgifBound);
                    preview.addEventListener('mouseout', this.stopgifBound);
                    preview.addEventListener('click', this.togglegifBound);
                } else {
                    if (this.startgifBound && this.sup) {
                        let preview = this.shadowRoot.querySelector('.preview');
                        preview.removeEventListener('mouseover', this.startgifBound);
                        preview.removeEventListener('mouseout', this.stopgifBound);
                        preview.removeEventListener('click', this.togglegifBound);
                        this.sup = undefined;
                    }
                }
            }
        });
        
    }
    startgif(){
        if (!this.sup.get_loading()) {
            this.sup.play();
        }
    }
    stopgif(){
        if (this.gifClicked) {
            return; // do nothing
        }
        if (this.sup.get_playing()) {
            this.sup.pause();
        }
    }
    togglegif() {
        this.gifClicked = true;
        if(this.sup.get_loading()) {
            return window.setTimeout(this.togglegifBound, 500);
        }
        if (this.sup.get_playing()) {
            this.sup.pause();
        } else {
            this.sup.play();
        }

    }
}

customElements.define('research-demo', ResearchDemo);
