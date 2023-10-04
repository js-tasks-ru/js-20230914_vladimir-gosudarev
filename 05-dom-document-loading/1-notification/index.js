export default class NotificationMessage {
  static #component;
  static #isTimeoutRunning;

  constructor(message = 'Hello World', props = {}) {
    const {duration = 2000, type = 'success'} = props;

    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = this.#messageElement(true);
  }

  #getSecondsFromMs() {
    return `${this.duration / 1000}s`;
  }

  #timerElement() {
    return `<div class="timer"></div>`;
  }

  #innerWrapperTemplate() {
    return `
      <div class="inner-wrapper">
         <div class="notification-header">${this.type}</div>
         <div class="notification-body">
           ${this.message}
         </div>
       </div>`
  }

  #messageTemplate() {
    return `
      ${this.#timerElement()}
      ${this.#innerWrapperTemplate()}
    `
  }

  #messageElement(testStub = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('notification');
    messageElement.classList.add(`${this.type}`);
    messageElement.style.setProperty('--value', this.#getSecondsFromMs());
    messageElement.innerHTML = this.#messageTemplate();

    if (!testStub) {
      NotificationMessage.#component = messageElement;
    }

    return messageElement;
  }

  #hideElement() {
    if (NotificationMessage.#isTimeoutRunning) {
      clearTimeout(NotificationMessage.#isTimeoutRunning);
    }

    NotificationMessage.#isTimeoutRunning = setTimeout(() => this.remove(), this.duration);
  }

  #render(component, node) {
    node ? node.append(component) : document.body.append(component);
    this.#hideElement();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }

    if (NotificationMessage.#component) {
      NotificationMessage.#component.remove();
    }
  }

  show(node = null) {
    if (NotificationMessage.#component) {
      this.remove();
    }

    const component = this.#messageElement();
    this.#render(component, node);
  }

  destroy() {
    this.remove();
  }
}
