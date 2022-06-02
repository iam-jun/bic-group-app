/* eslint-disable */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import emoji from 'emoji-datasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import emojiShortNameBlacklist from '~/beinComponents/emoji/emojiShortNameBlacklist';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import EmojiCell from '~/beinComponents/emoji/EmojiCell';

export const Categories = {
  all: {
    symbol: null,
    name: 'All',
  },
  history: {
    symbol: '🕘',
    name: 'Recently used',
  },
  emotion: {
    symbol: '😀',
    name: 'Smileys & Emotion',
  },
  people: {
    symbol: '🧑',
    name: 'People & Body',
  },
  nature: {
    symbol: '🦄',
    name: 'Animals & Nature',
  },
  food: {
    symbol: '🍔',
    name: 'Food & Drink',
  },
  activities: {
    symbol: '⚾️',
    name: 'Activities',
  },
  places: {
    symbol: '✈️',
    name: 'Travel & Places',
  },
  objects: {
    symbol: '💡',
    name: 'Objects',
  },
  symbols: {
    symbol: '🔣',
    name: 'Symbols',
  },
  flags: {
    symbol: '🏳️‍🌈',
    name: 'Flags',
  },
};

const PADDING_HORIZONTAL =  0;

const charFromUtf16 = utf16 =>
  String.fromCodePoint(...utf16.split('-').map(u => '0x' + u));
export const charFromEmojiObject = obj => charFromUtf16(obj.unified);
const filteredEmojis = emoji.filter(
  e => !e['obsoleted_by'] && !emojiShortNameBlacklist?.[e?.short_name],
);
const emojiByCategory = category =>
  filteredEmojis.filter(e => e.category === category);
const sortEmoji = list => list.sort((a, b) => a.sort_order - b.sort_order);
const categoryKeys = Object.keys(Categories);

const TabBar = ({
  theme,
  inactiveTab = '#EEEEEE',
  activeCategory,
  onPress,
  width,
}) => {
  const tabSize = width / categoryKeys.length;

  return categoryKeys.map(c => {
    const category = Categories[c];
    if (c !== 'all')
      return (
        <TouchableOpacity
          key={category.name}
          onPress={() => onPress(category)}
          style={{
            flex: 1,
            height: tabSize,
            borderColor: category === activeCategory ? theme : inactiveTab,
            borderBottomWidth: category === activeCategory ? 2 : 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              paddingBottom: 8,
              fontSize: (tabSize - 12) * 0.7,
            }}>
            {category.symbol}
          </Text>
        </TouchableOpacity>
      );
  });
};

export const emojiStorageKey = '@react-native-emoji-selector:HISTORY';

export const getEmojiHistory = async (limit = 6) => {
  let result = ['❤️', '👍', '🤣', '😮', '😭', '😡'];
  try {
    let historyStr = await AsyncStorage.getItem(emojiStorageKey);
    if (historyStr) {
      let history = JSON.parse(historyStr) || [];
      history = history?.slice?.(0, limit)?.reverse?.();
      history?.map?.(item => result.unshift(charFromEmojiObject(item)));
    }
    return Promise.resolve(result.splice(0, limit));
  } catch (e) {
    return Promise.resolve(result);
  }
};

export default class EmojiSelector extends Component {
  state = {
    searchQuery: '',
    category: Categories.people,
    isReady: false,
    history: [],
    emojiList: null,
    colSize: 0,
    width: 0,
  };

  //
  //  HANDLER METHODS
  //
  handleTabSelect = category => {
    if (this.state.isReady) {
      if (this.scrollview)
        this.scrollview.scrollToOffset({x: 0, y: 0, animated: false});
      this.setState({
        searchQuery: '',
        category,
      });
    }
  };

  onLongPress = emojiKey => {
    this.props.onEmojiLongPress?.(emojiKey);
  };

  handleEmojiSelect = emoji => {
    if (this.props.showHistory) {
      this.addToHistoryAsync(emoji);
    }
    this.props.onEmojiSelected(charFromEmojiObject(emoji));
  };

  handleSearch = searchQuery => {
    this.setState({searchQuery});
  };

  addToHistoryAsync = async emoji => {
    let history = await AsyncStorage.getItem(emojiStorageKey);

    let value = [];
    if (!history) {
      // no history
      let record = Object.assign({}, emoji, {count: 1});
      value.push(record);
    } else {
      let json = JSON.parse(history);
      if (json.filter(r => r.unified === emoji.unified).length > 0) {
        value = json;
      } else {
        let record = Object.assign({}, emoji, {count: 1});
        value = [record, ...json];
      }
    }

    AsyncStorage.setItem(emojiStorageKey, JSON.stringify(value));
    this.setState({
      history: value,
    });
  };

