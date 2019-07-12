import {LitElement, html, css} from "lit-element";
import "./research-demo";
import "./search-field";
import "whatwg-fetch";

/**
* @polymer
* @extends HTMLElement
*/
class ResearchPage extends LitElement {
    static get properties() {
        return {
            demos: {type: Array}
        }
    }
    constructor() {
        super();
        this.config = "../config/config.json";
        this.demos = [];
    }
    static get styles() {
        return css`
            .header, .footer {
                background-color: white; 
                text-align: center;
            }
            .header {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-content: center;
                align-items: center;
                font-size: x-large;
                border-top: 5px solid #c00;
            }
            .header img {
                width: 200px;
            }
            .header div {
                flex-grow: 1;
                padding-bottom: 10px;
            }
            .demos {
                display: flex;
                max-width: 100%;
                flex-wrap: wrap;
                justify-content: center;
                align-content: flex-start;
                min-height: calc(100vh - 150px);
                margin-left: 5px;
            }
            .demos research-demo {
                padding-top: 5px;
                padding-bottom: 20px;
            }
            .footer {
                height: 40px;
                line-height: 40px;
            }
        `
    }
    renderDemos() {
        return html`${this.demos.map(demo=>{
            return html`
                <research-demo .demo="${demo}"></research-demo>
            `
        })}`;
    }
    render() {
        return html`
            <div class="header">
                <div><img src="images/geodan.png"></div>
                <div>Research demos</div>
                <div><search-field placeholder="Filter..." @input="${e=>this._onInput(e)}"></search-field></div>
            </div>
            <div class="demos">
                ${this.renderDemos()}
            </div>
            <div class="footer">
                Geodan Research 2019
            </div>
        `
    }
    firstUpdated() {
        this._loadConfig();
    }
    _onInput(e) {
        this._filterDemos(this.shadowRoot.querySelector('search-field').getAttribute('value'));
    }
    _filterDemos(filterString) {
        if (!this.allDemos) {
            this.allDemos = [...this.demos];
        }
        filterString = filterString.trim();
        if (filterString === "") {
            this.demos = [...this.allDemos];
            return;
        }
        const regExp = new RegExp(filterString, 'i');
        this.demos = this.allDemos.filter(demo=>{
            if (demo.title && demo.title.search(regExp) != -1) {
                return true;
            }
            if (demo.description && demo.description.search(regExp) != -1) {
                return true;
            }
            if (demo.date && demo.date.search(regExp) != -1) {
                return true;
            }
            if (demo.tags && demo.tags.length) {
                return demo.tags.filter(tag=>tag.search(regExp) != -1).length;
            }
            return false;
        })
    }
    _loadConfig() {
        fetch(this.config).then(response=>{
            if (!response.ok) {
                return [{"error": `failed to fetch ${this.config}`}];
            } else {
                console.log('parsing...');
                try {
                    const json  = response.json();
                    return json;
                } catch(error) {
                    return [{"error": `failed to parse ${this.config}`}];
                }
            }
        }).then(demos=>{
            return this.demos = demos.filter(demo=>!demo.disabled)
        })
    }
}

customElements.define('research-page', ResearchPage);
