import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useBaseHook } from '~/hooks';
import useCreateArticleStore from '../../store';
import PreviewSection from '../../components/PreviewSection';
import { spacing } from '~/theme';
import Tag from '~/baseComponents/Tag';

type CategorySectionProps = {
  onPress: () => void;
};

const CategorySection: FC<CategorySectionProps> = ({ onPress }) => {
  const { t } = useBaseHook();
  const styles = createStyle();

  const categories = useCreateArticleStore((state) => state.data.categories);

  const renderContent = () => {
    if (!categories || categories.length === 0) return null;

    return (
      <View style={styles.tagContainer}>
        {categories.map((category) => (
          <View style={styles.tagView} key={`tagview-${category.id}`}>
            <Tag
              style={styles.tag}
              type="neutral"
              size="medium"
              label={category.name}
              textProps={{ numberOfLines: 1 }}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View>
      <PreviewSection
        title={t('article:text_option_edit_category')}
        onPress={onPress}
        placeholder={t('article:text_add_category')}
        content={renderContent()}
      />
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagView: {
    marginBottom: spacing.margin.small,
    marginRight: spacing.margin.xSmall,
  },
  tag: {
    alignSelf: 'baseline',
  },
});

export default CategorySection;
