import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ITheme} from '~/theme/interfaces';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {useKeySelector} from '~/hooks/selector';

import BottomSheet from '~/beinComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import privacyTypes from '~/constants/privacyTypes';
import {useRootNavigation} from '~/hooks/navigation';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import mainStack from '~/router/navigator/MainStack/stack';
import {useBaseHook} from '~/hooks';
import {fontFamilies} from '~/theme/fonts';
import modalActions from '~/store/modal/actions';

const ShowSeenPeopleListBottomSheet = ({postId}) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme, insets);

  const {t} = useBaseHook();
  const screenHeight = Dimensions.get('window').height;
  const contentBarHeight = 0.6 * screenHeight;
  React.useEffect(() => {
    const payload = {postId: postId, offset: 0, canLoadMore: false};
    dispatch(postActions.getSeenPost(payload));
  }, []);
  const loading = useKeySelector(postKeySelector.seenPostList.loading);
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

  const renderEmpty = () => {
    return <LoadingIndicator />;
  };
  const renderFooter = () => {
    return canLoadMore && <LoadingIndicator />;
  };
  const getSeenPost = () => {
    dispatch(
      postActions.getSeenPost({
        postId: postId,
        offset: dataList.length,
      }),
    );
  };
  const onLoadMore = () => {
    getSeenPost();
  };

  const renderItem = (item: any) => {
    return (
      <PrimaryItem
        testID={`reaction_detail_bottomSheet.${item?.item?.fullname}`}
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
      <Text style={styles.header}>
        {t('post:label_seen_by')}
        {total}
      </Text>
      <View style={styles.ruler}></View>
      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmpty}
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
    sectionContainer: {
      paddingBottom: spacing.padding.base + insets.bottom,
    },
    header: {
      paddingTop: spacing.padding.small,
      paddingLeft: 14,
      paddingBottom: 8,
      fontFamily: fontFamilies.OpenSans,
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 14,
      color: colors.primary6,
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
      //marginTop: spacing.padding.small,
      marginLeft: 14,
      marginBottom: spacing.padding.large,
      height: 2,
      width: 73,
      backgroundColor: colors.primary6,
    },
  });
};

export default ShowSeenPeopleListBottomSheet;
