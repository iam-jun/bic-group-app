import React, { FC } from 'react';
import { View } from 'react-native';
import { isEmpty } from 'lodash';
import { useBaseHook } from '~/hooks';
import useCreateArticleStore from '../../store';
import PreviewSection from '../../components/PreviewSection';
import { EMPTY_ARTICLE_CONTENT } from '~/constants/article';

type ContentSectionProps = {
  onPress: () => void;
};

const ContentSection: FC<ContentSectionProps> = ({ onPress }) => {
  const { t } = useBaseHook();

  const content = useCreateArticleStore((state) => state.data.content);

  const isEmptyContent = isEmpty(content) || content === JSON.stringify(EMPTY_ARTICLE_CONTENT);

  const renderContent = () => {
    if (isEmptyContent) return null;
    return <View />;
  };

  return (
    <View>
      <PreviewSection
        title={t('article:text_option_edit_content')}
        onPress={onPress}
        placeholder={t('article:text_add_content')}
        content={renderContent()}
      />
    </View>
  );
};

export default ContentSection;
