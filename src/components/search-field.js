import {LitElement, html, css} from "lit-element";

class SearchField extends LitElement {
    static get properties() {
        return {
            placeholder: {type: String},
            size: {type: Number},
            value: {type: String, reflect: true}
        }
    }
    constructor() {
        super();
        this.placeholder = "";
        this.size = 30;
        this.value = "";
    }
    render() {
        return html`
        <input @input="${e=>this._onInput(e)}" type="text" placeholder="${this.placeholder}" size="${this.size}" value="${this.value}">
        `
    }
    _onInput(e) {        
        this.value = e.currentTarget.value;
    }
}

customElements.define('search-field', SearchField);