import { StyleProp, ViewStyle, Keyboard } from 'react-native';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

import SearchBaseView from '~/beinComponents/SearchBaseView';
import { useKeySelector } from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import homeActions from '~/screens/Home/redux/actions';
import NFSSuggestion from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSSuggestion';
import NFSResult from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSResult';
import { useBaseHook } from '~/hooks';
import { IPayloadSetNewsfeedSearch } from '~/interfaces/IHome';

interface NewsfeedSearchProps {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
  searchViewRef?: any;
}

const NewsfeedSearch = ({ style, searchViewRef }: NewsfeedSearchProps) => {
  const _searchViewRef = searchViewRef || useRef(null);

  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const isShow = useKeySelector(homeKeySelector.newsfeedSearch.isShow);
  const isSuggestion = useKeySelector(homeKeySelector.newsfeedSearch.isSuggestion);

  const onSelectKeyword = (keyword: string) => {
    _searchViewRef?.current?.setSearchText?.(keyword);
    dispatch(homeActions.setNewsfeedSearch({
      isSuggestion: false,
      searchResults: [],
      searchText: keyword,
    }));
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
    dispatch(homeActions.setNewsfeedSearch({ isSuggestion: true, searchResults: [] }));
  };

  const onSubmitSearch = () => {
    dispatch(homeActions.setNewsfeedSearch({ isSuggestion: false, searchResults: [] }));
  };

  if (!isShow) {
    return null;
  }

  const onClose = () => {
    dispatch(homeActions.setNewsfeedSearch({ isShow: false }));
    dispatch(homeActions.clearAllNewsfeedSearch());
  }

  return (
    <SearchBaseView
      style={style}
      isOpen={isShow}
      searchViewRef={_searchViewRef}
      placeholder={t('input:search_post')}
      onClose={onClose}
      onChangeText={onSearchText}
      onFocus={onFocusSearch}
      onSubmitEditing={onSubmitSearch}
    >
      {isSuggestion ? (
        <NFSSuggestion onSelectKeyword={onSelectKeyword} />
      ) : (
        <NFSResult />
      )}
    </SearchBaseView>
  );
};

export default NewsfeedSearch;
