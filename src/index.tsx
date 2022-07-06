/* @refresh reload */
import { render } from "solid-js/web";
import "virtual:fonts.css";
import "windi.css";
import App from "./App";
import "./index.css";

render(() => <App />, document.getElementById("root") as HTMLElement);
