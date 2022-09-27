import React, {
  useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import {
  Platform,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
// eslint-disable-next-line import/no-named-default
import { default as RNSectionListGetItemLayout } from 'react-native-section-list-get-item-layout';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import Emoji from '../Emoji';

import EmojiPickerRow from './components/EmojiPickRow';
import Text from '~/beinComponents/Text';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import useEmojiPickerStore from './store';
import IEmojiPickerState from './store/Interface';
import { measureEmojiSections } from './store/utils';
import {
  EMOJI_GUTTER, EMOJI_SIZE, SCROLLVIEW_NATIVE_ID, SECTION_HEADER_HEIGHT, SECTION_MARGIN,
} from './store/constant';
import { dimension } from '~/theme';
import { padding } from '~/theme/spacing';

export interface EmojiPickerProps {
  emojiPickerRef?: any;
  onEmojiPress: (name: string) => void
}

const EmojiPicker = ({
  emojiPickerRef, onEmojiPress,
}: EmojiPickerProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = getStyleSheetFromTheme(theme);
  const { deviceWidth } = dimension;
  const scrollToSectionTries = useRef(0);
  const emojiSectionIndexByOffset = useRef([]);
  const emojis = useEmojiPickerStore((state: IEmojiPickerState) => state.data);
  const currentSectionIndex = useEmojiPickerStore((state: IEmojiPickerState) => state.currentSectionIndex);
  const filteredEmojis = useEmojiPickerStore((state: IEmojiPickerState) => state.filteredData);
  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);
  const [jumpToSection, setJumpToSection] = useState(false);
  // const rebuildEmojis = false;

  const sectionListRef = useRef<SectionList>();

  useEffect(() => {
    emojiSectionIndexByOffset.current = measureEmojiSections(emojis);
  }, []);

  const sectionListGetItemLayout = RNSectionListGetItemLayout({
    getItemHeight: () => (EMOJI_SIZE + 7) + (EMOJI_GUTTER * 2),
    getSectionHeaderHeight: () => SECTION_HEADER_HEIGHT,
  });

  useImperativeHandle(
    emojiPickerRef, () => ({
      scrollToSectionIndex,
    }),
  );

  const scrollToSectionIndex = (
    index,
  ) => {
    scrollToSectionTries.current = 0;
    scrollToSection(index);
  };

  const onSearchEmojiPress = (emoji: string) => {
    onEmojiPress(emoji);
    actions.resetData();
  };

  const renderItem = ({ item, section }) => (
    <View testID={section.defaultMessage}>
      <EmojiPickerRow
        key={item.key}
        emojiGutter={EMOJI_GUTTER}
        emojiSize={EMOJI_SIZE}
        items={item.items}
        onEmojiPress={onEmojiPress}
      />
    </View>
  );

  const renderListComponent = (shorten = 2) => {
    let listComponent;
    if (filteredEmojis.length > 0) {
      const contentContainerStyle = [styles.flex];

      listComponent = (
        <Animated.FlatList
          entering={FadeInUp}
          exiting={FadeOutDown}
          contentContainerStyle={contentContainerStyle}
          data={filteredEmojis}
          keyboardShouldPersistTaps="always"
          keyExtractor={flatListKeyExtractor}
          initialNumToRender={10}
          ListEmptyComponent={renderEmptyList}
          nativeID={SCROLLVIEW_NATIVE_ID}
          renderItem={flatListRenderItem}
          removeClippedSubviews
          style={styles.flatList}
        />
      );
    } else {
      listComponent = (
        <SectionList
          ref={sectionListRef}
          nativeID={SCROLLVIEW_NATIVE_ID}
          getItemLayout={sectionListGetItemLayout}
          initialNumToRender={50}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={onScroll}
          onScrollToIndexFailed={handleScrollToSectionFailed}
          removeClippedSubviews
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          sections={emojis}
          showsVerticalScrollIndicator={false}
          style={[styles.sectionList, { width: deviceWidth - (SECTION_MARGIN * shorten) }]}
        />
      );
    }

    return listComponent;
  };

  const flatListKeyExtractor = (item) => item;

  const flatListRenderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSearchEmojiPress(`${item}`)}
      style={styles.flatListRow}
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
    </TouchableOpacity>
  );

  const onScroll = (e) => {
    if (jumpToSection) {
      return;
    }

    const { contentOffset } = e.nativeEvent;
    let nextIndex = emojiSectionIndexByOffset.current.findIndex((offset) => contentOffset.y <= offset);

    if (nextIndex === -1) {
      nextIndex = emojiSectionIndexByOffset.current.length - 1;
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
      style={styles.sectionTitleContainer}
      key={section.title}
    >
      <Text.SubtitleS
        useI18n
        style={styles.sectionTitle}
      >
        {`emoji_categories:${section.id}`}
      </Text.SubtitleS>
    </View>
  );

  const renderEmptyList = () => <NoSearchResultsFound />;

  return (
    <View style={styles.container}>
      {renderListComponent(2)}
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

export default EmojiPicker;
