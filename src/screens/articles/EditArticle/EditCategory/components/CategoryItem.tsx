import React, { FC } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Checkbox from '~/baseComponents/Checkbox';

import Text from '~/baseComponents/Text';
import { ICategory } from '~/interfaces/IArticle';
import spacing from '~/theme/spacing';

export interface CategoryItemProps {
  data: any;
  isChecked?: boolean;
  onRemoveCategory?: (category: ICategory) => void;
  onAddCategory?: (category: ICategory) => void;
}

const CategoryItem: FC<CategoryItemProps> = ({
  data, isChecked, onRemoveCategory, onAddCategory,
}: CategoryItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { name } = data || {};

  const onChange = (isChecked) => {
    if (isChecked) {
      onAddCategory?.(data);
    } else {
      onRemoveCategory?.(data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textName}>{name}</Text>
      <Checkbox isChecked={isChecked} onPress={onChange} />
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

export default CategoryItem;
