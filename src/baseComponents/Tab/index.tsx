import {
  View, StyleProp, ViewStyle, StyleSheet,
} from 'react-native'
import React from 'react'

import PillTabButton, { PillTabButtonProps } from './PillTabButton'
import TabButton from './TabButton'

interface TabProps {
  data: { id?: string; text?: string, [x: string|number]: any }[];
  activeIndex?: number;
  type?: 'pill' | 'normal';
  buttonProps?: PillTabButtonProps;
  style?: StyleProp<ViewStyle>;
  onPressTab?: (item: any, index: number) => void;
}

const Tab = ({
  data,
  activeIndex = 0,
  type = 'normal',
  buttonProps,
  style,
  onPressTab,
}: TabProps) => {
  const TabButtonComponent = type === 'normal' ? TabButton : PillTabButton;

  const renderItem = (item: any, index: number) => {
    const isSelected = index === activeIndex

    return (
      <TabButtonComponent
        useI18n
        isSelected={isSelected}
        key={`tab-button-${item?.id || item?.text}`}
        testID={`tab-button-${index}`}
        onPress={() => onPressTab?.(item, index)}
        {...buttonProps}
      >
        {item?.text}
      </TabButtonComponent>
    )
  }

  return (
    <View style={[styles.container, style]}>
      {data?.map?.(renderItem)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default Tab;
