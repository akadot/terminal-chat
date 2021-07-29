import Events from "events";
import TerminalController from "./src/TerminalController.js";

const component = new Events();
const controller = new TerminalController();

await controller.initializeTable(component);
