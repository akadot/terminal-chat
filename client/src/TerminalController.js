import ComponentsBuilder from "./Components.js";

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

  #registerEvents(eventEmitter, component) {
    eventEmitter.on("message:received", this.#onMessageRecieve(component));
    eventEmitter.on("activityLog:updated", this.#onLogChanged(component));
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

    setInterval(() => {
      eventEmitter.emit("activityLog:updated", "ghost left");
      eventEmitter.emit("activityLog:updated", "dot left");
      eventEmitter.emit("activityLog:updated", "creuza left");
      eventEmitter.emit("activityLog:updated", "célia left");
    }, 2000);
  }
}
