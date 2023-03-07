import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  Platform,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
// eslint-disable-next-line import/no-named-default
import { default as RNSectionListGetItemLayout } from 'react-native-section-list-get-item-layout';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import Emoji from '../Emoji';

import EmojiPickerRow from './components/EmojiPickerRow';
import Text from '~/baseComponents/Text';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import useEmojiPickerStore, { IEmojiPickerState } from './store';
import {
  EMOJI_GUTTER, EMOJI_SIZE, ON_END_REACHED_THRESHOLD, SCROLLVIEW_NATIVE_ID, SECTION_HEADER_HEIGHT, SECTION_MARGIN,
} from './store/constant';
import { padding } from '~/theme/spacing';
import { dimension } from '~/theme';
import Button from '../Button';

export interface EmojiPickerProps {
  emojiPickerRef?: any;
  onEmojiPress: (name: string) => void
}

const _EmojiPicker = ({
  emojiPickerRef, onEmojiPress,
}: EmojiPickerProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = getStyleSheetFromTheme(theme);
  const scrollToSectionTries = useRef(0);
  const sectionListRef = useRef<SectionList>();
  const [jumpToSection, setJumpToSection] = useState(false);

  const emojis = useEmojiPickerStore((state: IEmojiPickerState) => state.data);
  const filteredEmojis = useEmojiPickerStore((state: IEmojiPickerState) => state.filteredData);
  const currentSectionIndex = useEmojiPickerStore((state: IEmojiPickerState) => state.currentSectionIndex);
  const emojiSectionIndexByOffset = useEmojiPickerStore((state: IEmojiPickerState) => state.emojiSectionIndexByOffset);
  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  const sectionListGetItemLayout = RNSectionListGetItemLayout({
    getItemHeight: () => (EMOJI_SIZE + 7) + (EMOJI_GUTTER * 2),
    getSectionHeaderHeight: () => SECTION_HEADER_HEIGHT,
  });

  useImperativeHandle(emojiPickerRef, () => ({ scrollToSectionIndex }));

  const scrollToSectionIndex = (index: number) => {
    scrollToSectionTries.current = 0;
    scrollToSection(index);
  };

  const _onEmojiPress = (emoji: string) => {
    onEmojiPress?.(emoji);
    actions.addToRecently(emoji);
  };

  const onSearchEmojiPress = (emoji: string) => {
    _onEmojiPress(emoji);
    actions.resetData();
  };

  const onScroll = (e) => {
    if (jumpToSection) return;

    const { contentOffset } = e.nativeEvent;
    let nextIndex = emojiSectionIndexByOffset.findIndex((offset) => contentOffset.y <= offset);

    if (nextIndex === -1) {
      nextIndex = emojiSectionIndexByOffset.length - 1;
    } else if (nextIndex !== 0) {
      nextIndex -= 1;
    }

    if (nextIndex !== currentSectionIndex) {
      actions.setCurrentSectionIndex(nextIndex);
    }
  };

  const onMomentumScrollEnd = () => {
    if (jumpToSection) {
      setJumpToSection(false);
    }
  };

  const scrollToSection = (index) => {
    setJumpToSection(true);
    actions.setCurrentSectionIndex(index);
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      viewOffset: 25,
    });
  };

  const handleScrollToSectionFailed = ({ index }) => {
    if (scrollToSectionTries.current < 1) {
      setTimeout(() => {
        scrollToSectionTries.current += 1;
        scrollToSection(index);
      }, 200);
    }
  };

  const renderSectionHeader = ({ section }) => (
    <View
      key={section.title}
      style={styles.sectionTitleContainer}
    >
      <Text.SubtitleS
        useI18n
        style={styles.sectionTitle}
      >
        {`emoji_categories:${section.id}`}
      </Text.SubtitleS>
    </View>
  );

  const renderEmptyList = () => <NoSearchResultsFound testID="emoji_picker.flat_list_empty" />;

  const flatListKeyExtractor = (item: string) => item;

  const flatListRenderItem = ({ item }) => (
    <Button
      testID={`emoji_picker.flat_list_item.${item}`}
      style={styles.flatListRow}
      onPress={() => onSearchEmojiPress(`${item}`)}
    >
      <View style={styles.flatListEmoji}>
        <Emoji
          size={20}
          emojiName={item}
        />
      </View>
      <Text.BodyM style={styles.flatListEmojiName}>
        {`:${item}:`}
      </Text.BodyM>
    </Button>
  );

  const renderItem = ({ item }) => (
    <View testID={`emoji_picker.section_list_item.${item.key}`}>
      <EmojiPickerRow
        key={item.key}
        items={item.items}
        emojiSize={EMOJI_SIZE}
        emojiGutter={EMOJI_GUTTER}
        onEmojiPress={_onEmojiPress}
      />
    </View>
  );

  const renderListComponent = () => {
    if (filteredEmojis !== null) {
      return (
        <Animated.FlatList
          testID="emoji_picker.flat_list"
          style={styles.flatList}
          removeClippedSubviews
          entering={FadeInUp}
          exiting={FadeOutDown}
          data={filteredEmojis}
          initialNumToRender={10}
          nativeID={SCROLLVIEW_NATIVE_ID}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.flex}
          renderItem={flatListRenderItem}
          keyExtractor={flatListKeyExtractor}
          ListEmptyComponent={renderEmptyList}
        />
      );
    }

    return (
      <SectionList
        testID="emoji_picker.section_list"
        sections={emojis}
        style={styles.sectionList}
        ref={sectionListRef}
        initialNumToRender={50}
        nativeID={SCROLLVIEW_NATIVE_ID}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onScroll={onScroll}
        renderItem={renderItem}
        getItemLayout={sectionListGetItemLayout}
        renderSectionHeader={renderSectionHeader}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollToIndexFailed={handleScrollToSectionFailed}
      />
    );
  };

  return (
    <View testID="emoji_picker" style={styles.container}>
      {renderListComponent()}
    </View>
  );
};

export const getStyleSheetFromTheme = ((theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    flex: {
      flex: 1,
    },
    flatList: {
      flex: 1,
      alignSelf: 'stretch',
    },
    flatListEmoji: {
      marginRight: 5,
    },
    flatListEmojiName: {
      color: colors.neutral90,
    },
    flatListRow: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: padding.base,
      overflow: 'hidden',
    },
    flexCenter: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionList: {
      ...Platform.select({
        android: {
          marginBottom: 35,
        },
      }),
      width: dimension.deviceWidth - (SECTION_MARGIN * 2),
    },
    sectionIcon: {
      color: colors.neutral60,
    },
    sectionIconContainer: {
      flex: 1,
      height: 35,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionIconHighlight: {
      color: colors.gray40,
    },
    sectionTitle: {
      color: colors.gray40,
    },
    sectionTitleContainer: {
      height: SECTION_HEADER_HEIGHT,
      justifyContent: 'center',
      backgroundColor: colors.neutral1,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
    },
  });
});

const EmojiPicker = React.memo(_EmojiPicker);
// EmojiPicker.whyDidYouRender = true;
export default EmojiPicker;
