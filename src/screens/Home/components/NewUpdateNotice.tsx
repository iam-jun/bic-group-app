import React, { useEffect, useState } from 'react';
import { compare } from 'compare-versions';

import getEnv from '~/utils/env';
import NoticePanel from '~/components/NoticePanel';
import useRemoteConfigStore from '~/store/remoteConfig';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/storeRedux/post/keySelector';
import { openUrl } from '~/utils/link';

const NewUpdateNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  const appStoreUrl = useRemoteConfigStore((state) => state.appStoreUrl);
  const newAppVersion = useRemoteConfigStore((state) => state.appVersion);
  const shouldShowNotice = compare(getEnv('APP_VERSION'), newAppVersion, '<');

  const total = useKeySelector(postKeySelector.allPostContainingVideoInProgress);

  useEffect(() => {
    /**
     * should show only 1 notice panel at one time
     * high priority for video processing
     */
    if (shouldShowNotice && !total) {
      setIsVisible(true);
    }
  }, [shouldShowNotice, total]);

  const onClose = () => {
    setIsVisible(false);
  };

  const onPressUpdate = () => {
    openUrl(appStoreUrl);
  };

  if (!isVisible) return null;

  return (
    <NoticePanel
      title="notice:new_version:title"
      description="notice:new_version:description"
      buttonText="notice:new_version:confirm"
      onButtonPress={onPressUpdate}
      onClose={onClose}
    />
  );
};

export default NewUpdateNotice;
