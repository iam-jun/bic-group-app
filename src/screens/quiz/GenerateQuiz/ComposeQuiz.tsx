/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import { GenerateQuizParams } from '~/interfaces/IQuiz';

type ComposeQuizProps = {
  route?: {
    params?: GenerateQuizParams
  };
};

const ComposeQuiz: FC<ComposeQuizProps> = (props) => {
  const { route } = props;
  const { params } = route || {};

  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="quiz:create_quiz"
        buttonProps={{
          disabled: false,
          loading: false,
          style: styles.btnSave,
        }}
        buttonText="common:btn_next"
        onPressButton={() => {}}
        onPressBack={() => {}}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    containerContent: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.large + insets.bottom,
      backgroundColor: colors.white,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
  });
};

export default ComposeQuiz;
