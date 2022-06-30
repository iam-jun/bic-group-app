import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';

const NoticePanel = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const {t} = useBaseHook();
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
        <Text.BodySM testID="notice_panel.title">{title}</Text.BodySM>
        <Text.Subtitle useI18n style={styles.description}>
          home:notice_post_video_uploading:description
        </Text.Subtitle>
      </View>
      <ButtonWrapper
        testID="notice_panel.button_close"
        style={styles.closeButton}
        activeOpacity={0.9}
        onPress={onPress}>
        <Icon
          size={16}
          tintColor={theme.colors.iconTintLight}
          icon={'iconClose'}
        />
      </ButtonWrapper>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    description: {
      color: colors.textSecondary,
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
      backgroundColor: colors.background,
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      alignItems: 'center',
      marginBottom: spacing.margin.base,
    },
  });
};

export default NoticePanel;
