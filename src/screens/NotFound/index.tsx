import i18next from 'i18next';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Button from '~/beinComponents/Button';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';

import spacing from '~/theme/spacing';
import NotFoundImg from '../../../assets/images/error_404.svg';

const NotFound = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const dimensions = useWindowDimensions();

  const imgMaxWidth = 328;
  const imgPadding = spacing.margin.base || 12;
  let imgSize = dimensions.width - 2 * imgPadding;
  if (imgSize > imgMaxWidth) imgSize = imgMaxWidth;

  const onPressGoBack = () => {
    // alert('Pressed "Go back"');
  };

  return (
    <ScreenWrapper isFullView style={styles.container}>
      <View style={styles.contentContainer}>
        <SVGIcon source={NotFoundImg} size={imgSize} />
        <Text.BodyM style={styles.desc}>
          {i18next.t('error:not_found_desc')}
        </Text.BodyM>
        <Button.Secondary
          style={styles.button}
          highEmphasis
          onPress={onPressGoBack}
          textVariant="h6"
        >
          {i18next.t('error:button_not_found')}
        </Button.Secondary>
      </View>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.neutral1,
    },
    contentContainer: {
      maxWidth: 328,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    desc: {
      marginVertical: spacing.margin.base,
      textAlign: 'center',
    },
    button: {
      padding: spacing.margin.base,
      paddingTop: spacing.margin.small,
    },
  });
};

export default NotFound;
