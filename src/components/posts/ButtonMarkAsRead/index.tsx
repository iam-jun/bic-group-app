import React, { FC, useState } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Button } from '~/baseComponents';
import { isPostExpired } from '~/helpers/post';
import { useBaseHook } from '~/hooks';
import { IPayloadPutMarkAsRead } from '~/interfaces/IPost';
import { spacing } from '~/theme';
import useButtonMarkAsReadStore, { IButtonMarkAsReadState } from './store';

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

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { putMarkAsRead } = useButtonMarkAsReadStore((state: IButtonMarkAsReadState) => state.actions);

  const isExpired = !!expireTime ? isPostExpired(expireTime) : !isImportant;

  if (
    !isImportant
    || isActor
    || markedReadPost
    || isExpired
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
      putMarkAsRead(payload);
    }
  };

  return (
    <View
      style={[styles.container, style]}
      testID="button_mark_as_read.container"
    >
      <View style={styles.boxBtn}>
        <Button.Primary
          testID="button_mark_as_read.button"
          loading={loading}
          type="ghost"
          size="small"
          onPress={onPressMarkAsRead}
        >
          {t('post:mark_as_read')}
        </Button.Primary>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
    },
    boxBtn: {
      borderTopWidth: 1,
      borderTopColor: colors.neutral5,
      paddingVertical: spacing.padding.base,
    },
  });
};

export default ButtonMarkAsRead;
