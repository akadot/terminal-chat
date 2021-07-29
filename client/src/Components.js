import blessed from "blessed";

export default class ComponentsBuilder {
  #screen;
  #layout;
  #input;
  #chat;
  constructor() {}

  //Componente base de todos os outros (o '#' torna ele privado)
  #baseComponent() {
    return {
      border: "line",
      mouse: true,
      keys: true,
      top: 0,
      scrollbar: {
        ch: " ",
        inverse: true,
      },
      //habilita cores e tags
      tags: true,
    };
  }

  //Cria o componente que atuará como tela, no caso o terminal
  setScreen(title) {
    this.#screen = blessed.screen({
      smartCSR: true,
      title,
    });

    this.#screen.key(["escape", "C-c"], () => process.exit(0));

    return this;
  }

  //Cria o container que agrupa os demais componentes do chat
  setLayoutComponent() {
    this.#layout = blessed.layout({
      parent: this.#screen, //define o pai/tela
      width: "100%",
      height: "100%",
    });

    return this;
  }

  //Cria o campo de texto
  setInputComponent(onEnterPressed) {
    const inputComp = blessed.textarea({
      parent: this.#screen,
      bottom: 0,
      height: "10%",
      inputOnFocus: true,
      padding: {
        top: 1,
        left: 2,
      },
      style: {
        fg: "#f6f6f6",
        bg: "#353535",
      },
    });

    inputComp.key("enter", onEnterPressed);
    this.#input = inputComp;

    return this;
  }

  setChatComponent() {
    this.#chat = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      align: "left",
      width: "50%",
      height: "90%",
      items: ["{bold}Messenger{/}"],
    });

    return this;
  }

  build() {
    const components = {
      screen: this.#screen,
      input: this.#input,
    };

    return components;
  }
}
