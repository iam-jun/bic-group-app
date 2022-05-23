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
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';

export interface JoinedCommunitiesProps {
  style?: StyleProp<ViewStyle>;
  onPressCommunities?: (community: any) => void;
  onPressDiscover?: () => void;
}

const JoinedCommunities: FC<JoinedCommunitiesProps> = ({
  onPressCommunities,
  onPressDiscover,
}: JoinedCommunitiesProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const myCommunities = useKeySelector(groupsKeySelector.joinedCommunities);

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    dispatch(
      groupsActions.getMyCommunities({
        callback: () => {
          setRefreshing(false);
        },
      }),
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  const renderEmptyComponent = () => {
    return (
      <EmptyScreen
        source={'addUsers'}
        title="communities:empty_communities:title"
        description="communities:empty_communities:description"
        ButtonComponent={
          <ButtonWrapper
            testID="empty_screen.button"
            onPress={onPressDiscover}
            style={styles.buttonWrapper}>
            <Text.ButtonBase useI18n color={theme.colors.bgButtonPrimary}>
              communities:empty_communities:button_text
            </Text.ButtonBase>
          </ButtonWrapper>
        }
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
              tintColor={theme.colors.textSecondary}
            />
            <Text.Subtitle useI18n>{privacyTitle}</Text.Subtitle>
            <Text.Subtitle> • </Text.Subtitle>
            <Text.BodySM>{user_count}</Text.BodySM>
            <Text.Subtitle>{` ${t('groups:text_members', {
              count: user_count,
            })}`}</Text.Subtitle>
          </View>
        }
        // onPressMenu={onPressMenu}
      />
    );
  };

  return (
    <FlatList
      testID="flatlist"
      data={myCommunities}
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
      marginTop: 2,
    },
    buttonWrapper: {
      marginTop: spacing.margin.large,
    },
  });
};

export default JoinedCommunities;
