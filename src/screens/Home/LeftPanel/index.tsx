import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

const LeftPanel = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const draftPost = useKeySelector(postKeySelector.draft.posts) || [];

  const onPressNewsfeed = () => {
    rootNavigation.navigate(homeStack.newsfeed);
  };

  const onPressSavedPosts = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressDraftPost = () => {
    rootNavigation.navigate(homeStack.draftPost);
  };

  const renderBadgeNumber = (badgeNumber: number) => {
    if (!badgeNumber) {
      return null;
    }
    const number = badgeNumber > 9 ? '9+' : badgeNumber;
    return (
      <View style={styles.badgeNumberContainer}>
        <Text.Subtitle style={styles.badgeNumber}>{number}</Text.Subtitle>
      </View>
    );
  };

  return (
    <ScreenWrapper testID="VipScreen" disabledDarkMode isFullView>
      <PrimaryItem
        height={48}
        leftIconProps={{
          icon: 'iconTabHomeBein',
          size: 24,
          style: styles.leftIcon,
        }}
        leftIcon={'iconTabHomeBein'}
        title={t('home:newsfeed')}
        onPress={onPressNewsfeed}
      />
      <PrimaryItem
        height={48}
        leftIcon={'iconMenuBookmarkRed'}
        leftIconProps={{
          icon: 'iconMenuBookmarkRed',
          size: 24,
          style: styles.leftIcon,
        }}
        title={t('home:saved_posts')}
        onPress={onPressSavedPosts}
      />
      <PrimaryItem
        height={48}
        leftIcon={'iconMenuDraft'}
        leftIconProps={{
          icon: 'iconMenuDraft',
          size: 24,
          style: styles.leftIcon,
        }}
        title={t('home:draft_post')}
        onPress={onPressDraftPost}
        RightComponent={renderBadgeNumber(draftPost?.length || 0)}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    leftIcon: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.extraLarge,
    },
    badgeNumberContainer: {
      minWidth: 20,
      minHeight: 20,
      backgroundColor: colors.error,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeNumber: {
      color: colors.textReversed,
      marginTop: -2,
    },
  });
};

export default LeftPanel;
