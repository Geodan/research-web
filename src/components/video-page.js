import {LitElement, html, css} from "lit-element";
import "whatwg-fetch";

/**
* @polymer
* @extends HTMLElement
*/
class VideoPage extends LitElement {
    static get properties() {
        return {
            demos: {type: Array}
        }
    }
    constructor() {
        super();
        this.config = "./config/config.json";
        this.demos = [];
    }
    static get styles() {
        return css`
            .footer {
                text-align: center;
                padding-top: 50px;
                padding-bottom: 50px;
                width: 1024px;
                max-width: 100vw;
                font-size: 18px;
            }
            .header {
                background-color: white; 
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                padding: 0 57px 0 57px;
                max-width: 1450px;
                box-sizing: border-box;
                margin-left: auto;
                margin-right: auto;
            }
            .header-title {
                font-size: x-large;
                text-transform: uppercase;
            }
            .header-logo img {
                height: 60px;
                width: auto;
                display: block;
            }
            .graybackground {
                display: flex;
                flex-direction: column;
                align-items: center;
                max-width: 1450px;
                box-sizing: border-box;
                margin-left: auto;
                margin-right: auto;
                background-color: #f4f4f4;
            }
            .content {
                width: 1024px;
                max-width: 100vw;
            }
            .back {
                display: flex;
                align-items: center;
                font-size: 20px;
                font-weight: 600;
                padding-top: 38px;
                padding-bottom: 38px;
                cursor: pointer;
            }
            .back img {
                margin-right: 10px;
            }
            .videodemo {
                background: white;
                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.15);
                padding-left: 100px;
                padding-right: 100px;
                padding-top: 60px;
                padding-bottom: 60px;
            }
            .date {
                font-size: 16px;
                font-weight: 300;
                margin-bottom: 15px;
            }
            .title {
                font-size: 36px;
                font-weight: bold;
                color: #d6232f;
                margin-bottom: 30px;
            }
            iframe {
                width: 825px;
                height: 465px;
            }
            .description {
                font-size: 16px;
                font-weight: normal;
                color: #333333;
                line-height: 2.13;
                margin-top: 30px;
            }
            .footer {
                height: 40px;
                line-height: 40px;
            }
            @media all and (max-width: 825px) {
                .header {
                    justify-content: center;
                }
                iframe {
                    width: 98vw;
                    height: 55vw;
                }
                .videodemo {
                    padding-left: 2px;
                    padding-right: 2px;
                }
            }
        `
    }
    renderIframe(demo) {
        if (demo.isVimeo) {
            return html`
            <iframe src="https://player.vimeo.com/video/${demo.url}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
            `
        }        
        return html`<iframe  src="https://www.youtube.com/embed/${demo.url}?modestbranding=1&rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    renderVideo() {
        if (this.demos.length === 0) {
            return html`invalid url`;
        }
        return html`
            <div class="graybackground">
                <div class="content">
                    <div class="back" onclick="window.history.go(-1);"><img src="images/icon-back.svg">Back</div>
                    <div class="videodemo">
                        <div class="date"><b>Date</b> - ${this.demos[0].date}</div>
                        <div class="title">${this.demos[0].title}</div>
                        ${this.renderIframe(this.demos[0])}
                        <div class="description">${this.demos[0].description}</div>
                    </div>    
                </div>
                <div class="footer">
                    Geodan Research ${new Date().getFullYear()}
                </div>
            </div>
        `;
    }
    render() {
        return html`
            <div class="header">
                <div class="header-title"><b>Research</b> demos</div>
                <div class="header-logo"><img src="images/geodan.png"></div>
            </div>
            <div class="video">
                ${this.renderVideo()}
            </div>
        `
    }
    firstUpdated() {
        this._loadConfig();
    }
    
    _loadConfig() {
        fetch(this.config).then(response=>{
            if (!response.ok) {
                return [{"error": `failed to fetch ${this.config}`}];
            } else {
                try {
                    const json  = response.json();
                    return json;
                } catch(error) {
                    return [{"error": `failed to parse ${this.config}`}];
                }
            }
        }).then(demos=>{
            let urlParams = new URLSearchParams(window.location.search);
            let videoUrl = urlParams.get('url');
            this.demos = demos.filter(demo=>!demo.disabled && demo.url === videoUrl).map(demo=>{
                if (demo.url.startsWith('https://www.youtube.com')) {
                    let urlParams = new URLSearchParams(new URL(demo.url).search);
                    demo.url = urlParams.get('v'); // embed id
                } else if (demo.url.startsWith('https://youtu.be/')) {
                    demo.url = demo.url.substring(16);
                } else if (demo.url.startsWith('https://vimeo.com/')) {
                    demo.isVimeo = true;
                    demo.url = demo.url.substring('18')
                }
                return demo;
            });
        })
    }
}

customElements.define('video-page', VideoPage);
