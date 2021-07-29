import ComponentsBuilder from "./Components.js";

export default class TerminalController {
  constructor() {}

  #onInputReceived(eventEmitter) {
    return function () {
      const msg = this.getValue();
      console.log(msg);
      this.clearValue();
    };
  }

  async initializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: "Hacker Chat" })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .build();

    components.input.focus();
    components.screen.render();
  }
}
