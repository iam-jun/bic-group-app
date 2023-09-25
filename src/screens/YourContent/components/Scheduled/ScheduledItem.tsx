import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import ContentItem from '~/components/ContentItem';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { BoxScheduleTime } from '~/components/ScheduleContent';

type ScheduledItemProps = {
    idContent: string;
};

const ScheduledItem: FC<ScheduledItemProps> = ({ idContent }) => {
  const data = usePostsStore(useCallback(postsSelector.getPost(idContent, {}), [idContent]));

  const {
    scheduledAt,
    status,
    deleted,
  } = data;

  return (
    <View>
      <ContentItem id={idContent} />
      {
        !deleted && (
        <BoxScheduleTime
          scheduledAt={scheduledAt}
          status={status}
          isBorderTop
          isBorderBottomShadow
        />
        )
      }
    </View>
  );
};

export default ScheduledItem;
