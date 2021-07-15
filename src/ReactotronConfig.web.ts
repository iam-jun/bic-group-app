import Reactotron from 'reactotron-react-js';
import {reactotronRedux} from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

//config for debugger
const reactotron = Reactotron.configure()
  .use(reactotronRedux())
  // @ts-ignore
  .use(sagaPlugin())
  .connect();

export default reactotron;
