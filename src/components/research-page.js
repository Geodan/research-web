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
        this.config = "./config/config.json";
        this.demos = [];
    }
    static get styles() {
        return css`
            .header, .footer {
                background-color: white; 
            }
            .footer {
                text-align: center;
            }
            .header {
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
            .header-input search-field {
                
            }
            .header-logo img {
                height: 60px;
                width: auto;
                display: block;
            }
            .demos {
                display: flex;
                width: 100%;
                max-width: 1450px;
                margin-left: auto;
                margin-right: auto;
                flex-wrap: wrap;
                justify-content: space-between;
                align-content: flex-start;
                min-height: calc(100vh - 150px);
                background-color: #f4f4f4;
                padding: 57px;
                box-sizing: border-box;
            }
            .demos {
                display: grid;
                grid-template-columns: repeat(auto-fill, 200px);
                grid-gap: 1rem;                
            }
            .demos research-demo {
                padding-top: 5px;
                padding-bottom: 20px;
            }
            .footer {
                height: 40px;
                line-height: 40px;
            }
            @media all and (max-width: 710px) {
                .header-input {
                    order: 3;
                    width: 100%;
                    text-align: center;
                    margin-bottom: 5px;
                }
            }
            @media all and (max-width: 550px) {
                .header {
                    justify-content: center;
                }
                .demos {
                    display: flex;
                    justify-content: center;
                }
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
                <div class="header-title"><b>Research</b> demos</div>
                <div class="header-input"><search-field placeholder="Search" @input="${e=>this._onInput(e)}"></search-field></div>
                <div class="header-logo"><img src="images/geodan.png"></div>
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
        if (this.timeout !== undefined) {
            window.clearTimeout(this.timeout);
        }
        this.timeout = window.setTimeout(()=> 
            this._filterDemos(this.shadowRoot.querySelector('search-field').getAttribute('value')),
            200);
    }
    _filterDemos(filterString) {
        filterString = filterString.trim();
        window.sessionStorage.setItem('filter', filterString)
        if (filterString === "") {
            this.demos = [...this.allDemos];
            return;
        }
        const regExp = new RegExp(filterString, 'i');
        this.demos = this.allDemos.filter(demo=>{
            if (demo.title && demo.title.search(regExp) !== -1) {
                return true;
            }
            if (demo.description && demo.description.search(regExp) !== -1) {
                return true;
            }
            if (demo.date && demo.date.search(regExp) !== -1) {
                return true;
            }
            if (demo.url && demo.url.search(regExp) !== -1) {
                return true;
            }
            if (demo.thumbnail && demo.thumbnail.search(regExp) !== -1) {
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
                try {
                    const json  = response.json();
                    return json;
                } catch(error) {
                    return [{"error": `failed to parse ${this.config}`}];
                }
            }
        }).then(demos=>{
            this.allDemos = demos.filter(demo=>!demo.disabled);
            let filterString = window.sessionStorage.getItem('filter');
            if (filterString && filterString.trim() !== '') {
                this.shadowRoot.querySelector('search-field').setAttribute('value', filterString);
                this._onInput();
            } else {
                this._filterDemos('');
            }
        })
    }
}

customElements.define('research-page', ResearchPage);
