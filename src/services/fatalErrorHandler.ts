import {Alert} from 'react-native';
import RNRestart from 'react-native-restart';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import Clipboard from '@react-native-clipboard/clipboard';

export const initFatalErrorHandler = () => {
  /**
   * just call this function for import and setup in App.tsx
   * do not remove!
   */
  console.log(`\x1b[32m🐣️ FatalErrorHandler initialized\x1b[0m`);
};

const errorHandler = (e: any, isFatal: boolean) => {
  if (isFatal) {
    Clipboard.setString(e.message);
    Alert.alert(
      '(×﹏×)',
      `Copied error, please send to BIC Devs...
        
Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}`,
      [
        {
          text: 'Restart',
          onPress: () => {
            RNRestart.Restart();
          },
        },
      ],
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler);

setNativeExceptionHandler(errorString => {
  //You can do something like call an api to report to dev team here
  // When you call setNativeExceptionHandler, react-native-exception-handler sets a
  // Native Exception Handler popup which supports restart on error in case of android.
  // In case of iOS, it is not possible to restart the app programmatically, so we just show an error popup and close the app.
  // To customize the popup screen take a look at CUSTOMIZATION section.
});
