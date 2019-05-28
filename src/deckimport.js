import {html, render} from 'lit-html/lib/lit-extended';
import {repeat} from 'lit-html/lib/repeat';
import {get} from './doc';
import parser from '../res/grammar.pegjs';

function textNodesUnder(el){
    let n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
}

class DeckImport {
    constructor(proceed) {
        this.parent = get('app');
        this.proceed = proceed;
        this.deck = null;
        this.messages = [];
    }

    onDropHandler(e) {
        e.stopPropagation();
        e.preventDefault();

        // reset
        this.deck = null;
        this.messages = [];

        let file = e.dataTransfer.files[0];
        let reader = new FileReader();
        reader.onload = (fe) => {
            let vals = fe.target.result.split('\n');
            let name = vals.shift().trim();
            let cards  = vals.map((v, i) => {
                let card = null;
                try {
                    card = parser.parse(v);
                } catch(e) {
                    // i+2 because the title is row 0 and i starts with 0
                    this.messages.push(`row ${i+2}: ${e}`);
                    this.messages.push(`in line: ${v}`);
                }
                return card;
            });
            this.deck = {
                name: name,
                cards: cards
            }
            this.render();
        }
        reader.readAsText(file);
    }
    onDragOverHandler(e) {
        e.preventDefault();
    }
    onButtonPressHandler() {
        let textnode = get('content');
        let a = textNodesUnder(textnode);
        a = a.map(tn => tn.nodeValue.trim()).join('');
        let textarea = get('textarea');
        textarea.value = a;
        textarea.select();
        document.execCommand('copy');
    }

    __style() {
        return html`
            <style>
                header {
                    position        : absolute;
                    top             : 0;
                    display         : flex;
                    align-items     : center;
                    justify-content : center;
                    width           : 100%;
                    height          : 70px;
                    font-size       : 2em;
                    background      : #009688;
                    color           : white;
                }
                content {
                    position        : absolute;
                    top             : 70px;
                    display         : block;
                    width           : 100%;
                    height          : calc(100% - 140px);
                    background      : white;
                    overflow-y      : scroll;
                }
                footer {
                    position        : absolute;
                    bottom          : 0;
                    display         : flex;
                    align-items     : center;
                    justify-content : center;
                    width           : 100%;
                    height          : 70px;
                    font-size       : 2em;
                    background      : #009688;
                    color           : white;
                }
                card {
                    display         : flex;
                    flex-direction  : column;
                    align-items     : center;
                    width           : 100%;
                    padding         : 10px;
                    border-radius   : 15px;
                    background      : white;
                }
                dropfield {
                    display         : flex;
                    flex-direction  : column;
                    align-items     : center;
                    justify-content : center;
                    width           : 100px;
                    height          : 100px;
                    border          : dashed 1px black;
                }
                dropfield:hover {
                    border-color: red;
                }
                button {
                    background: none;
                    border: solid 1px white;
                    padding: 5px;
                    color: white;
                    border-radius: 15px;
                }
                .err {
                    color: red;
                }
            </style>
        `
    }

    __result() {
        // early return
        if(!this.deck) return html`
            <card>
                <dropfield on-drop=${e => this.onDropHandler(e)} on-dragover=${e => this.onDragOverHandler(e)}>
                    drop a deck
                </dropfield>
            </card>
        `;

        // show errors
        if(this.messages.length > 0) {
            return html`
                <table class="err">
                    <tr>
                        <td>
                            ${repeat(
                                this.messages,
                                (_, i) => i,
                                (msg) => html`<div>${msg}</div>`
                            )}
                        </td>
                    </tr>
                </table>
            `;
        }

        return html`
            <table>
                <tr><td>{</td><td colspan="7">"name":${'"'+this.deck.name+'",'}</td></tr>
                <tr>
                    <td></td>
                    <td colspan="7">"cards":[</td>
                </tr>
                ${repeat(
                    this.deck.cards,
                    (_, i) => i,
                    (card, i) => html`
                        <tr>
                            <td></td>
                            <td></td>
                            <td>{</td>
                            <td>"hanzi":</td><td>[${card.hanzi.map((h) => '"'+h+'"').join(',')}],</td>
                            <td>"pinyin":</td><td>[${card.pinyin.map((p) => '"'+p+'"').join(',')}],</td>
                            <td>"tone":</td><td>[${card.tone.map((t) => '"'+t+'"').join(',')}],</td>
                            <td>"trans":</td><td>${'"'+card.trans+'"'}</td>
                            <td>}${(i < this.deck.cards.length-1) ? "," : ""}</td>
                        </tr>
                    `
                )}
                <tr>
                    <td></td>
                    <td>]</td>
                </tr>
                <tr><td>}</td></tr>
            </table>
        `;
    }
    render() {
        render(
            html`
                ${this.__style()}
                <header>Converts a mandarin vocab file into JSON format</header>
                <content>
                    ${this.__result()}
                </content>
                <footer><button on-click=${e => this.onButtonPressHandler()}>copy to clipboard</button></footer>
                <textarea></textarea>
            `,
            this.parent
        );
    }
}

export {DeckImport}