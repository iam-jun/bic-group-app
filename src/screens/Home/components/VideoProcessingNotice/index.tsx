import React from 'react';

import { useBaseHook } from '~/hooks';
import NoticePanel from '~/components/NoticePanel';
import usePostsInProgressStore from './store';

const VideoProcessingNotice = () => {
  const { t } = useBaseHook();
  const total = usePostsInProgressStore((state) => state.total);
  const actions = usePostsInProgressStore((state) => state.actions);

  const title = t('home:notice_post_video_uploading:title').replace(
    '(count)',
    total > 1 ? `(${total})` : '',
  );

  const onClose = () => {
    actions.setTotal(0);
  };

  if (!total) return null;

  return (
    <NoticePanel
      title={title}
      description="home:notice_post_video_uploading:description"
      onClose={onClose}
    />
  );
};

export default VideoProcessingNotice;
