/* eslint-disable import/no-dynamic-require */
import React, { FC, useEffect, useState } from 'react';
import {
  Image, View, StyleSheet, LayoutChangeEvent,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '~/beinComponents/Button';
import spacing, { margin } from '~/theme/spacing';
import Tab from '~/baseComponents/Tab';
import { ANIMATED_EMOJI, STATIC_EMOJI } from '~/resources/emoji';
import { useBaseHook } from '~/hooks';

export interface ReactionViewProps {
  onPressReaction: (key: string) => void;
}

const ITEM_SIZE = 40;

const SelectReactionView: FC<ReactionViewProps> = ({
  onPressReaction,
}: ReactionViewProps) => {
  const { t } = useBaseHook();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [contentHeight, setContentHeight] = useState(ITEM_SIZE * 4); // 4 rows
  const [data, setData] = useState<any>(STATIC_EMOJI);
  const tabData = [
    { id: '1', text: t('common:text_static') },
    { id: '2', text: t('common:text_animated') },
  ];

  useEffect(() => {
    const _data = selectedIndex === 0 ? STATIC_EMOJI : ANIMATED_EMOJI;
    setData(_data);
  }, [selectedIndex])

  const _onPressReaction = (item: string) => {
    onPressReaction?.(item);
  };

  const renderItem = (item: any, index: number) => (
    <Button
      key={`reaction_${index}_${item}`}
      style={styles.item}
      onPress={() => _onPressReaction(item)}
    >
      <Image style={styles.icon} resizeMode="contain" source={data[item]} />
    </Button>
  );

  const onPressTab = (_, index:number) => {
    setSelectedIndex(index)
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const height = event?.nativeEvent?.layout?.height;
    if (height && height > contentHeight) {
      setContentHeight(height);
    }
  };

  return (
    <View style={styles.container}>
      <Tab
        activeIndex={selectedIndex}
        data={tabData}
        onPressTab={onPressTab}
      />
      <View
        style={{ flex: 1, maxHeight: ITEM_SIZE * 4, height: contentHeight }}
        onLayout={onLayout}
      >
        <ScrollView style={styles.list}>
          <View style={styles.listContainer}>
            {Object.keys(data).map((item, index) => renderItem(item, index))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.large,
  },
  list: {
    flex: 1,
    marginTop: margin.tiny,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Needed for wrapping for the items
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    aspectRatio: 1,
  },
});

export default SelectReactionView;
