import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import EditAction from './EditAction';

type PreviewSectionProps = {
    title: string;
    optional?: boolean;
    onPress: () => void;
    placeholder: string;
    content: ReactElement;
}

const PreviewSection: FC<PreviewSectionProps> = ({
  title, optional, onPress, placeholder, content,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text.H4 color={colors.neutral80}>{title}</Text.H4>
        {optional && <Text.H4 style={styles.textOptional} color={colors.neutral20}>{`(${t('common:text_optional')})`}</Text.H4>}
      </View>
      <View style={styles.content}>
        {!!content ? content : <Text.BodyM color={colors.neutral20}>{placeholder}</Text.BodyM>}
      </View>
      <EditAction type={!!content ? 'edit' : 'add'} onPress={onPress} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.extraLarge,
      paddingHorizontal: spacing.padding.large,
      ...elevations.e2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textOptional: {
      marginLeft: spacing.margin.tiny,
    },
    content: {
      marginTop: spacing.margin.large,
    },
  });
};

export default PreviewSection;
