import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';

import SearchBaseView, { SearchBaseViewProps } from '~/beinComponents/SearchBaseView';
import actions from '~/storeRedux/groups/actions';
import appConfig from '~/configs/appConfig';
import GlobalSearchResults from './components/GlobalSearchResults';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { isGroup } from '~/screens/groups/helper';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useRootNavigation } from '~/hooks/navigation';
import IDiscoverGroupsState from '~/screens/groups/DiscoverGroups/store/Interface';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';

type GlobalSearchProps = SearchBaseViewProps

const GlobalSearch = ({
  initSearch, ...props
}: GlobalSearchProps) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const joinNewGroup = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.doJoinNewGroup);
  const cancelJoinGroup = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.doCancelJoinGroup);

  const [searchText, setSearchText] = useState(initSearch || '');

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
      rootNavigation.navigate(groupStack.groupDetail, { groupId: item.id, communityId: item.community?.id });
      return;
    }

    rootNavigation.navigate(groupStack.communityDetail, { communityId: item.id });
  };

  const onJoin = (item: any) => {
    if (isGroup(item.level)) {
      joinNewGroup(item.id);
      return;
    }

    dispatch(
      actions.joinCommunity({ communityId: item.id, communityName: item.name }),
    );
  };

  const onCancel = (item: any) => {
    if (isGroup(item.level)) {
      cancelJoinGroup(item.id);
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
      ) : null}
    </SearchBaseView>
  );
};

export default GlobalSearch;
