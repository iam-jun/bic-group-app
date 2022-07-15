import React, {FC, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme, ExtendedTheme} from '@react-navigation/native';

import Button from '~/beinComponents/Button';
import {IPayloadPutMarkAsRead} from '~/interfaces/IPost';
import {useDispatch} from 'react-redux';
import postActions from '~/screens/Post/redux/actions';
import icons from '~/resources/icons';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import spacing from '~/theme/spacing';

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

  const markReadSuccess = useKeySelector(
    postKeySelector.postMarkedReadSuccessById(postId),
  );

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const styles = createStyle(theme);

  const now = new Date();
  const expired = now.getTime() >= new Date(expireTime || '').getTime();

  if (
    !isImportant ||
    isActor ||
    (markedReadPost && !markReadSuccess) ||
    !expireTime ||
    expired
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
      testID={'button_mark_as_read.container'}
      style={[styles.container, style]}>
      <Button.Secondary
        testID={'button_mark_as_read.button'}
        loading={loading}
        color={colors.neutral1}
        textColor={colors.neutral80}
        disabled={markedReadPost}
        colorDisabled={colors.white}
        textColorDisabled={colors.gray50}
        leftIcon={markedReadPost && icons.Check}
        onPress={onPressMarkAsRead}>
        {markedReadPost ? t('post:marked_as_read') : t('post:mark_as_read')}
      </Button.Secondary>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderTopWidth: 1,
      borderColor: colors.neutral5,
    },
  });
};

export default ButtonMarkAsRead;
