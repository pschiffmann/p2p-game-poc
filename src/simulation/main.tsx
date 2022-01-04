import { PlayerCommand } from "../shared/protocol";
import { actions } from "./actions";
import { sendStateToWindow, state } from "./state";

(self as unknown as Worker).addEventListener(
  "message",
  ({ data }: MessageEvent<PlayerCommand>) => {
    if (state.phase !== "running") return;
    actions[data.action](data);
  }
);

sendStateToWindow();
