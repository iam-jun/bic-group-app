import React from 'react';
import {ScrollView} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';

import {SortableItem} from './SortableItem';

interface SortableListProps {
  children: any;
  item: {width: number; height: number};
  onChange?: (newIndex: number[]) => void;
}

export const SortableList = ({
  children,
  item: {height, width},
  onChange,
}: SortableListProps) => {
  const offsets = children.map((item: any, index: number) => ({
    y: useSharedValue(index * height),
    index,
  }));

  const onEnd = () => {
    const sortedOffsets = offsets.sort(
      (a: any, b: any) => a.y?.value - b.y?.value,
    );
    const newIndex = sortedOffsets.map((o: any) => o.index);
    onChange?.(newIndex);
  };
  return (
    <ScrollView contentContainerStyle={{height: height * children.length}}>
      {children.map((child: any, index: number) => (
        <SortableItem
          key={index}
          {...{offsets, index, item: {height, width}}}
          onEnd={onEnd}>
          {child}
        </SortableItem>
      ))}
    </ScrollView>
  );
};
