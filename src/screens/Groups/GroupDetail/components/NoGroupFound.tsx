import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
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

const NoGroupFound = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const navigation = useNavigation();

  return (
    <ScreenWrapper style={styles.root} isFullView>
      <Header title={i18next.t('error:no_group_found_title')} />
      <View style={styles.mainContainer}>
        <SVGIcon
          // @ts-ignore
          source={NoGroupFoundImg}
          width={250}
          height={200}
          tintColor="none"
        />
        <Text>{i18next.t('error:no_group_found_desc')}</Text>
        <Text>{i18next.t('error:no_group_found_second_desc')}</Text>
        <Button.Primary onPress={() => navigation.navigate(groupStack.groups)}>
          {i18next.t('error:button_back_to_safety')}
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;
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
  });
};

export default NoGroupFound;
