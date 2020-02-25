import * as React from "react";
import * as ReactDOM from "react-dom";
import Layer from "../src/Layer";
import LayerContainer from "../src/LayerContainer";
import Modal from "../src/Modal";
import PopperLayer from "../src/PopperLayer";
import Tooltip from "../src/Tooltip";
import { LayerState } from "../src/Types";

// @ts-ignore
import styles from "./styles.module.css";
import { createAPI } from "../src/LayerAPI";

function StatefulLayerComponent({
  count,
  setCount,
  state,
  completeTransitionExit,
  close
}: {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  state: LayerState;
  completeTransitionExit: () => void;
  close: () => void;
}) {
  React.useEffect(() => {
    if (state === LayerState.TransitionExit) {
      setTimeout(() => completeTransitionExit(), 1000);
    }
  }, [state]);
  return (
    <div
      style={{
        transition: "opacity 1s",
        opacity: state === LayerState.TransitionExit ? 0 : 1
      }}
    >
      <button
        onClick={() => {
          setCount(count => count + 1);
        }}
      >
        {count}
      </button>
      <button onClick={() => close()}>Close</button>
    </div>
  );
}

function StatefulLayer({
  layerKey,
  close
}: {
  layerKey: number;
  close: () => void;
}) {
  const [count, setCount] = React.useState(layerKey);
  return (
    <Layer
      render={({ state, completeTransitionExit }) => (
        <StatefulLayerComponent
          count={count}
          setCount={setCount}
          state={state}
          completeTransitionExit={completeTransitionExit}
          close={close}
        />
      )}
      transitionExit
    />
  );
}

function Example() {
  const [layerKeys, setLayerKeys] = React.useState<Array<number>>([]);
  const referenceRef = React.useRef(null);
  const [showPopper, setShowPopper] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div>
      <div>
        <button
          onClick={() => {
            setLayerKeys(layerKeys => [
              ...layerKeys,
              Math.max.apply(null, [...layerKeys, 0]) + 1
            ]);
          }}
        >
          Add Layer
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            setShowPopper(show => !show);
          }}
          ref={referenceRef}
        >
          Popper Reference
        </button>
      </div>
      <Tooltip text="Hi" placement="right">
        {(props: any) => <button {...props}>Tooltip</button>}
      </Tooltip>
      {showPopper ? (
        <PopperLayer
          reference={referenceRef}
          render={() => (
            <div
              style={{
                width: 100,
                height: 100,
                border: "1px solid black",
                backgroundColor: "#ffffff"
              }}
            >
              PopperLayer
            </div>
          )}
          options={{
            placement: "left"
          }}
        />
      ) : null}
      <div>
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          Modal
        </button>
      </div>
      {showModal ? (
        <Modal onCloseRequest={() => setShowModal(false)}>
          <div>Hello</div>
          <button onClick={() => setShowModal(false)}>Close</button>
        </Modal>
      ) : null}
      {layerKeys.map(layerKey => (
        <StatefulLayer
          layerKey={layerKey}
          close={() => {
            setLayerKeys(layerKeys => layerKeys.filter(k => k !== layerKey));
          }}
          key={layerKey}
        />
      ))}
    </div>
  );
}

function TopExample() {
  const [numLayers, setNumLayers] = React.useState(5);
  const layers = [];
  for (let i = 0; i < numLayers; i++) {
    layers.push(
      <Layer
        render={() => (
          <div
            className={styles.topExampleLayer}
            style={{ top: 256 - i * 8 }}
          ></div>
        )}
        key={i}
      />
    );
  }
  return (
    <div className={styles.topExample}>
      <button onClick={() => setNumLayers(layers => layers + 1)}>
        Add Layer
      </button>
      <button onClick={() => setNumLayers(layers => Math.max(layers - 1, 0))}>
        Remove Layer
      </button>
      {layers}
    </div>
  );
}

function App() {
  return (
    <div className={styles.root}>
      <h1>millefeuille</h1>
      <p>
        A React library for creating and managing UI layers (tooltips, modals,
        dropdowns, etc).
      </p>
      <TopExample />
      <h2>Usage</h2>
      <p>
        Render a <code>{"<LayerContainer>"}</code> in your app. This component
        will contain all your layers and is usually rendered at the root of your
        app.
      </p>
      <pre>
        <code>{`import {LayerContainer} from 'millefeuille';

function App() {
  return (
    <>
      ...
      <LayerContainer />
    </>
  );
}`}</code>
      </pre>
      <p>
        The heart of millefeuille is the <code>{"<Layer>"}</code> component.
      </p>
      <pre>
        <code>{`import {Layer} from 'millefeuille';

function MyComponent() {
  ...
  return (
    <div>
      {showLayer ? (
        <Layer render={layerProps => <div>I'm a layer!</div>} />
      ) : null}
    </div>
  );
}`}</code>
      </pre>
      <p>
        Although this Layer looks like it is a child of MyComponent, the actual
        layer DOM nodes are rendered inside your app's LayerContainer.
      </p>
      <p>
        millefeuille uses message passing instead of{" "}
        <code>{"React.createPortal"}</code>. This allows for more control, such
        as allowing UI to be rendered after the <code>{"<Layer>"}</code>{" "}
        unmounts. This is useful for transition out animations.
      </p>
      <h2>Exit Transition</h2>
      <p>
        You may want to do an transition animation as the layer is unmounting.
        Because the layer is rendered by the LayerContainer, we can keep
        rendering the layer DOM even after the Layer component (or its owner!)
        unmounts.
      </p>
      <p>
        Set the Layer prop transitionExit to true. Layer's render function
        contains two relevant props, state and completeTransitionExit. When the
        Layer component is no longer rendered, it will enter the TransitionExit
        state. Perform your animation and call completeTransitionExit when
        finished.
      </p>
      <pre>
        <code>{`import {LayerState} from 'millefeuille';

function LayerContents({state, completeTransitionExit}) {
  React.useEffect(() => {
    if (state === LayerState.TransitionExit) {
      setTimeout(completeTransitionExit, 300);
    }
  }, [state]);
  return (
    <div style={{opacity: state === LayerState.TransitionExit ? 0 : 1}}>
      ...
    </div>
  );
}

<Layer
  render={({state, completeTransitionExit}) =>
    <LayerContents state={state} completeTransitionExit={completeTransitionExit} />
  }
  transitionExit
/>`}</code>
      </pre>
      <p>
        There is no layer API for enter transitions. You can manage this via
        React lifecycles.
      </p>
      <Example />
      <LayerContainer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));