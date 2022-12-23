import React from 'react';
import { useDispatch } from 'react-redux';

import { useBaseHook } from '~/hooks';
import postActions from '~/storeRedux/post/actions';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/storeRedux/post/keySelector';
import NoticePanel from '~/components/NoticePanel';

const VideoProcessingNotice = () => {
  const { t } = useBaseHook();
  const dispatch = useDispatch();

  const total = useKeySelector(postKeySelector.allPostContainingVideoInProgress);

  const title = t('home:notice_post_video_uploading:title').replace(
    '(count)',
    total > 1 ? `(${total})` : '',
  );

  const onClose = () => {
    dispatch(postActions.setAllPostContainingVideoInProgress({
      total: 0,
    }));
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
