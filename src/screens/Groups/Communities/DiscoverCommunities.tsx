import React, {FC, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import privacyTypes from '~/constants/privacyTypes';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import {useDispatch} from 'react-redux';
import {useBaseHook} from '~/hooks';
import ButtonDiscoverItemAction from '~/screens/Groups/components/ButtonDiscoverItemAction';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import {scaleSize} from '~/theme/dimension';

const screenWidth = Dimensions.get('window').width;

export interface DiscoverCommunitiesProps {
  style?: StyleProp<ViewStyle>;
  onPressCommunities?: (community: any) => void;
  onPressDiscover?: () => void;
}

const DiscoverCommunities: FC<DiscoverCommunitiesProps> = ({
  onPressCommunities,
}: DiscoverCommunitiesProps) => {
  const data = useKeySelector(groupsKeySelector.discoverCommunitiesData);
  const {list, loading} = data || {};

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors} = theme || {};
  const styles = createStyle(theme);

  useEffect(() => {
    getData();
    return () => {
      dispatch(
        groupsActions.setDiscoverCommunities({
          loading: true,
          canLoadMore: true,
          list: [],
        }),
      );
    };
  }, []);

  const getData = (isRefresh = false) => {
    dispatch(groupsActions.getDiscoverCommunities({isRefresh}));
  };

  const onRefresh = () => {
    getData(true);
  };

  const onPressJoin = (data: any) => {
    alert('Request Join ' + data?.name);
  };

  const onPressCancel = (data: any) => {
    alert('Cancel Join ' + data?.name);
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return null;
    }
    return (
      <EmptyScreen
        source={'addUsers'}
        title="communities:empty_communities:title"
        description="communities:empty_communities:description"
      />
    );
  };

  const renderItem = ({item}: any) => {
    const {name, icon, user_count, description, privacy} = item || {};
    const privacyData = privacyTypes.find(i => i?.type === privacy) || {};
    const {icon: privacyIcon, title: privacyTitle}: any = privacyData || {};

    return (
      <PrimaryItem
        showAvatar
        avatar={icon}
        avatarProps={{variant: 'largeAlt'}}
        style={styles.item}
        title={name}
        titleProps={{variant: 'h5'}}
        testID={`community_${item.id}`}
        onPress={() => onPressCommunities?.(item)}
        ContentComponent={
          <View style={styles.groupInfo}>
            <Icon
              style={styles.iconSmall}
              icon={privacyIcon}
              size={16}
              tintColor={colors.textSecondary}
            />
            <Text.Subtitle useI18n>{privacyTitle}</Text.Subtitle>
            <Text.Subtitle> • </Text.Subtitle>
            <Text.BodySM color={colors.textSecondary}>{user_count}</Text.BodySM>
            <Text.Subtitle>{` ${t('groups:text_members', {
              count: user_count,
            })}`}</Text.Subtitle>
          </View>
        }
        RightComponent={
          <ButtonDiscoverItemAction
            data={item}
            joinStatus={item?.join_status}
            onView={onPressCommunities}
            onJoin={onPressJoin}
            onCancel={onPressCancel}
          />
        }
      />
    );
  };

  return (
    <FlatList
      testID="flatlist"
      data={list}
      renderItem={renderItem}
      keyExtractor={(item, index) => `community_${item}_${index}`}
      ListEmptyComponent={renderEmptyComponent}
      ListHeaderComponent={<DiscoverHeader list={list} />}
      onEndReached={() => getData()}
      ItemSeparatorComponent={() => (
        <Divider
          style={{
            marginVertical: theme.spacing?.margin.tiny,
            marginHorizontal: theme.spacing.margin.large,
          }}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={theme.colors.borderDisable}
        />
      }
    />
  );
};

const DiscoverHeader = ({list}: any) => {
  const width = screenWidth;
  const height = scaleSize(144);
  if (list?.length > 0) {
    return (
      <Image
        testID={'discover_communities.header'}
        source={images.img_banner_discover_communities}
        style={{width, height}}
      />
    );
  }
  return null;
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    item: {
      height: '100%',
      flex: 1,
      paddingVertical: spacing.padding.small,
    },
    iconSmall: {
      marginRight: spacing.margin.tiny,
      height: 16,
    },
    groupInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
  });
};

export default DiscoverCommunities;
