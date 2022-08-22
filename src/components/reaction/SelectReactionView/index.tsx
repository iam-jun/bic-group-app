/* eslint-disable import/no-dynamic-require */
import React, { FC, useEffect } from 'react';
import {
  Image, View, StyleSheet, LayoutChangeEvent,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '~/beinComponents/Button';
import { margin, padding } from '~/theme/spacing';
import Tab from '~/baseComponents/Tab';
import { ANIMATED_EMOJI, STATIC_EMOJI } from '~/resources/emoji';
import { useBaseHook } from '~/hooks';
import { dimension } from '~/theme';

export interface ReactionViewProps {
  onPressReaction: (key: string) => void;
}

const MAX_ROWS = 5;
const NUM_COLUMNS = 8;

const SelectReactionView: FC<ReactionViewProps> = ({
  onPressReaction,
}: ReactionViewProps) => {
  const { t } = useBaseHook();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const ITEM_SIZE = dimension.deviceWidth / NUM_COLUMNS;
  const EMOJI_SIZE = ITEM_SIZE - padding.small * 2;

  // Initial rows = 4
  const [contentHeight, setContentHeight] = React.useState(ITEM_SIZE * 4);
  const [data, setData] = React.useState<any>(STATIC_EMOJI);
  const tabData = [
    { id: 'tab_select_reaction_static', text: t('common:text_static') },
    { id: 'tab_select_reaction_animated', text: t('common:text_animated') },
  ];

  useEffect(() => {
    const _data = selectedIndex === 0 ? STATIC_EMOJI : ANIMATED_EMOJI;
    setData(_data);
  }, [selectedIndex]);

  const _onPressReaction = (item: string) => {
    onPressReaction?.(item);
  };

  const renderItem = (item: any) => (
    <Button
      key={`select_reaction_${item}`}
      testID={`select_reaction_view.item_${item}`}
      style={[styles.item, { width: ITEM_SIZE, height: ITEM_SIZE }]}
      onPress={() => _onPressReaction(item)}
    >
      <Image style={[styles.icon, { width: EMOJI_SIZE }]} resizeMode="contain" source={data[item]} />
    </Button>
  );

  const onPressTab = (_, index:number) => {
    setSelectedIndex(index);
  };

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
        style={[styles.tabContainter, { height: contentHeight, maxHeight: ITEM_SIZE * MAX_ROWS }]}
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
  },
  list: {
    marginTop: margin.tiny,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Needed for wrapping for the items
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: padding.small,
  },
  icon: {
    aspectRatio: 1,
  },
});

export default SelectReactionView;
