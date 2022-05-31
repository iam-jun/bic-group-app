import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {SceneMap, TabView} from 'react-native-tab-view';

import Filter from '~/beinComponents/Filter';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {notificationMenuData} from '~/constants/notificationMenuData';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';
import {useRootNavigation, useTabPressListener} from '~/hooks/navigation';
import {ITabTypes} from '~/interfaces/IRouter';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {ITheme} from '~/theme/interfaces';
import NotificationBottomSheet from './components/NotificationBottomSheet';
import NotificationOptionBottomSheet from './components/NotificationOptionBottomSheet';
import notificationsActions from './redux/actions';
import NotificationList from './NotificationList';

const screenWidth = Dimensions.get('window').width;

const Notification = () => {
  const listRef = useRef<any>();
  const menuSheetRef = useRef<any>();
  const notificationOptionRef = useRef<any>();
  const scrollViewRef = useRef<any>();
  const tabDimensions: any = {};

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const isFocused = useIsFocused();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedNotification, setSelectedNotification] = useState({});

  const [navigationState, setNavigationState] = useState({
    index: 0,
    routes: [...notificationMenuData],
  });

  useEffect(() => {
    if (isFocused) {
      dispatch(notificationsActions.markAsSeenAll());
    }
  }, [isFocused]);

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'notification') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
      }
    },
    [listRef],
  );

  useEffect(() => {
    const flag = notificationMenuData[navigationState.index]?.type || 'ALL';
    //@ts-ignore
    dispatch(notificationsActions.getNotifications({flag: flag}));
    listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
  }, [selectedIndex]);

  const onPressFilterItem = (item: any, index: number) => {
    // setSelectedIndex(index);
    // if (!!item?.type) {
    //   dispatch(
    //     notificationsActions.getNotifications({
    //       flag: item.type,
    //     }),
    //   );
    // }
  };

  const onPressItemOption = ({item, e}: {item: any; e: any}) => {
    setSelectedNotification(item);
    notificationOptionRef.current?.open?.(e?.pageX, e?.pageY);
  };

  const onPressMenu = (e: any) => {
    menuSheetRef.current?.open?.(e?.pageX, e?.pageY);
  };

  const onItemPress = (item?: any) => {
    const type = item?.extra?.type || undefined;
    const act = item?.activities?.[0];
    try {
      if (type !== undefined) {
        switch (type) {
          case NOTIFICATION_TYPE.POST.CREATED_IN_ONE_GROUP:
          case NOTIFICATION_TYPE.POST.CREATED_IN_MULTIPLE_GROUPS:
          case NOTIFICATION_TYPE.POST.IMPORTANT.CREATED_IN_ONE_GROUP:
          case NOTIFICATION_TYPE.POST.IMPORTANT.CREATED_IN_MULTIPLE_GROUPS:
          case NOTIFICATION_TYPE.POST.MENTION_IN_ONE_GROUP:
          case NOTIFICATION_TYPE.POST.MENTION_IN_MULTIPLE_GROUPS:
          case NOTIFICATION_TYPE.POST.VIDEO.PROCESSING:
          case NOTIFICATION_TYPE.POST.VIDEO.PUBLISHED:
          case NOTIFICATION_TYPE.REACT.POST_CREATOR:
          case NOTIFICATION_TYPE.REACT.POST_CREATOR_AGGREGATED: {
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: act?.id,
              noti_id: item.id,
            });
            break;
          }
          case NOTIFICATION_TYPE.POST.VIDEO.FAILED: {
            rootNavigation.navigate(homeStack.draftPost);
            break;
          }
          case NOTIFICATION_TYPE.COMMENT.POST_CREATOR:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_POST:
          case NOTIFICATION_TYPE.COMMENT.USER_COMMENTED_ON_POST: {
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: act?.id,
              noti_id: item.id,
              focus_comment: true,
            });
            break;
          }

          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_PREV_COMMENT:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_COMMENT:
          case NOTIFICATION_TYPE.REACT.COMMENT_CREATOR:
          case NOTIFICATION_TYPE.REACT.COMMENT_CREATOR_AGGREGATED: {
            rootNavigation.navigate(homeStack.commentDetail, {
              postId: act?.id,
              commentId: act?.comment?.id,
            });
            break;
          }
          case NOTIFICATION_TYPE.COMMENT.CREATOR_OF_THE_PARENT_COMMENT:
          case NOTIFICATION_TYPE.COMMENT
            .CREATOR_OF_THE_PARENT_COMMENT_AGGREGATED:
          case NOTIFICATION_TYPE.COMMENT
            .USER_REPLIED_TO_THE_SAME_PARENT_COMMENT:
          case NOTIFICATION_TYPE.COMMENT
            .USER_REPLIED_TO_THE_SAME_PARENT_COMMENT_AGGREGATED:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_REPLIED_COMMENT:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_PREV_REPLIED_COMMENT:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_PARENT_COMMENT:
          case NOTIFICATION_TYPE.COMMENT
            .USER_MENTIONED_IN_PARENT_COMMENT_AGGREGATED: {
            rootNavigation.navigate(homeStack.commentDetail, {
              postId: act?.id,
              commentId: act?.comment?.child?.id,
              parentId: act?.comment?.id,
            });
            break;
          }
          default:
            console.log(`Notification type ${type} have not implemented yet`);
            break;
        }
      } else {
        // default, render it as "create post" notification
        rootNavigation.navigate(homeStack.postDetail, {
          post_id: act?.id,
          noti_id: item.id,
        });
      }
    } catch (error) {
      console.log(
        '\x1b[33m',
        'Navigation for this activity has error',
        type,
        '\x1b[0m',
      );
    }

    // finally mark the notification as read
    dispatch(
      notificationsActions.markAsRead({
        id: item.id,
        flag: notificationMenuData[selectedIndex]?.type || 'ALL',
      }),
    );
  };

  const onChangeTab = (i: number) => {
    setNavigationState(previousState => {
      return {...previousState, index: i};
    });
    if (tabDimensions && tabDimensions[i.toString()] && scrollViewRef.current) {
      const {width, x} = tabDimensions[i.toString()];
      scrollViewRef.current?.scrollTo?.({
        x: x - (screenWidth - width) / 2,
        y: 0,
        animated: true,
      });
    }
  };

  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const renderListHeader = ({navigationState}: any) => {
    return (
      <Filter
        ref={scrollViewRef}
        testID={'notification.filter'}
        itemTestID={'notification.filter.item'}
        style={styles.filterStyle}
        data={navigationState?.routes}
        selectedIndex={navigationState.index}
        onPress={(item: any, index: number) => {
          onChangeTab(index);
        }}
        onLayout={(index, x, width) => {
          tabDimensions[index.toString()] = {x, width};
        }}
      />
    );
  };

  const renderScreen = SceneMap({
    ALL: () => (
      <NotificationList
        onItemPress={onItemPress}
        type="ALL"
        onPressItemOption={onPressItemOption}
      />
    ),
    UNREAD: () => (
      <NotificationList
        onItemPress={onItemPress}
        type="UNREAD"
        onPressItemOption={onPressItemOption}
      />
    ),
    MENTION: () => (
      <NotificationList
        onItemPress={onItemPress}
        type="MENTION"
        onPressItemOption={onPressItemOption}
      />
    ),
    IMPORTANT: () => (
      <NotificationList
        onItemPress={onItemPress}
        type="IMPORTANT"
        onPressItemOption={onPressItemOption}
      />
    ),
  });

  return (
    <ScreenWrapper testID="NotfiticationScreen" isFullView>
      <Header
        title="tabs:notification"
        titleTextProps={{useI18n: true}}
        removeBorderAndShadow={false}
        hideBack
        onPressMenu={onPressMenu}
      />
      <TabView
        navigationState={navigationState}
        renderTabBar={renderListHeader}
        onIndexChange={(index: number) => {
          onChangeTab(index);
        }}
        renderScene={renderScreen}
      />
      <NotificationBottomSheet
        modalizeRef={menuSheetRef}
        flag={notificationMenuData[selectedIndex]?.type || 'ALL'}
      />
      <NotificationOptionBottomSheet
        modalizeRef={notificationOptionRef}
        data={selectedNotification}
        flag={notificationMenuData[selectedIndex]?.type || 'ALL'}
      />
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    filterStyle: {
      paddingVertical: spacing.padding.small,
      borderBottomWidth: 0,
    },
  });
};

export default Notification;