  loadHistoryAsync = async () => {
    let result = await AsyncStorage.getItem(emojiStorageKey);
    if (result) {
      let history = JSON.parse(result);
      this.setState({history});
    }
  };

  //
  //  RENDER METHODS
  //
  renderEmojiCell = ({item}) => (
    <EmojiCell
      key={item.key}
      emoji={item.emoji}
      onLongPress={this.onLongPress}
      onPress={() => this.handleEmojiSelect(item.emoji)}
      colSize={this.state.colSize}
    />
  );

  returnSectionData() {
    const {history, emojiList, searchQuery, category} = this.state;
    let emojiData = (function () {
      if (category === Categories.all && searchQuery === '') {
        //TODO: OPTIMIZE THIS
        let largeList = [];
        categoryKeys.forEach(c => {
          const name = Categories[c].name;
          const list =
            name === Categories.history.name ? history : emojiList[name];
          if (c !== 'all' && c !== 'history')
            largeList = largeList.concat(list);
        });

        return largeList.map(emoji => ({key: emoji.unified, emoji}));
      } else {
        let list;
        const hasSearchQuery = searchQuery !== '';
        const name = category.name;
        if (hasSearchQuery) {
          const filtered = emoji.filter(e => {
            let display = false;
            e.short_names.forEach(name => {
              if (
                name.includes(searchQuery.toLowerCase()) &&
                !emojiShortNameBlacklist?.[name]
              ) {
                display = true;
              }
            });
            return display;
          });
          list = sortEmoji(filtered);
        } else if (name === Categories.history.name) {
          list = history;
        } else {
          list = emojiList[name];
        }
        return list.map(emoji => ({key: emoji.unified, emoji}));
      }
    })();
    return this.props.shouldInclude
      ? emojiData.filter(e => this.props.shouldInclude(e.emoji))
      : emojiData;
  }

  prerenderEmojis(callback) {
    let emojiList = {};
    categoryKeys.forEach(c => {
      let name = Categories[c].name;
      emojiList[name] = sortEmoji(emojiByCategory(name));
    });

    this.setState(
      {
        emojiList,
        colSize: Math.floor(
          (this.state.width - PADDING_HORIZONTAL * 2) / this.props.columns,
        ),
      },
      callback,
    );
  }

  handleLayout = ({nativeEvent: {layout}}) => {
    this.setState({width: layout.width}, () => {
      this.prerenderEmojis(() => {
        this.setState({isReady: true});
      });
    });
  };

  //
  //  LIFECYCLE METHODS
  //
  componentDidMount() {
    const {category, showHistory} = this.props;
    this.setState({category});

    if (showHistory) {
      this.loadHistoryAsync();
    }
  }

  render() {
    const {
      theme,
      inactiveTab,
      columns,
      placeholder,
      showHistory,
      showSearchBar,
      showSectionTitles,
      showTabs,
      ...other
    } = this.props;

    const {category, colSize, isReady, searchQuery} = this.state;

    const Searchbar = (
      <View style={styles.searchbar_container}>
        <SearchInput
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={this.handleSearch}
        />
      </View>
    );

    const title = searchQuery !== '' ? 'Search Results' : category.name;

    return (
      <View style={styles.frame} {...other} onLayout={this.handleLayout}>
        <View style={styles.tabBar}>
          {showTabs && (
            <TabBar
              activeCategory={category}
              onPress={this.handleTabSelect}
              theme={theme}
              inactiveTab={inactiveTab}
              width={this.state.width}
            />
          )}
        </View>
        <View style={{flex: 1}}>
          {showSearchBar && Searchbar}
          {isReady && (
            <FlatList
              style={styles.scrollview}
              data={this.returnSectionData()}
              renderItem={this.renderEmojiCell}
              horizontal={false}
              numColumns={columns}
              keyboardShouldPersistTaps={'always'}
              ref={scrollview => (this.scrollview = scrollview)}
              removeClippedSubviews
              nestedScrollEnabled
            />
          )}
        </View>
      </View>
    );
  }
}

EmojiSelector.defaultProps = {
  theme: '#007AFF',
  category: Categories.all,
  showTabs: true,
  showSearchBar: true,
  showHistory: false,
  showSectionTitles: true,
  columns: 6,
  placeholder: 'Search...',
};

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
  },
  scrollview: {
    // flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  searchbar_container: {
    width: '100%',
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
  },
  search: {
    ...Platform.select({
      ios: {
        height: 36,
        paddingLeft: 8,
        borderRadius: 10,
        backgroundColor: '#E5E8E9',
      },
    }),
    margin: 8,
  },
  container: {
    // flex: 1,
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    // alignItems: 'flex-start',
  },
  sectionHeader: {
    margin: 8,
    fontSize: 17,
    width: '100%',
    color: '#8F8F8F',
  },
});
