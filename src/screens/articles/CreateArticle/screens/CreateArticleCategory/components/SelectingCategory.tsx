import React from 'react';
import {
  StyleSheet, View, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Tag from '~/baseComponents/Tag';
import Text from '~/baseComponents/Text';

import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import spacing from '~/theme/spacing';

const SelectingCategory = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const categories = useCreateArticleStore((state) => state.data.categories) || [];
  const actions = useCreateArticleStore((state) => state.actions);

  const renderItem = (item, index) => (
    <Tag
      key={`selecting_category_tag_${item?.id}`}
      style={[{
        marginTop: spacing.margin.small,
        marginLeft: index === 0 ? spacing.margin.large : spacing.margin.small,
        marginRight: index === categories.length - 1 ? spacing.margin.large : 0,
      }]}
      size="large"
      type="secondary"
      label={item.name}
      icon="iconCloseSmall"
      onPressIcon={() => actions.removeCategory(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Text.SubtitleL style={styles.textTitle} useI18n>article:text_selecting_categories</Text.SubtitleL>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map(renderItem)}
      </ScrollView>
    </View>
  );
};

const createStyle = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    paddingBottom: spacing.padding.small,
  },
  textTitle: {
    paddingHorizontal: spacing.padding.large,
  },
});

export default SelectingCategory;
