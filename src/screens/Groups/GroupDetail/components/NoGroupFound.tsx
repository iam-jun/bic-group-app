import React from 'react';
import {Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
import {useRootNavigation} from '~/hooks/navigation';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import Button from '~/beinComponents/Button';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import NoGroupFoundImg from '~/../assets/images/no_group_found.svg';
import {deviceDimensions} from '~/theme/dimension';

const NoGroupFound = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const onPressBack = () => rootNavigation.navigate(groupStack.groups);

  return (
    <ScreenWrapper style={styles.root} isFullView>
      <Header
        title={i18next.t('error:no_group_found_title')}
        hideBackOnLaptop
      />
      <View style={styles.mainContainer} testID="no_group_found">
        <SVGIcon
          // @ts-ignore
          source={NoGroupFoundImg}
          width={250}
          height={200}
          tintColor="none"
        />
        <View style={styles.description}>
          <Text.H6>{i18next.t('error:no_group_found_desc')}</Text.H6>
          <Text.Body>{i18next.t('error:no_group_found_second_desc')}</Text.Body>
        </View>
        {!isLaptop && (
          <Button.Primary testID="no_group_found.back" onPress={onPressBack}>
            {i18next.t('error:button_back_to_safety')}
          </Button.Primary>
        )}
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    root: {
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.placeholder,
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
