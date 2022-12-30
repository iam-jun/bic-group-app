import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useBaseHook } from '~/hooks';
import useCreateArticleStore from '../../store';
import PreviewSection from '../../components/PreviewSection';
import { spacing } from '~/theme';
import Tag from '~/baseComponents/Tag';

type TagsSectionProps = {
  onPress: () => void;
};

const TagsSection: FC<TagsSectionProps> = ({ onPress }) => {
  const { t } = useBaseHook();
  const styles = createStyle();

  const tags = useCreateArticleStore((state) => state.data.tags);

  const renderContent = () => {
    if (!tags || tags.length === 0) return null;

    return (
      <View style={styles.tagContainer}>
        {tags.map((tag) => (
          <View style={styles.tagView} key={`tagview-${tag.id}`}>
            <Tag
              style={styles.tag}
              type="neutral"
              size="medium"
              label={tag.name}
              textProps={{ numberOfLines: 1 }}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: 'blue' }}>
      <PreviewSection
        title={t('article:text_option_edit_tags')}
        optional
        onPress={onPress}
        placeholder={t('article:text_add_tag')}
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

export default TagsSection;
