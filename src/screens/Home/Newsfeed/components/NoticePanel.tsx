import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';

import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import spacing from '~/theme/spacing';

const NoticePanel = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const dispatch = useDispatch();

  const total = useKeySelector(
    postKeySelector.allPostContainingVideoInProgress,
  );

  const onPress = () => {
    dispatch(
      postActions.setAllPostContainingVideoInProgress({
        total: 0,
      }),
    );
  };

  if (!total) return null;

  const title = t('home:notice_post_video_uploading:title').replace(
    '(count)',
    total > 1 ? `(${total})` : '',
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text.BodySMedium testID="notice_panel.title">{title}</Text.BodySMedium>
        <Text.BodyS useI18n style={styles.description}>
          home:notice_post_video_uploading:description
        </Text.BodyS>
      </View>
      <ButtonWrapper
        testID="notice_panel.button_close"
        style={styles.closeButton}
        activeOpacity={0.9}
        onPress={onPress}
      >
        <Icon
          size={16}
          tintColor={theme.colors.neutral80}
          icon="iconClose"
        />
      </ButtonWrapper>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    description: {
      color: colors.gray50,
      marginTop: spacing.margin.tiny / 2,
    },
    closeButton: {
      marginLeft: spacing.margin.small,
    },
    content: {
      flex: 1,
    },
    container: {
      width: '100%',
      backgroundColor: colors.white,
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      alignItems: 'center',
      marginBottom: spacing.margin.base,
    },
  });
};

export default NoticePanel;
