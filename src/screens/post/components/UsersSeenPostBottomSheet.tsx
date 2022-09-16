import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import mainStack from '~/router/navigator/MainStack/stack';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';

const UsersSeenPostBottomSheet = ({ postId }: {postId: string}) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(
    theme, insets,
  );

  React.useEffect(
    () => {
      dispatch(postActions.getSeenPost({ postId }));
      return () => {
        const payloadSet = {
          data: [],
          canLoadMore: true,
        };
        dispatch(postActions.setSeenPost(payloadSet));
      };
    }, [],
  );

  const dataList = useKeySelector(postKeySelector.seenPostList.dataList);
  const canLoadMore = useKeySelector(postKeySelector.seenPostList.canLoadMore);
  const onPressCloseBottomSheet = () => {
    dispatch(modalActions.hideModal());
  };

  const onPressItem = (item: any) => {
    onPressCloseBottomSheet();

    const itemUserId = item?.item?.id;
    if (itemUserId) {
      rootNavigation.navigate(
        mainStack.userProfile, { userId: itemUserId },
      );
    } else {
      rootNavigation.navigate(
        mainStack.userProfile, {
          userId: item?.item.username,
          params: {
            type: 'username',
          },
        },
      );
    }
  };

  const renderFooter = () => canLoadMore && <LoadingIndicator style={{ margin: spacing.margin.small }} />;
  const getSeenPost = () => {
    dispatch(postActions.getSeenPost({ postId }));
  };
  const onLoadMore = () => {
    getSeenPost();
  };

  const renderItem = (item: any) => (
    <PrimaryItem
      testID={`users_seen_post_bottom_sheet.item_username.${item?.item?.username}`}
      showAvatar
      avatarProps={{ isRounded: true, variant: 'small' }}
      style={{ marginVertical: spacing.padding.tiny }}
      onPress={() => onPressItem(item)}
      avatar={item?.item?.avatar}
      title={item?.item?.fullname}
      titleProps={{ variant: 'bodyMMedium' }}
      subTitle={`@${item?.item?.username}`}
      subTitleProps={{ variant: 'bodyS' }}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

const createStyle = (
  theme: ExtendedTheme, insets: any,
) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.small,
      paddingBottom: 0,
      borderTopWidth: 1,
      borderColor: colors.neutral5,
    },
    headerContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.small,
      borderBottomWidth: 1,
      borderColor: colors.neutral5,
    },
    header: {
      paddingTop: spacing.padding.small,
      paddingLeft: 14,
      paddingBottom: 8,
    },
    sectionContainer: {
      paddingBottom: spacing.padding.base + insets.bottom,
    },
    itemGroupContent: {
      flexDirection: 'row',
    },
    iconUser: {
      marginRight: spacing.margin.tiny,
    },
    diamond: {
      marginHorizontal: spacing.margin.tiny,
    },
    icClose: {
      position: 'absolute',
      top: spacing.margin.base,
      right: spacing.margin.base,
    },
    textItem: {
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 16,
    },
    ruler: {
      marginLeft: 14,
      marginBottom: spacing.padding.large,
      height: 2,
      width: 73,
      backgroundColor: colors.purple50,
    },
  });
};

export default UsersSeenPostBottomSheet;
