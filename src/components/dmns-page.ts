export class DmnsPage extends HTMLElement {
  connectedCallback(): void {
    this.dataset.enhanced = 'true';
    this.querySelectorAll('dmns-spread').forEach((spread, i) => spread.dataset.spreadIndex = String(i));
  }
}
declare global { interface HTMLElementTagNameMap { 'dmns-page': DmnsPage } }
