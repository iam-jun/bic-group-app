import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

//config for debugger
const reactotron = Reactotron
  // @ts-ignore
  .setAsyncStorageHandler(AsyncStorage)
  .configure()
  .useReactNative()
  .use(reactotronRedux())
  // @ts-ignore
  .use(sagaPlugin());
if (__DEV__) {
  reactotron.connect();
}

export default reactotron;
