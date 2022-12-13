import CodePush from 'react-native-code-push';
import { ICodePushState } from '~/store/codePush';

const getUpdateMetaData = (set, _get) => () => {
  CodePush.getUpdateMetadata()
    .then((result) => {
      set((state: ICodePushState) => {
        state.currentUpdate = result;
      }, 'getUpdateMetaData');
    })
    .catch((error) => {
      console.error('\x1b[35m🐣️ index error: ', error, '\x1b[0m');
    });
};

export default getUpdateMetaData;
