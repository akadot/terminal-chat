import ComponentsBuilder from "./Components.js";
import { constants } from "./constants.js";

export default class TerminalController {
  #userColor = new Map();
  constructor() {}

  #pickColor() {
    return `#${(((1 << 24) * Math.random()) | 0).toString(16)}-fg`;
  }

  #getUserColor(userName) {
    if (this.#userColor.has(userName)) {
      return this.#userColor.get(userName);
    }

    const color = this.#pickColor();
    this.#userColor.set(userName, color);

    return color;
  }

  #onInputReceived(eventEmitter) {
    return function () {
      const msg = this.getValue();
      console.log(msg);
      this.clearValue();
    };
  }

  #onMessageRecieve({ screen, chat }) {
    return (msg) => {
      const { userName, message } = msg;
      const color = this.#getUserColor(userName);

      chat.addItem(`{${color}}{bold}${userName}{/}: ${message}`);
      screen.render();
    };
  }

  #onLogChanged({ screen, activityLog }) {
    return (msg) => {
      const [userName] = msg.split(/\s/);
      const color = this.#getUserColor(userName);
      activityLog.addItem(`{${color}}{bold}${msg.toString()}{/}{/}`);
      screen.render();
    };
  }

  #onStatusChanged({ screen, status }) {
    return (users) => {
      const { content } = status.items.shift();
      status.clearItems();
      status.addItem(content);

      users.forEach((userName) => {
        const color = this.#getUserColor(userName);
        status.addItem(`{${color}}{bold}${userName}{/}{/}`);
      });
      screen.render();
    };
  }

  #registerEvents(eventEmitter, component) {
    eventEmitter.on(
      constants.events.app.MSG_RECEIVED,
      this.#onMessageRecieve(component)
    );
    eventEmitter.on(
      constants.events.app.ACTIVITYLOG_UPDATED,
      this.#onLogChanged(component)
    );
    eventEmitter.on(
      constants.events.app.STATUS_UPDATED,
      this.#onStatusChanged(component)
    );
  }

  async initializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: "Hacker Chat" })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .setActivityLogComponent()
      .setStatusComponent()
      .build();

    this.#registerEvents(eventEmitter, components);

    components.input.focus();
    components.screen.render();
  }
}
