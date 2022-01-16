import ReactDOM from "react-dom";
import { App } from "./app";

ReactDOM.render(<App />, document.querySelector("#root"));

// function f(x: number) {
//   return 4;
// }

// let s = "";
// for (let x = 0; x <= 10; x++) {
//   const y = f(x);
//   const distance = Math.sqrt(x * x + y * y);
//   s += ` (${x}, ${distance.toPrecision(3)})`;
// }
// console.log("plot" + s);

// import { Vec2d } from "./vec2d";
// const sqrt2 = Math.sqrt(2);
// for (const v of [
//   new Vec2d(1, 0),
//   new Vec2d(sqrt2, sqrt2),
//   new Vec2d(0, 1),
//   new Vec2d(-sqrt2, sqrt2),
//   new Vec2d(-1, 0),
//   new Vec2d(-sqrt2, -sqrt2),
//   new Vec2d(0, -1),
//   new Vec2d(sqrt2, -sqrt2),
// ]) {
//   console.log(`${v} ${v.rotation}`);
// }
