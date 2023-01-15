import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import UnsupportFeatureSvg from '~/../assets/images/unsupport_feature.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import Header from '~/beinComponents/Header';

const UnsupportFeature = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const onPressBack = () => {
    rootNavigation.goBack();
  };

  return (
    <View testID="unsupport_feature" style={styles.container}>
      <Header title={t('common:btn_go_back')} onPressBack={onPressBack} />
      <View style={styles.content}>
        <SVGIcon source={UnsupportFeatureSvg} size={100} />
        <Text.BodyS style={styles.text} useI18n>
          common:text_unsupport_feature
        </Text.BodyS>
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
      paddingTop: spacing.padding.extraLarge * 2,
      paddingHorizontal: spacing.padding.xSmall * 3,
      alignItems: 'center',
      backgroundColor: colors.white,
      flex: 1,
    },
    text: {
      textAlign: 'center',
      marginTop: spacing.margin.large,
    },
  });
};

export default UnsupportFeature;
