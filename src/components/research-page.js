import {LitElement, html, css} from "lit-element";
import "./research-demo";
import "./search-field";

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
                background-color: #526E9C; 
                text-align: center;
                color: white;
            }
            .header {
                height: 90px;
                line-height: 90px;
            }
            .header img {
                position: absolute;
                left: 0;
                top: 0;
                width: 256px;
            }
            .header search-field {
                position: absolute;
                right: 20px;
            }
            .demos {
                display: flex;
                max-width: 100%;
                flex-wrap: wrap;
                justify-content: center;
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
                <img src="images/geodan.png">
                Geodan Research demos
                <search-field placeholder="Zoek..." @input="${e=>this._onInput(e)}"></search-field>
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
            return this.demos = demos
        })
    }
}

customElements.define('research-page', ResearchPage);
