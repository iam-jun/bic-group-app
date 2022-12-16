import React, { FC } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Checkbox from '~/baseComponents/Checkbox';

import Text from '~/baseComponents/Text';
import { ICategory } from '~/interfaces/IArticle';
import spacing from '~/theme/spacing';

export interface ArticleSelectingInfoProps {
  data: any;
  isChecked?: boolean;
  disabled?: boolean;
  onRemoveItem?: (category: ICategory) => void;
  onAddItem?: (category: ICategory) => void;
}

const ArticleSelectingInfo: FC<ArticleSelectingInfoProps> = ({
  data, isChecked, disabled = false, onRemoveItem, onAddItem,
}: ArticleSelectingInfoProps) => {
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
    <View testID="aritcles.slecting_info_item" style={styles.container}>
      <Text testID="aritcles.slecting_info_item.text" style={styles.textName}>{name}</Text>
      <Checkbox
        testID="aritcles.slecting_info_item.checkbox"
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

export default ArticleSelectingInfo;
