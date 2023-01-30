import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useBaseHook } from '~/hooks';
import PreviewSection from '../../components/PreviewSection';
import { spacing } from '~/theme';
import Tag from '~/baseComponents/Tag';
import postsSelector from '~/store/entities/posts/selectors';
import usePostsStore from '~/store/entities/posts';
import { IPost, IPostAudience } from '~/interfaces/IPost';

type AudienceSectionProps = {
  articleId: string;
  onPress: () => void;
};

const AudienceSection: FC<AudienceSectionProps> = ({ articleId, onPress }) => {
  const { t } = useBaseHook();
  const styles = createStyle();

  const article: IPost = usePostsStore(postsSelector.getPost(articleId));
  const { audience } = article || ({} as IPost);
  const { groups } = audience || ({} as IPostAudience);

  const renderContent = () => {
    if (!groups || groups.length === 0) return null;

    return (
      <View style={styles.tagContainer}>
        {groups.map((group) => (
          <View style={styles.tagView} key={`tagview-${group.id}`}>
            <Tag
              style={styles.tag}
              type="secondary"
              size="medium"
              label={group.name}
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
        title={t('article:text_option_edit_audience')}
        onPress={onPress}
        placeholder={t('article:text_add_audience')}
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

export default AudienceSection;
