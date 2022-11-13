import React, { FC, useState } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { Button } from '~/baseComponents';
import { useBaseHook } from '~/hooks';
import { IPayloadPutMarkAsRead } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import postActions from '~/storeRedux/post/actions';
import { spacing } from '~/theme';

export interface ButtonMarkAsReadProps {
  style?: StyleProp<ViewStyle>;
  postId: string;
  isImportant?: boolean;
  expireTime?: string | null;
  markedReadPost: boolean;
  isActor?: boolean;
}

const ButtonMarkAsRead: FC<ButtonMarkAsReadProps> = ({
  style,
  postId,
  isImportant,
  expireTime = '',
  markedReadPost,
  isActor,
}: ButtonMarkAsReadProps) => {
  const [loading, setLoading] = useState(false);

  const markReadSuccess = usePostsStore(postsSelector.getMarkedReadSuccess(postId));

  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const styles = createStyle();

  const now = new Date();
  const expired = now.getTime() >= new Date(expireTime || '').getTime();

  if (
    !isImportant
    || isActor
    || (markedReadPost && !markReadSuccess)
    || !expireTime
    || expired
  ) {
    return null;
  }

  const onPressMarkAsRead = () => {
    if (!loading && !markedReadPost) {
      setLoading(true);
      const payload: IPayloadPutMarkAsRead = {
        postId,
        callback: () => {
          setLoading(false);
        },
      };
      dispatch(postActions.putMarkAsRead(payload));
    }
  };

  return (
    <View
      testID="button_mark_as_read.container"
      style={[styles.container, style]}
    >
      {markedReadPost ? (
        <Button.Neutral
          testID="button_mark_as_read.button"
          type="ghost"
          size="large"
          disabled
          icon="CircleCheckSolid"
        >
          {t('post:marked_as_read')}
        </Button.Neutral>
      ) : (
        <Button.Primary
          testID="button_mark_as_read.button"
          loading={loading}
          type="ghost"
          size="large"
          onPress={onPressMarkAsRead}
        >
          {t('post:mark_as_read')}
        </Button.Primary>
      )}
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    marginTop: spacing.margin.small,
  },
});

export default ButtonMarkAsRead;
