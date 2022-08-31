import { StyleProp, ViewStyle, Keyboard } from 'react-native';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

import SearchBaseView from '~/beinComponents/SearchBaseView';
import { useKeySelector } from '~/hooks/selector';
import homeKeySelector from '~/storeRedux/home/keySelector';
import homeActions from '~/storeRedux/home/actions';
import SearchSuggestion from '~/screens/Home/HomeSearch/SearchSuggestion';
import SearchResult from '~/screens/Home/HomeSearch/SearchResult';
import { useBaseHook } from '~/hooks';
import { IPayloadSetNewsfeedSearch } from '~/interfaces/IHome';
import spacing from '~/theme/spacing';

interface HomeSearchProps {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
  searchViewRef?: any;
}

const HomeSearch = ({ style, searchViewRef }: HomeSearchProps) => {
  const _searchViewRef = searchViewRef || useRef(null);

  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const isShow = useKeySelector(homeKeySelector.newsfeedSearch.isShow);
  const isSuggestion = useKeySelector(
    homeKeySelector.newsfeedSearch.isSuggestion,
  );

  const onSelectKeyword = (keyword: string) => {
    _searchViewRef?.current?.setSearchText?.(keyword);
    dispatch(
      homeActions.setNewsfeedSearch({
        isSuggestion: false,
        searchResults: [],
        searchText: keyword,
      }),
    );
    Keyboard.dismiss();
  };

  const onSearchText = (text: string) => {
    const searchText = text?.trim?.() || '';
    const payload: IPayloadSetNewsfeedSearch = { searchText };
    if (!searchText) {
      payload.isSuggestion = true;
      _searchViewRef?.current?.focus?.();
    }
    dispatch(homeActions.setNewsfeedSearch(payload));
  };

  const onFocusSearch = () => {
    dispatch(
      homeActions.setNewsfeedSearch({ isSuggestion: true, searchResults: [] }),
    );
  };

  const onSubmitSearch = () => {
    dispatch(
      homeActions.setNewsfeedSearch({ isSuggestion: false, searchResults: [] }),
    );
  };

  if (!isShow) {
    return null;
  }

  const onClose = () => {
    dispatch(homeActions.clearAllNewsfeedSearch());
  };

  return (
    <SearchBaseView
      style={style}
      isOpen={isShow}
      onClose={onClose}
      placeholder={t('input:search_post')}
      searchViewRef={_searchViewRef}
      onFocus={onFocusSearch}
      onChangeText={onSearchText}
      onSubmitEditing={onSubmitSearch}
      headerContainerStyle={{
        paddingHorizontal: spacing.padding.large,
        borderBottomWidth: 0,
      }}
    >
      {isSuggestion ? (
        <SearchSuggestion onSelectKeyword={onSelectKeyword} />
      ) : (
        <SearchResult />
      )}
    </SearchBaseView>
  );
};

export default HomeSearch;
