import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useBaseHook } from '~/hooks';
import useCreateArticleStore from '../../store';
import PreviewSection from '../../components/PreviewSection';
import Text from '~/baseComponents/Text';

type SummarySectionProps = {
  onPress: () => void;
};

const SummarySection: FC<SummarySectionProps> = ({ onPress }) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const summary = useCreateArticleStore((state) => state.data.summary);

  const renderContent = () => {
    if (!summary) return null;
    return <Text.BodyM color={colors.neutral60}>{summary}</Text.BodyM>;
  };

  return (
    <View>
      <PreviewSection
        title={t('article:text_option_edit_summary')}
        optional
        onPress={onPress}
        placeholder={t('article:text_add_summary')}
        content={renderContent()}
      />
    </View>
  );
};

export default SummarySection;
