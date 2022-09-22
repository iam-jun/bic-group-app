import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
// eslint-disable-next-line import/no-named-default
import { default as RNSectionListGetItemLayout } from 'react-native-section-list-get-item-layout';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Emoji from '../Emoji';

import EmojiPickerRow from './emoji_picker_row';
import Icon from '../Icon';
import Text from '~/beinComponents/Text';
import NoSearchResult from '~/components/NoSearchResult';
import { padding } from '~/theme/spacing';
import useEmojiPickerStore from './store';
import IEmojiPickerState from './store/Interface';
import { measureEmojiSections } from './store/utils';

const EMOJI_SIZE = 30;
const EMOJI_GUTTER = 7;
// const EMOJIS_PER_PAGE = 200;
const SECTION_HEADER_HEIGHT = 28;
const SECTION_MARGIN = 15;
export const SCROLLVIEW_NATIVE_ID = 'emojiPicker';

export function filterEmojiSearchInput(searchText) {
  return searchText.toLowerCase().replace(/^:|:$/g, '');
}

const EmojiPicker = ({ searchTerm, ...props }: any) => {
  const theme: ExtendedTheme = useTheme();
  const styles = getStyleSheetFromTheme(theme);

  const scrollToSectionTries = useRef(0);
  const emojiSectionIndexByOffset = useRef([]);
  const emojis = useEmojiPickerStore((state: IEmojiPickerState) => state.data);
  const filteredEmojis = useEmojiPickerStore((state: IEmojiPickerState) => state.filteredData);
  const [jumpToSection, setJumpToSection] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  // const rebuildEmojis = false;

  const sectionListRef = useRef<SectionList>();

  useEffect(() => {
    emojiSectionIndexByOffset.current = measureEmojiSections(emojis);
  }, []);

  const sectionListGetItemLayout = RNSectionListGetItemLayout({
    getItemHeight: () => (EMOJI_SIZE + 7) + (EMOJI_GUTTER * 2),
    getSectionHeaderHeight: () => SECTION_HEADER_HEIGHT,
  });

  // componentDidUpdate(prevProps) {
  //   rebuildEmojis = false;
  //   if (props.deviceWidth !== prevProps.deviceWidth) {
  //     rebuildEmojis = true;

  //     if (searchBarRef) {
  //       searchBarRef.blur();
  //     }
  //   }

  //   if (props.emojis !== prevProps.emojis) {
  //     rebuildEmojis = true;
  //   }

  //   setRebuiltEmojis();
  // }

  // const setRebuiltEmojis = (searchBarAnimationComplete = true) => {
  //   if (rebuildEmojis && searchBarAnimationComplete) {
  //     rebuildEmojis = false;
  //     const emojis = renderableEmojis(props.emojisBySection, props.deviceWidth);
  //     setEmojis(emojis);
  //   }
  // };

  // const changeSearchTerm = (rawText) => {
  //   const searchTerm = filterEmojiSearchInput(rawText);
  //   const nextState = {
  //     searchTerm: rawText,
  //   };
  //   const prevSearchTerm = state.searchTerm;
  //   setState(nextState);

  //   if (!searchTerm) {
  //     nextState.currentSectionIndex = 0;
  //     return;
  //   }

  //   clearTimeout(searchTermTimeout);
  //   if (prevSearchTerm === '') {
  //     const filteredEmojis = searchEmojis(searchTerm);
  //     setState({
  //       filteredEmojis,
  //     });
  //   } else {
  //     searchTermTimeout = setTimeout(() => {
  //       const filteredEmojis = searchEmojis(searchTerm);
  //       setState({
  //         filteredEmojis,
  //       });
  //     }, 100);
  //   }
  // };

  // const cancelSearch = () => {
  //   setCurrentSectionIndex(0);
  //   setFiltedEmojis([]);
  // };

  const renderItem = ({ item, section }) => (
    <View testID={section.defaultMessage}>
      <EmojiPickerRow
        key={item.key}
        emojiGutter={EMOJI_GUTTER}
        emojiSize={EMOJI_SIZE}
        items={item.items}
        onEmojiPress={(name) => props.onEmojiPress(`:${name}:`)}
      />
    </View>
  );

  const renderListComponent = (shorten) => {
    const { deviceWidth } = props;

    let listComponent;
    if (searchTerm) {
      const contentContainerStyle = filteredEmojis.length ? null : styles.flex;

      listComponent = (
        <FlatList
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
          getItemLayout={sectionListGetItemLayout}
          initialNumToRender={50}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          // ListFooterComponent={renderFooter}
          nativeID={SCROLLVIEW_NATIVE_ID}
        //   onEndReached={loadMoreCustomEmojis}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={onScroll}
          onScrollToIndexFailed={handleScrollToSectionFailed}
          // pageSize={50}
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

  const flatListRenderItem = ({ item }) => {
    const style = getStyleSheetFromTheme(props.theme);

    return (
      <TouchableOpacity
        onPress={() => props.onEmojiPress(`:${item}:`)}
        style={style.flatListRow}
      >
        <View style={style.flatListEmoji}>
          <Emoji
            emojiName={item}
            textStyle={style.emojiText}
            size={20}
          />
        </View>
        <Text.BodyM style={style.flatListEmojiName}>{`:${item}:`}</Text.BodyM>
      </TouchableOpacity>
    );
  };

  const onScroll = (e) => {
    if (jumpToSection) {
      return;
    }

    // clearTimeout(setIndexTimeout);

    const { contentOffset } = e.nativeEvent;
    let nextIndex = emojiSectionIndexByOffset.current.findIndex((offset) => contentOffset.y <= offset);

    if (nextIndex === -1) {
      nextIndex = emojiSectionIndexByOffset.current.length - 1;
    } else if (nextIndex !== 0) {
      nextIndex -= 1;
    }

    if (nextIndex !== currentSectionIndex) {
      setCurrentSectionIndex(nextIndex);
    }
  };

  const onMomentumScrollEnd = () => {
    if (jumpToSection) {
      setJumpToSection(false);
    }
  };

  const scrollToSection = (index) => {
    setJumpToSection(true);
    setCurrentSectionIndex(index);
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

  const renderSectionHeader = ({ section }) => {
    const { theme } = props;
    const styles = getStyleSheetFromTheme(theme);

    return (
      <View
        style={styles.sectionTitleContainer}
        key={section.title}
      >
        <Text.SubtitleS
          style={styles.sectionTitle}
        >
          {section.id}
        </Text.SubtitleS>
      </View>
    );
  };

  const handleSectionIconPress = (
    index,
    // isCustomSection = false
  ) => {
    scrollToSectionTries.current = 0;
    scrollToSection(index);

    // if (isCustomSection && props.customEmojiPage === 0) {
    //   loadMoreCustomEmojis();
    // }
  };

  const renderSectionIcons = () => {
    const { theme } = props;
    const styles = getStyleSheetFromTheme(theme);

    return emojis.map((section, index) => {
      const onPress = () => handleSectionIconPress(index);
      const tintColor = index === currentSectionIndex
        ? theme.colors.gray60
        : theme.colors.gray40;

      return (
        <Icon
          style={styles.sectionIconContainer}
          icon={section.icon}
          tintColor={tintColor}
          size={17}
          onPress={onPress}
        />
      );
    });
  };

  const renderEmptyList = () => <NoSearchResult />;

  return (
    <View>
      {renderListComponent(2)}
      {renderSectionIcons}
    </View>
  );
};

export const getStyleSheetFromTheme = ((theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    bottomContent: {
      borderTopWidth: 1,
      borderTopColor: colors.gray20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      padding: padding.base,
      backgroundColor: colors.neutral1,
      ...theme.elevations.e1,
    },
    bottomContentWrapper: {
      width: '100%',
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 35,
    },
    container: {
      flex: 1,
      alignItems: 'center',
    },
    searchBar: {
      padding: padding.base,
    },
    emojiText: {
      color: '#000',
      fontWeight: 'bold',
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
      paddingHorizontal: padding.small,
      borderTopWidth: 1,
      borderColor: colors.gray40,
      borderLeftWidth: 1,
      borderRightWidth: 1,
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
