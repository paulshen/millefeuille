import * as React from "react";
import LayerAPI from "./LayerAPI";
import { APIMessage, APIMessageType, Layer } from "./Types";

function layerReducer(state: Layer[], message: APIMessage) {
  switch (message.type) {
    case APIMessageType.PushLayer:
      return [...state, message.layer];
    case APIMessageType.UpdateLayer:
      if (
        state.findIndex(
          layer =>
            layer.key === message.layer.key &&
            layer.render !== message.layer.render
        ) !== -1
      ) {
        return state.map(layer =>
          layer.key === message.layer.key ? message.layer : layer
        );
      } else {
        return state;
      }
    case APIMessageType.RemoveLayer:
      return state.filter(layer => layer.key !== message.key);
  }
  return state;
}

export default function LayerContainer() {
  const [layers, dispatch] = React.useReducer(layerReducer, []);
  React.useEffect(() => {
    return LayerAPI.addListener(dispatch);
  }, []);
  return (
    <>
      {layers.map(layer => (
        <React.Fragment key={layer.key}>{layer.render()}</React.Fragment>
      ))}
    </>
  );
}
