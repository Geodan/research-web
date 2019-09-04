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
    static get styles() {
        return css`
            input {
                padding: 6px;
                border: 1px solid #e3e2e3;
                border-radius: 5px;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><path d="M13.1 12.4L20.5 19.8C20.7 20 20.7 20.3 20.5 20.5 20.3 20.7 20 20.7 19.8 20.5L12.4 13.1C11.1 14.2 9.5 14.8 7.7 14.8 3.7 14.8 0.5 11.6 0.5 7.7 0.5 3.7 3.7 0.5 7.7 0.5 11.6 0.5 14.8 3.7 14.8 7.7 14.8 9.5 14.2 11.1 13.1 12.4ZM12 12C13.2 10.9 13.8 9.4 13.8 7.7 13.8 4.3 11.1 1.5 7.7 1.5 4.3 1.5 1.5 4.3 1.5 7.7 1.5 11.1 4.3 13.8 7.7 13.8 9.4 13.8 10.9 13.2 12 12 12 12 12 12 12 12 12 12 12 12 12 12Z" fill="%23424242"/></svg>');
                background-repeat: no-repeat;
                background-position: calc(100% - 10px) 3px;
            }
            ::-webkit-input-placeholder {
                font-style: italic;
             }
             :-moz-placeholder {
                font-style: italic;  
             }
             ::-moz-placeholder {
                font-style: italic;  
             }
             :-ms-input-placeholder {  
                font-style: italic; 
             }
        `
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