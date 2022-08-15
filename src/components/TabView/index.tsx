import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useCallback } from 'react';
import {
  StyleSheet, FlatList, ListRenderItem, View,
} from 'react-native';
import PillTabButton from '~/baseComponents/Tab/PillTabButton';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';

export type TabItem = {
    key: string;
    title: string;
}

type TabViewProps = {
    data: TabItem[];
    selectedIndex: number;
    onTabPress: (index: number) => void;
}

const keyExtractor = (item: TabItem) => `tabitem-${item.key}`;

const renderSpaceComponent = (styles) => () => <View style={styles.spaceView} />

const Index: FC<TabViewProps> = (props) => {
  const { data, selectedIndex, onTabPress } = props;
  const theme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);

  const renderItem: ListRenderItem<TabItem> = useCallback(({ item, index }) => (
    <PillTabButton
      type="primary"
      isSelected={selectedIndex === index}
      onPress={() => onTabPress(index)}
    >
      {t(item.title)}
    </PillTabButton>
  ), [selectedIndex]);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={renderSpaceComponent(styles)}
      ListFooterComponent={renderSpaceComponent(styles)}
    />
  )
};

const themeStyles = (theme: ExtendedTheme) => StyleSheet.create({
  spaceView: {
    width: spacing.padding.large,
  },
});

export default Index;
