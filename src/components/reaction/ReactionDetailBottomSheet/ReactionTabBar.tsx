import React, {
  FC, useState, useEffect, useRef,
} from 'react';
import {
  FlatList, StyleSheet, Image,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';

import NodeEmoji from 'node-emoji';
import { blacklistReactions, ReactionType } from '~/constants/reactions';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import { ANIMATED_EMOJI, STATIC_EMOJI } from '~/resources/emoji';
import { spacing } from '~/theme';

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

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  useEffect(
    () => {
      onChangeTab?.(
        data?.[activeIndex], activeIndex,
      );
    }, [activeIndex],
  );

  const _onPressTab = debounce((index: number) => {
    setActiveIndex(index);
    if (data.length > index) {
      flatListRef?.current?.scrollToIndex?.({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, 200);

  useEffect(
    () => {
    // wait for set data finish, avoid scroll wrong position of tab
      setTimeout(
        () => {
          if (data?.length > 0 && initReaction) {
            data.forEach((
              item: any, index,
            ) => {
              if (item?.reactionType === initReaction) {
                _onPressTab(index);
              }
            });
          }
        }, 300,
      );
    }, [data, initReaction],
  );

  useEffect(
    () => {
      if (reactionCounts) {
        const reaactionCountMap = new Map();
        const newData: any = [];
        Object.values(reactionCounts || {})?.forEach((reaction: any) => {
          const key = Object.keys(reaction || {})?.[0];
          if (key) {
            reaactionCountMap.set(
              key, reaction?.[key],
            );
          }
        });

        // eslint-disable-next-line no-restricted-syntax
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
      // reset
        setData([]);
        setActiveIndex(-1);
      }
    }, [reactionCounts],
  );

  const onScrollToIndexFailed = () => {
    console.warn('\x1b[31m🐣️ ReactionTabBar onScrollToIndexFailed\x1b[0m');
  };

  const renderItem = ({ item, index }: any) => {
    const { reactionType, count } = item || {};
    const isActive = activeIndex === index;

    let emoji = null;
    const nodeEmoji = NodeEmoji.find(reactionType || '')?.emoji || '';

    if (nodeEmoji) {
      emoji = (
        <Text.H5 style={styles.nodeEmoji}>
          {nodeEmoji}
        </Text.H5>
      );
    }

    if (!emoji) {
      const imageEmoji = STATIC_EMOJI[reactionType] || ANIMATED_EMOJI[reactionType];
      if (imageEmoji) {
        emoji = (
          <Image style={styles.emoji} resizeMode="contain" source={imageEmoji} />
        );
      }
    }

    return (
      <Button
        testID={`reaction_detail_bottomSheet.${reactionType}`}
        style={[styles.tabItem, { backgroundColor: isActive ? colors.purple2 : colors.white }]}
        onPress={() => _onPressTab(index)}
      >
        {emoji}
        <Text.H6 color={isActive ? colors.purple50 : colors.neutral40}>
          {` ${count}`}
        </Text.H6>
      </Button>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      data={data}
      // snapToAlignment={'center'}
      showsHorizontalScrollIndicator={false}
      getItemLayout={(
        data, index,
      ) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
      onScrollToIndexFailed={onScrollToIndexFailed}
      snapToInterval={itemWidth}
      style={styles.container}
      renderItem={renderItem}
      keyExtractor={(
        item, index,
      ) => `reaction_tab_${index}_${JSON.stringify(item)}`}
    />
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderColor: colors.neutral5,
      paddingVertical: spacing.padding.base,
      paddingHorizontal: spacing.padding.base,
    },
    tabItem: {
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.small,
      borderRadius: spacing.borderRadius.small,
      marginLeft: spacing.margin.xSmall,
    },
    nodeEmoji: {
      fontSize: 14,
    },
    emoji: {
      width: 14,
      aspectRatio: 1,
    },
  });
};

export default ReactionTabBar;
