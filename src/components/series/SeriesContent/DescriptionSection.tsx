import { useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import Text from '~/baseComponents/Text';
import { getTextHighlight } from '~/components/articles/ArticleText/helper';
import { spacing } from '~/theme';

type DescriptionSectionProps = {
  style?: StyleProp<ViewStyle>;
  description?: string;
};

const DescriptionSection: FC<DescriptionSectionProps> = ({
  description,
  style,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  if (!description) return null;

  const lstText = getTextHighlight(description);

  return (
    <View testID="series_detail_header.description" style={[styles.container, style]}>
      <Text.BodyM color={colors.neutral40}>
        {lstText.map((item) => (
          <Text.BodyM
            key={`${item.id}`}
            style={{ backgroundColor: item.isHighlight && colors.highlight }}
          >
            {item.text}
          </Text.BodyM>
        ))}
      </Text.BodyM>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.margin.small,
  },
});

export default DescriptionSection;
