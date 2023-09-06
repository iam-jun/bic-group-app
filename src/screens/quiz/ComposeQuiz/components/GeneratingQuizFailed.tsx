import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import Image from '~/components/Image';
import images from '~/resources/images';

type GeneratingQuizFailedProps = {
  onPressRegenerate: () => void;
};

const GeneratingQuizFailed: FC<GeneratingQuizFailedProps> = ({
  onPressRegenerate,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  return (
    <View testID="generating_quiz_failed" style={styles.container}>
      <Image style={styles.img} source={images.img_error} />
      <Text.H5 useI18n color={colors.neutral40} style={styles.centerText}>
        quiz:something_went_wrong
      </Text.H5>
      <Text.BodyM useI18n color={colors.neutral60} style={styles.centerText}>
        quiz:sorry_an_error_has_occurred
      </Text.BodyM>
      <ViewSpacing height={spacing.margin.extraLarge} />
      <Button.Primary testID="generating_quiz_failed.btn_regenerate" useI18n icon="RotateSolid" onPress={onPressRegenerate}>
        quiz:regenerate
      </Button.Primary>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerText: {
      textAlign: 'center',
    },
    img: {
      width: 145,
      height: 145,
    },
  });
};

export default GeneratingQuizFailed;
