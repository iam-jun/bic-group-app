import React, { FC } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Checkbox from '~/baseComponents/Checkbox';

import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';

export interface ItemCheckboxProps {
  data: any;
  isChecked?: boolean;
  disabled?: boolean;
  onRemoveItem?: (item: any) => void;
  onAddItem?: (item: any) => void;
  testIDCheckbox?: string;
  testIDItem?: string;
}

const ItemCheckbox: FC<ItemCheckboxProps> = ({
  data, isChecked, disabled = false, onRemoveItem, onAddItem, testIDCheckbox, testIDItem,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { name } = data || {};

  const onChange = (isChecked) => {
    if (isChecked) {
      onAddItem?.(data);
    } else {
      onRemoveItem?.(data);
    }
  };

  return (
    <View testID={testIDItem} style={styles.container}>
      <Text testID="item_checkbox.text" style={styles.textName}>{name}</Text>
      <Checkbox
        testID={testIDCheckbox}
        isChecked={isChecked}
        disabled={disabled ? 'disabled' : undefined}
        onPress={onChange}
      />
    </View>
  );
};

const createStyle = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.padding.base,
    paddingHorizontal: spacing.padding.large,
  },
  textName: {
    flex: 1,
  },
});

export default ItemCheckbox;
