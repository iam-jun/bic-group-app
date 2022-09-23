import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import * as modalActions from '~/storeRedux/modal/actions';
import commonKeySelector from '~/storeRedux/modal/keySelector';
import { margin } from '~/theme/spacing';
import { SearchInput } from '~/baseComponents/Input';
import useEmojiPickerStore from '~/baseComponents/EmojiPicker/store';
import IEmojiPickerState from '~/baseComponents/EmojiPicker/store/Interface';
import EmojiPicker from '~/baseComponents/EmojiPicker';
import BottomSheet from '~/baseComponents/BottomSheet';
import EmojiSectionIcons from '~/baseComponents/EmojiPicker/components/EmojiSectionIcons';
import { useBaseHook } from '~/hooks';

const SNAP_HEIGHT = 400;

const ReactionBottomSheet = () => {
  const reactionSheetRef: any = useRef();
  const emojiPickerRef: any = useRef();
  const searchInputRef = useRef<TextInput>();
  const { t } = useBaseHook();

  const [sectionIconsVisible, setSectionIconsVisible] = useState(false);

  const dispatch = useDispatch();
  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  const data = useKeySelector(commonKeySelector.reactionBottomSheet);
  const { visible, callback } = data || {};

  const _onPressReaction = (key: string) => {
    callback?.(key);
    reactionSheetRef?.current?.close?.();
  };

  const _onClose = () => {
    actions.resetData();
    setSectionIconsVisible(false);
    dispatch(modalActions.setShowReactionBottomSheet());
  };

  const onOpen = () => {
    setSectionIconsVisible(true);
  };

  const onSearchFocus = () => reactionSheetRef.current?.open('top');

  const onChangeText = (text:string) => {
    actions.search(text);
  };

  const onPositionChange = (position: 'top' | 'initial') => {
    if (position === 'initial') {
      searchInputRef.current?.blur();
    }
  };

  const scrollToSectionIndex = (index) => {
    emojiPickerRef.current?.scrollToSectionIndex(index);
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        modalizeRef={reactionSheetRef}
        isOpen={visible}
        snapPoint={SNAP_HEIGHT}
        adjustToContentHeight={false}
        closeSnapPointStraightEnabled={false}
        onClose={_onClose}
        onOpen={onOpen}
        onPositionChange={onPositionChange}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
          keyboardDismissMode: 'interactive',
          contentContainerStyle: styles.contentContainerStyle,
        }}
        ContentComponent={(
          <View style={styles.container}>
            <SearchInput
              style={styles.searchInput}
              inputRef={searchInputRef}
              placeholder={t('sticker:search_emoji')}
              onChangeText={onChangeText}
              onFocus={onSearchFocus}
            />
            <EmojiPicker
              emojiPickerRef={emojiPickerRef}
              onEmojiPress={_onPressReaction}
            />
          </View>
      )}
      />
      <EmojiSectionIcons visible={sectionIconsVisible} onPress={scrollToSectionIndex} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    height: '100%',
  },
  container: {
    flex: 1,
  },
  searchInput: {
    marginHorizontal: margin.base,
    marginBottom: margin.base,
  },

});

export default ReactionBottomSheet;
