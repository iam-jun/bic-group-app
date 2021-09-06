import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';

const LeftPanel = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const onPressNewsfeed = () => {
    rootNavigation.navigate(homeStack.newsfeed);
  };

  const onPressSavedPosts = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  return (
    <ScreenWrapper testID="VipScreen" disabledDarkMode isFullView>
      <PrimaryItem
        height={48}
        style={styles.activeItem}
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
    activeItem: {
      backgroundColor: colors.placeholder,
    },
  });
};

export default LeftPanel;
