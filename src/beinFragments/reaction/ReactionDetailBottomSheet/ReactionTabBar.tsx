import React, {FC, useState, useEffect, useRef} from 'react';
import {FlatList, View, StyleSheet, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {blacklistReactions, ReactionType} from '~/constants/reactions';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import NodeEmoji from 'node-emoji';

export interface ReactionTabBarProps {
  initReaction?: ReactionType;
  reactionCounts: any;
  onChangeTab?: (item: any, index: number) => void;
}

const itemWidth = 80;

const ReactionTabBar: FC<ReactionTabBarProps> = ({
  reactionCounts,
  initReaction,
  onChangeTab,
}: ReactionTabBarProps) => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const flatListRef = useRef<any>();

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  useEffect(() => {
    onChangeTab?.(data?.[activeIndex], activeIndex);
  }, [activeIndex]);

  const _onPressTab = (index: number) => {
    setActiveIndex(index);
    if (data.length > index) {
      flatListRef?.current?.scrollToIndex?.({
        index: index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  useEffect(() => {
    //wait for set data finish, avoid scroll wrong position of tab
    setTimeout(() => {
      if (data?.length > 0 && initReaction) {
        data.map((item: any, index) => {
          if (item?.reactionType === initReaction) {
            _onPressTab(index);
          }
        });
      }
    }, 300);
  }, [data, initReaction]);

  useEffect(() => {
    if (reactionCounts) {
      const reaactionCountMap = new Map();
      const newData: any = [];
      Object.values(reactionCounts || {})?.map((reaction: any) => {
        const key = Object.keys(reaction || {})?.[0];
        if (key) {
          reaactionCountMap.set(key, reaction?.[key]);
        }
      });

      for (const [key, value] of reaactionCountMap) {
        const reactionType = key as ReactionType;
        if (!blacklistReactions?.[reactionType] && value > 0) {
          newData.push({
            reactionType,
            count: value,
          });
        }
      }
      setData(newData);
    } else {
      //reset
      setData([]);
      setActiveIndex(-1);
    }
  }, [reactionCounts]);

  const onScrollToIndexFailed = () => {
    console.log(`\x1b[31m🐣️ ReactionTabBar onScrollToIndexFailed\x1b[0m`);
  };

  const renderItem = ({item, index}: any) => {
    const {reactionType, count} = item || {};
    const isActive = activeIndex === index;
    const emoji = NodeEmoji.find(reactionType)?.emoji || '';
    return (
      <View>
        <Button
          testID={`reaction_detail_bottomSheet.${reactionType}`}
          style={styles.tabItem}
          onPress={() => _onPressTab(index)}>
          <Text.H5 color={isActive ? colors.primary7 : colors.textPrimary}>
            {emoji}
          </Text.H5>
          <Text.H6 color={isActive ? colors.primary7 : colors.textPrimary}>
            {` ${count}`}
          </Text.H6>
        </Button>
        {isActive && (
          <View
            testID={`reaction_detail_bottomSheet.active_${reactionType}`}
            style={styles.tabItemActive}
          />
        )}
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      data={data}
      snapToAlignment={'center'}
      showsHorizontalScrollIndicator={false}
      getItemLayout={(data, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
      onScrollToIndexFailed={onScrollToIndexFailed}
      snapToInterval={itemWidth}
      style={styles.container}
      renderItem={renderItem}
      keyExtractor={(item, index) => `reaction_tab_${index}`}
    />
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderColor: colors.borderDisable,
      maxWidth: 500,
    },
    tabItem: {
      width: itemWidth,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    tabItemActive: {
      position: 'absolute',
      bottom: 0,
      width: itemWidth,
      height: 2,
      backgroundColor: colors.primary7,
    },
  });
};

export default ReactionTabBar;
