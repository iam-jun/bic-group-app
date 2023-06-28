import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';

const CheckmarkGenerateRandomQuiz = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle();

  return (
    <Button disabled>
      <View style={styles.container}>
        <Icon icon="SquareCheckSolid" size={22} tintColor={colors.blue50} />
        <ViewSpacing width={spacing.margin.base} />
        <View style={{ flex: 1 }}>
          <Text.BodyS useI18n>quiz:title_check_generate_random_quiz</Text.BodyS>
        </View>
      </View>
    </Button>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default CheckmarkGenerateRandomQuiz;
