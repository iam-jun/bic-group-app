import React, { FC, useEffect, useState } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  RefreshControl,
  FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import CommunityItem from '../components/CommunityItem';
import { ICommunity } from '~/interfaces/ICommunity';
import spacing from '~/theme/spacing';

export interface JoinedCommunitiesProps {
  style?: StyleProp<ViewStyle>;
  onPressCommunities?: (communityId: string) => void;
  onPressDiscover?: () => void;
}

const JoinedCommunities: FC<JoinedCommunitiesProps> = ({
  onPressCommunities,
  onPressDiscover,
}: JoinedCommunitiesProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const myCommunities = useKeySelector(groupsKeySelector.joinedCommunities);

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();

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

  const renderEmptyComponent = () => (
    <EmptyScreen
      source="addUsers"
      title="communities:empty_communities:title"
      description="communities:empty_communities:description"
      ButtonComponent={(
        <ButtonWrapper
          testID="empty_screen.button"
          onPress={onPressDiscover}
          style={styles.buttonWrapper}
        >
          <Text.ButtonM useI18n color={theme.colors.purple50}>
            communities:empty_communities:button_text
          </Text.ButtonM>
        </ButtonWrapper>
        )}
    />
  );

  const renderItem = ({ item }: {item: ICommunity}) => (
    <CommunityItem item={item} onPressCommunities={onPressCommunities} />
  );

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
            marginVertical: spacing.margin.tiny,
            marginHorizontal: spacing.margin.large,
          }}
        />
      )}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: spacing.margin.large,
  },
});

export default JoinedCommunities;
