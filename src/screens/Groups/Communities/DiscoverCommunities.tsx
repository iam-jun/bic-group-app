import React, {FC, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  RefreshControl,
  FlatList,
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

export interface DiscoverCommunitiesProps {
  style?: StyleProp<ViewStyle>;
  onPressCommunities?: (community: any) => void;
  onPressDiscover?: () => void;
}

const DiscoverCommunities: FC<DiscoverCommunitiesProps> = ({
  onPressCommunities,
}: DiscoverCommunitiesProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const data = useKeySelector(groupsKeySelector.discoverCommunitiesData);
  const {list, loading, canLoadMore} = data || {};

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    dispatch(groupsActions.getDiscoverCommunities({}));
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  const onPressJoin = (data: any) => {
    alert('Request Join ' + data?.name);
  };

  const onPressCancel = (data: any) => {
    alert('Cancel Join ' + data?.name);
  };

  const renderEmptyComponent = () => {
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
        subTitle={description}
        style={styles.item}
        title={name}
        testID={`community_${item.id}`}
        onPress={() => onPressCommunities?.(item)}
        ContentComponent={
          <View style={styles.groupInfo}>
            <Icon
              style={styles.iconSmall}
              icon={privacyIcon}
              size={16}
              tintColor={theme.colors.iconTint}
            />
            <Text.Subtitle useI18n>{privacyTitle}</Text.Subtitle>
            <Text.Subtitle> • </Text.Subtitle>
            <Text.BodySM>{user_count}</Text.BodySM>
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
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.borderDisable}
        />
      }
    />
  );
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
    },
  });
};

export default DiscoverCommunities;
