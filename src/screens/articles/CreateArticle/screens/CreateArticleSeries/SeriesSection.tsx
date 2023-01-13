import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { isEmpty } from 'lodash';
import { useBaseHook } from '~/hooks';
import useCreateArticleStore from '../../store';
import PreviewSection from '../../components/PreviewSection';
import { spacing } from '~/theme';
import Tag from '~/baseComponents/Tag';

type SeriesSectionProps = {
  onPress: () => void;
};

const SeriesSection: FC<SeriesSectionProps> = ({ onPress }) => {
  const { t } = useBaseHook();
  const styles = createStyle();

  const audience = useCreateArticleStore((state) => state.data.audience);
  const series = useCreateArticleStore((state) => state.data.series);

  const hasAudience = !(isEmpty(audience?.groupIds) && isEmpty(audience?.userIds));

  const renderContent = () => {
    if (!series || series.length === 0) return null;

    return (
      <View style={styles.tagContainer}>
        {series.map((item) => (
          <View style={styles.tagView} key={`tagview-${item.id}`}>
            <Tag
              style={styles.tag}
              type="neutral"
              size="medium"
              label={item.title}
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
        title={t('article:text_option_edit_series')}
        optional
        onPress={onPress}
        placeholder={t('article:text_add_series')}
        content={renderContent()}
        disabled={!hasAudience}
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

export default SeriesSection;
