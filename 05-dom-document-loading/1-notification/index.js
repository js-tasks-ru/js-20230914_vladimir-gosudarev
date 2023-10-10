export default class NotificationMessage {
  static #instance;

  constructor(message = 'Hello World', props = {}) {
    const {duration = 2000, type = 'success'} = props;

    this.message = message;
    this.duration = duration;
    this.type = type;
    this.isTimeoutRunning = null;
    this.element = this.#messageElement();
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

    return messageElement;
  }

  #hideElement() {
    if (this.isTimeoutRunning) {
      clearTimeout(this.isTimeoutRunning);
    }

    this.isTimeoutRunning = setTimeout(() => this.remove(), this.duration);
  }

  #render(component, node = document.body) {
    node.append(component);
    this.#hideElement();
  }

  remove() {
    if (this.isTimeoutRunning) {
      clearTimeout(this.isTimeoutRunning);
    }

    this.element.remove();
  }

  show(node = document.body) {
    if (NotificationMessage.#instance) {
      NotificationMessage.#instance.remove();
    }

    NotificationMessage.#instance = this;
    this.#render(NotificationMessage.#instance.element, node);
  }

  destroy() {
    this.remove();
  }
}


