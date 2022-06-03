import React, {FC, useEffect, useState} from 'react';
import {
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
import EmptyScreen from '~/beinFragments/EmptyScreen';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import {useDispatch} from 'react-redux';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import CommunityItem from '../components/CommunityItem';
import {ICommunity} from '~/interfaces/ICommunity';

export interface JoinedCommunitiesProps {
  style?: StyleProp<ViewStyle>;
  onPressCommunities?: (communityId: number) => void;
  onPressDiscover?: () => void;
}

const JoinedCommunities: FC<JoinedCommunitiesProps> = ({
  onPressCommunities,
  onPressDiscover,
}: JoinedCommunitiesProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const myCommunities = useKeySelector(groupsKeySelector.joinedCommunities);

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

  const renderItem = ({item}: {item: ICommunity}) => {
    return (
      <CommunityItem item={item} onPressCommunities={onPressCommunities} />
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
  const {spacing} = theme;
  return StyleSheet.create({
    buttonWrapper: {
      marginTop: spacing.margin.large,
    },
  });
};

export default JoinedCommunities;
