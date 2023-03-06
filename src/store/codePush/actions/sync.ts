import CodePush from 'react-native-code-push';
import { ICodePushState } from '~/store/codePush';
import { timeOut } from '~/utils/common';
import getEnv from '~/utils/env';

const sync = (set, get) => async () => {
  const state: ICodePushState = get();
  const retryCount = state?.retryCount;
  const onSyncStatusChanged = async (syncStatus) => {
    let status = '';
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        status = 'Checking for update...';
        break;
      case CodePush.SyncStatus.SYNC_IN_PROGRESS:
        status = `${retryCount > 10 ? 'Network slow, Did the 🐬 bite the internet cable?' : ''} Trying to download... ${'🧎'.repeat(retryCount % 4)}`;
        set((state: ICodePushState) => {
          state.status = status;
          state.retryCount = retryCount + 1;
        }, 'syncSetStatus');
        await timeOut(1000);
        state.actions.sync();
        return;
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
