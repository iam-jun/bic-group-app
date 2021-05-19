import React from "react";

/*Store state Redux Saga */
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import storeInit from "./src/store";
import Root from "~/Root";

export default () => {
  const { store, persistor } = storeInit();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root />
      </PersistGate>
    </Provider>
  );
};
