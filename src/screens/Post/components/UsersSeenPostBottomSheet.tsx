import React, {useRef} from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ITheme} from '~/theme/interfaces';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import {useRootNavigation} from '~/hooks/navigation';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import mainStack from '~/router/navigator/MainStack/stack';
import {useBaseHook} from '~/hooks';
import modalActions from '~/store/modal/actions';

const UsersSeenPostBottomSheet = ({postId}: {postId: string}) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme, insets);
  const {colors, spacing} = theme;
  const {t} = useBaseHook();

  React.useEffect(() => {
    dispatch(postActions.getSeenPost({postId: postId}));
    return () => {
      const payloadSet = {
        data: [],
        canLoadMore: true,
      };
      dispatch(postActions.setSeenPost(payloadSet));
    };
  }, []);

  const dataList = useKeySelector(postKeySelector.seenPostList.dataList);
  const canLoadMore = useKeySelector(postKeySelector.seenPostList.canLoadMore);
  const total = useKeySelector(postKeySelector.seenPostList.total);
  const onPressCloseBottomSheet = () => {
    dispatch(modalActions.hideModal());
  };

  const onPressItem = (item: any) => {
    onPressCloseBottomSheet();

    const itemUserId = item?.item?.id;
    if (itemUserId) {
      rootNavigation.navigate(mainStack.userProfile, {userId: itemUserId});
    } else {
      rootNavigation.navigate(mainStack.userProfile, {
        userId: item?.item.username,
        params: {
          type: 'username',
        },
      });
    }
  };

  const renderFooter = () => {
    return canLoadMore && <LoadingIndicator />;
  };
  const getSeenPost = () => {
    dispatch(postActions.getSeenPost({postId: postId}));
  };
  const onLoadMore = () => {
    getSeenPost();
  };

  const renderItem = (item: any) => {
    return (
      <PrimaryItem
        testID={`users_seen_post_bottom_sheet.item_username.${item?.item?.username}`}
        showAvatar
        height={44}
        onPress={() => onPressItem(item)}
        avatar={item?.item?.avatar}
        title={item?.item?.fullname}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text.H6 style={styles.header} color={colors.primary6} numberOfLines={1}>
        {t('post:label_seen_by')}
        {total}
      </Text.H6>
      <View style={styles.ruler}></View>
      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

const createStyle = (theme: ITheme, insets: any) => {
  const {spacing, dimension, colors} = theme;
  return StyleSheet.create({
    container: {
      height: dimension?.deviceHeight * 0.6,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    headerContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.small,
      borderBottomWidth: 1,
      borderColor: colors.borderDivider,
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
      backgroundColor: colors.primary6,
    },
  });
};

export default UsersSeenPostBottomSheet;
