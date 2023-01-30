import {
  StyleProp, ViewStyle, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import React, { useRef } from 'react';

import PillTabButton, { PillTabButtonProps } from './PillTabButton';
import TabButton from './TabButton';

interface TabProps {
  data: { id?: string; text?: string; [x: string | number]: any }[];
  activeIndex?: number;
  type?: 'pill' | 'normal';
  buttonProps?: PillTabButtonProps;
  style?: StyleProp<ViewStyle>;
  isScrollToIndex?: boolean;
  onPressTab?: (item: any, index: number) => void;
}

const Tab = ({
  data,
  activeIndex = 0,
  type = 'normal',
  buttonProps,
  style,
  isScrollToIndex,
  onPressTab,
}: TabProps) => {
  const scrollViewRef = useRef<ScrollView>();
  const TabButtonComponent = type === 'normal' ? TabButton : PillTabButton;

  const onPress = (item: any, index: number) => {
    onPressTab?.(item, index);
    if (isScrollToIndex) {
      scrollViewRef?.current?.scrollTo({ x: Dimensions.get('window').width * index, animated: true });
    }
  };

  function renderItem(item: any, index: number) {
    const isSelected = index === activeIndex;

    return (
      <TabButtonComponent
        useI18n
        isSelected={isSelected}
        key={`tab-button-${item?.id || item?.text}`}
        testID={`tab-button-${item?.text}`}
        onPress={() => onPress(item, index)}
        {...buttonProps}
      >
        {item?.text}
      </TabButtonComponent>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, style]}
      horizontal
      alwaysBounceHorizontal={false}
      showsHorizontalScrollIndicator={false}
      ref={scrollViewRef}
    >
      {data?.map?.(renderItem)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default Tab;
