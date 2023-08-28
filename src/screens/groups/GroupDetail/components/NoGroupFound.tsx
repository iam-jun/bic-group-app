import i18next from 'i18next';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import NoGroupFoundImg from '~/../assets/images/no_group_found.svg';
import Button from '~/beinComponents/Button';
import Header from '~/beinComponents/Header';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';

const NoGroupFound = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const onPressBack = () => rootNavigation.navigate(groupStack.communities);

  return (
    <ScreenWrapper style={styles.root} isFullView>
      <Header title={i18next.t('error:no_group_found_title')} />
      <View style={styles.mainContainer} testID="no_group_found">
        <SVGIcon
          source={NoGroupFoundImg}
          width={250}
          height={200}
          tintColor="none"
        />
        <View style={styles.description}>
          <Text.H6>{i18next.t('error:no_group_found_desc')}</Text.H6>
          <Text.BodyM>
            {i18next.t('error:no_group_found_second_desc')}
          </Text.BodyM>
        </View>
        <Button.Primary testID="no_group_found.back" onPress={onPressBack}>
          {i18next.t('error:button_back_to_safety')}
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    root: {
      backgroundColor: colors.neutral5,
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    description: {
      marginBottom: spacing.margin.large,
      alignItems: 'center',
    },
  });
};

export default NoGroupFound;
