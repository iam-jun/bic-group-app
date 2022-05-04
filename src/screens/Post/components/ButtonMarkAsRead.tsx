import React, {FC, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Button from '~/beinComponents/Button';
import {IPayloadPutMarkAsRead} from '~/interfaces/IPost';
import {useDispatch} from 'react-redux';
import postActions from '~/screens/Post/redux/actions';
import icons from '~/resources/icons';
import {useBaseHook} from '~/hooks';

export interface ButtonMarkAsReadProps {
  style?: StyleProp<ViewStyle>;
  postId: number;
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
  const [markedSuccess, setMarkedSuccess] = useState(false);

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const now = new Date();
  const expired = now.getTime() >= new Date(expireTime || '').getTime();

  if (
    !isImportant ||
    isActor ||
    (markedReadPost && !markedSuccess) ||
    !expireTime ||
    expired
  ) {
    return null;
  }

  const onPressMarkAsRead = () => {
    if (!loading) {
      setLoading(true);
      const payload: IPayloadPutMarkAsRead = {
        postId,
        callback: isSuccess => {
          setLoading(false);
          setMarkedSuccess(isSuccess);
        },
      };
      dispatch(postActions.putMarkAsRead(payload));
    }
  };

  return (
    <View
      testID={'button_mark_as_read.container'}
      style={[styles.container, style]}>
      <Button.Secondary
        testID={'button_mark_as_read.button'}
        loading={loading}
        color={colors.bgSecondary}
        textColor={colors.textPrimary}
        disabled={markedReadPost}
        colorDisabled={colors.background}
        textColorDisabled={colors.textSecondary}
        leftIcon={markedReadPost && icons.Check}
        onPress={onPressMarkAsRead}>
        {markedReadPost ? t('post:marked_as_read') : t('post:mark_as_read')}
      </Button.Secondary>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
    },
  });
};

export default ButtonMarkAsRead;
