import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import completeSvg from '../../../../../../assets/images/settings_change_password_complete.svg';
import {authStack} from '~/configs/navigator';

import {useBaseHook} from '~/hooks';
import spacing from '~/theme/spacing';

const CompleteChangePassword = () => {
  const {t, navigation} = useBaseHook();
  const dimensions = useWindowDimensions();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const imgMaxWidth = 500;
  const imgPadding = 67;
  let imgSize = dimensions.width - 2 * imgPadding;
  if (imgSize > imgMaxWidth) imgSize = imgMaxWidth;

  return (
    <ScreenWrapper testID="CompleteChangePassword" isFullView>
      <View style={styles.container}>
        <SVGIcon
          style={styles.svg}
          // @ts-ignore
          source={completeSvg}
          size={imgSize}
        />
        <View style={styles.textContainer}>
          <Text.H6>{t('auth:text_change_password_complete_title')}</Text.H6>
          <Text.BodyM>
            {t('auth:text_change_password_complete_desc')}
          </Text.BodyM>
        </View>
        <Button.Primary
          testID="btnComplete"
          style={styles.btn}
          onPress={() => navigation.navigate(authStack.login)}>
          {t('auth:btn_back_to_login')}
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

export default CompleteChangePassword;

const themeStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      alignContent: 'center',
      paddingTop: spacing.padding.big,
      paddingBottom: spacing.padding.big,
      paddingHorizontal: spacing.padding.big,
      backgroundColor: colors.white,
    },
    svg: {
      marginVertical: spacing.margin.big || 24,
      alignSelf: 'center',
    },
    textContainer: {
      paddingTop: spacing.padding.large,
      marginBottom: spacing.margin.big,
    },
    btn: {
      marginTop: spacing.margin.big,
    },
  });
};
