import React, { FC, useState } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { useTheme, ExtendedTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { IPayloadPutMarkAsRead } from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/storeRedux/post/keySelector';
import { spacing } from '~/theme';
import { Button } from '~/baseComponents';

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

  const markReadSuccess = useKeySelector(postKeySelector.postMarkedReadSuccessById(postId));

  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

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

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      marginTop: spacing.margin.small,
    },
  });
};

export default ButtonMarkAsRead;
