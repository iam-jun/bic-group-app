import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import NoContent from '~/../assets/images/no_content.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import Header from '~/beinComponents/Header';
import { Button } from '~/baseComponents';

const ContentUnavailable = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const { rootNavigation, goHome } = useRootNavigation();

  const onPressBack = () => {
    rootNavigation.goBack();
  };

  const onPressGoHome = () => {
    goHome();
  };

  return (
    <View testID="unsupport_feature" style={styles.container}>
      <Header title={t('common:btn_go_back')} onPressBack={onPressBack} />
      <View style={styles.content}>
        <SVGIcon source={NoContent} width={100} height={86} />
        <Text.H4 style={styles.title} useI18n>
          common:content_unavailable:title
        </Text.H4>
        <Text.BodyS style={styles.text} useI18n>
          common:content_unavailable:content
        </Text.BodyS>
        <Button.Primary style={styles.button} onPress={onPressGoHome}>
          {t('common:btn_back_to_home')}
        </Button.Primary>
      </View>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingTop: 69,
      paddingHorizontal: spacing.padding.large,
      alignItems: 'center',
      backgroundColor: colors.white,
      flex: 1,
    },
    title: {
      textAlign: 'center',
      marginTop: spacing.margin.large,
    },
    text: {
      textAlign: 'center',
      marginTop: spacing.margin.tiny,
    },
    button: {
      marginTop: spacing.margin.large,
    },
  });
};

export default ContentUnavailable;
