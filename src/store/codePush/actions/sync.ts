import CodePush from 'react-native-code-push';
import { ICodePushState } from '~/store/codePush';
import getEnv from '~/utils/env';

const sync = (set, _get) => async () => {
  const onSyncStatusChanged = (syncStatus) => {
    let status = '';
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        status = 'Checking for update...';
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        status = 'Downloading package...';
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        status = 'Awaiting user action...';
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        status = 'Installing update...';
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        status = `No more update for ${getEnv('APP_VERSION')} 🌻`;
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        status = 'Update cancelled by user 😵';
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        status = 'Update installed and will be applied on restart ♻️';
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        status = 'An unknown error occurred 💔';
        break;
    }
    set((state: ICodePushState) => {
      state.status = status;
    }, 'syncSetStatus');
  };

  const onDownloadProgress = (progress) => {
    set((state: ICodePushState) => {
      state.progress = progress;
    });
  };

  await CodePush.sync(
    { installMode: CodePush.InstallMode.IMMEDIATE },
    onSyncStatusChanged,
    onDownloadProgress,
  );
};

export default sync;
