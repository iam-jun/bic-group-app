/* eslint-disable import/no-dynamic-require */
import React, { FC, useEffect } from 'react';
import {
  Image, View, StyleSheet, LayoutChangeEvent,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '~/beinComponents/Button';
import { margin } from '~/theme/spacing';
import Tab from '~/baseComponents/Tab';
import { ANIMATED_EMOJI, STATIC_EMOJI } from '~/resources/emoji';
import { useBaseHook } from '~/hooks';

export interface ReactionViewProps {
  onPressReaction: (key: string) => void;
}

const ITEM_SIZE = 40;
const MAX_ROWS = 5;

const SelectReactionView: FC<ReactionViewProps> = ({
  onPressReaction,
}: ReactionViewProps) => {
  const { t } = useBaseHook();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Initial rows = 4
  const [contentHeight, setContentHeight] = React.useState(ITEM_SIZE * 4)
  const [data, setData] = React.useState<any>(STATIC_EMOJI);
  const tabData = [
    { id: 'tab_select_reaction_static', text: t('common:text_static') },
    { id: 'tab_select_reaction_animated', text: t('common:text_animated') },
  ];

  useEffect(() => {
    const _data = selectedIndex === 0 ? STATIC_EMOJI : ANIMATED_EMOJI;
    setData(_data);
  }, [selectedIndex])

  const _onPressReaction = (item: string) => {
    onPressReaction?.(item);
  };

  const renderItem = (item: any) => (
    <Button
      key={`select_reaction_${item}`}
      testID={`select_reaction_view.item_${item}`}
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
        style={[styles.tabContainter, { height: contentHeight }]}
        onLayout={onLayout}
      >
        <ScrollView style={styles.list}>
          <View style={styles.listContainer}>
            {Object.keys(data).map((item, index) => renderItem(item))}
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
  },
  tabContainter: {
    flex: 1,
    maxHeight: ITEM_SIZE * MAX_ROWS,
  },
  list: {
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
