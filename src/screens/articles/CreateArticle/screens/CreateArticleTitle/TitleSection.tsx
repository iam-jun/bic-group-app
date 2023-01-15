import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useBaseHook } from '~/hooks';
import useCreateArticleStore from '../../store';
import PreviewSection from '../../components/PreviewSection';
import Text from '~/baseComponents/Text';

type TitleSectionProps = {
  onPress: () => void;
};

const TitleSection: FC<TitleSectionProps> = ({ onPress }) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const title = useCreateArticleStore((state) => state.data.title);

  const renderContent = () => {
    if (!title) return null;
    return <Text.BodyM color={colors.neutral60}>{title}</Text.BodyM>;
  };

  return (
    <View>
      <PreviewSection
        title={t('article:text_option_edit_title')}
        onPress={onPress}
        placeholder={t('article:text_add_title')}
        content={renderContent()}
      />
    </View>
  );
};

export default TitleSection;
