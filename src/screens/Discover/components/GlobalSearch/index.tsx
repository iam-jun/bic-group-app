import { View, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';

import SearchBaseView, { SearchBaseViewProps } from '~/beinComponents/SearchBaseView';
import Text from '~/beinComponents/Text';
import actions from '~/storeRedux/groups/actions';
import appConfig from '~/configs/appConfig';
import GlobalSearchResults from './components/GlobalSearchResults';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { isGroup } from '~/screens/groups/helper';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useRootNavigation } from '~/hooks/navigation';

type GlobalSearchProps = SearchBaseViewProps

const GlobalSearch = ({
  initSearch, ...props
}: GlobalSearchProps) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const theme: ExtendedTheme = useTheme();
  const [searchText, setSearchText] = useState(initSearch || '');
  const styles = createStyles();

  const { canLoadMore } = useKeySelector(groupsKeySelector.globalSearch);

  const getGlobalSearch = (searchText: string) => {
    if (!searchText) return;

    dispatch(actions.getGlobalSearch(searchText));
  };

  const onLoadMore = () => {
    canLoadMore && getGlobalSearch(searchText);
  };

  const doGlobalSearch = (searchQuery: string) => {
    dispatch(actions.resetGlobalSearch());
    setSearchText(searchQuery);
    getGlobalSearch(searchQuery);
  };

  const searchHandler = useCallback(
    debounce(
      doGlobalSearch, appConfig.searchTriggerTime,
    ),
    [],
  );

  const onSearch = (text: string) => {
    searchHandler(text);
  };

  const onView = (item: any) => {
    if (isGroup(item.level)) {
      rootNavigation.navigate(groupStack.groupDetail, { groupId: item.id });
      return;
    }

    rootNavigation.navigate(groupStack.communityDetail, { communityId: item.id });
  };

  const onJoin = (item: any) => {
    if (isGroup(item.level)) {
      dispatch(actions.joinNewGroup({ groupId: item.id, groupName: item.name }));
      return;
    }

    dispatch(
      actions.joinCommunity({ communityId: item.id, communityName: item.name }),
    );
  };

  const onCancel = (item: any) => {
    if (isGroup(item.level)) {
      dispatch(actions.cancelJoinGroup({ groupId: item.id, groupName: item.name }));
      return;
    }

    dispatch(
      actions.cancelJoinCommunity({
        communityId: item.id,
        communityName: item.name,
      }),
    );
  };

  return (
    <SearchBaseView
      {...props}
      onChangeText={onSearch}
    >
      {searchText ? (
        <GlobalSearchResults
          onLoadMore={onLoadMore}
          onView={onView}
          onJoin={onJoin}
          onCancel={onCancel}
        />
      ) : (
        <View style={styles.text}>
          <Text.BodyS
            color={theme.colors.gray50}
            testID="search_community_view.type_search"
            useI18n
          >
            common:text_type_search_keyword
          </Text.BodyS>
        </View>
      )}
    </SearchBaseView>
  );
};

const createStyles = () => StyleSheet.create({
  text: {
    marginTop: 33,
    alignItems: 'center',
  },
});

export default GlobalSearch;
