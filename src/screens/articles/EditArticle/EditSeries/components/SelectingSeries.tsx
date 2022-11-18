import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import Tag from '~/baseComponents/Tag';
import { IEditArticleSeries } from '~/interfaces/IArticle';

interface Props {
  data: IEditArticleSeries[],
  onRemoveItem: (item: IEditArticleSeries)=>void,
}

const SelectingSeries = ({ data, onRemoveItem }: Props) => {
  const theme: ExtendedTheme = useTheme();

  const renderItem = (item, index) => {
    const { title } = item;
    return (
      <Tag
        key={`tag_${item?.id || index}`}
        style={styles.tabStyle}
        textProps={{ style: { color: theme.colors.neutral60, flexShrink: 1 }, numberOfLines: 1 }}
        size="large"
        type="neutral"
        label={title}
        onPressIcon={() => onRemoveItem?.(item)}
        icon="Xmark"
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text.SubtitleL useI18n>
        article:text_selecting_categories
      </Text.SubtitleL>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data?.map?.(renderItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
  },
  tabStyle: {
    marginTop: spacing.margin.xSmall,
    paddingHorizontal: spacing.padding.tiny,
  },
});

export default SelectingSeries;
