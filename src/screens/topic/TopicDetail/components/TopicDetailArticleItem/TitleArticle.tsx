import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';

interface TitleArticleProps {
    title: string;
}

const TitleArticle: React.FC<TitleArticleProps> = ({ title }) => {
  const theme = useTheme();
  const { colors } = theme;

  const onPressMenu = () => {
    // do something
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxTitle}>
        <Text.H4 color={colors.neutral60} numberOfLines={2}>
          {title}
        </Text.H4>
      </View>
      <Button.Raise
        icon="menu"
        size="small"
        onPress={onPressMenu}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  boxTitle: {
    flex: 1,
    marginRight: spacing.margin.xSmall,
  },
});

export default TitleArticle;
