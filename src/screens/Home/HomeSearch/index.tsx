import { StyleProp, ViewStyle, Keyboard } from 'react-native';
import React, {
  FC, useRef,
} from 'react';

import SearchBaseView from '~/beinComponents/SearchBaseView';
import SearchSuggestion from '~/screens/Home/HomeSearch/SearchSuggestion';
import SearchResult from '~/screens/Home/HomeSearch/SearchResult';
import { useBaseHook } from '~/hooks';
import { IPayloadSetNewsfeedSearch } from '~/interfaces/IHome';
import spacing from '~/theme/spacing';
import useFilterToolbarStore from '~/components/FilterToolbar/store';
import useFeedSearchStore from './store';

interface HomeSearchProps {
  style?: StyleProp<ViewStyle>;
  groupId?: string;
}

const HomeSearch: FC<HomeSearchProps> = (
  { style, groupId },
) => {
  const _searchViewRef = useRef<any>(null);

  const { t } = useBaseHook();
  const resetFilter = useFilterToolbarStore((state) => state.reset);

  const isShow = useFeedSearchStore((state) => state.newsfeedSearch.isShow);
  const isSuggestion = useFeedSearchStore(
    (state) => state.newsfeedSearch.isSuggestion,
  );
  const actions = useFeedSearchStore((state) => state.actions);
  const resetFeedSearchStore = useFeedSearchStore((state) => state.reset);

  const onSelectKeyword = (keyword: string) => {
    _searchViewRef?.current?.setSearchText?.(keyword);
    actions.setNewsfeedSearch({
      isSuggestion: false,
      hasNextPage: true,
      searchResults: [],
      searchText: keyword,
      groupId,
    });
    Keyboard.dismiss();
  };

  const onSearchText = (text: string) => {
    const searchText = text?.trim?.() || '';
    const payload: IPayloadSetNewsfeedSearch = { searchText };
    if (!searchText) {
      payload.isSuggestion = true;
      _searchViewRef?.current?.focus?.();
    }
    actions.setNewsfeedSearch(payload);
  };

  const onFocusSearch = () => {
    actions.setNewsfeedSearch({
      isSuggestion: true,
      searchResults: [],
      hasNextPage: true,
      groupId,
    });
  };

  const onSubmitSearch = () => {
    actions.setNewsfeedSearch({
      isSuggestion: false,
      searchResults: [],
      hasNextPage: true,
      groupId,
    });
  };

  if (!isShow) {
    return null;
  }

  const onClose = () => {
    resetFilter();
    resetFeedSearchStore();
  };

  return (
    <SearchBaseView
      style={style}
      isOpen={isShow}
      onClose={onClose}
      placeholder={t('input:search_content')}
      ref={_searchViewRef}
      onFocus={onFocusSearch}
      onChangeText={onSearchText}
      onSubmitEditing={onSubmitSearch}
      headerContainerStyle={{
        paddingHorizontal: spacing.padding.large,
        borderBottomWidth: 0,
      }}
    >
      {isSuggestion ? (
        <SearchSuggestion ref={_searchViewRef} onSelectKeyword={onSelectKeyword} />
      ) : (
        <SearchResult />
      )}
    </SearchBaseView>
  );
};

export default HomeSearch;
