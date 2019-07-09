import {LitElement, html, css} from "lit-element";

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
                display: block;
                width: 200px;
                cursor: pointer;
                position: relative;
                margin-top: 10px;
                margin-right: 10px;
            }
            a.demo {
                text-decoration: none;
                color: black;
            }
            a.demo:visited {
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
                width: calc(100% - 20px);
                height: 0px;
                overflow: hidden;
                transition: height .5s;
                margin: 10px;
            }
            .preview:hover + .description, .description:hover {
                height: calc(150px - 20px);
            }
            .title {width: 100%;}
            .date {
                font-style: italic;
            }
        `
    }
    render() {
        console.log('rendering demo')
        const demo = this.demo;
        if (this.demo.error) {
            return html`${demo.error}`
        }
        return html`
        <a class="demo" href="${demo.url}" target="researchdemo">
            <div class="preview">
                <img src="${demo.thumbnail}">
            </div>
            <div class="description">
                ${demo.description}
            </div>
            <div class="title">
                ${demo.title}
            </div>
            <div class="date">
                ${demo.date}
            </div>
        </a>
        `;
    }
}

customElements.define('research-demo', ResearchDemo);
