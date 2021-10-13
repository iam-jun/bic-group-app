import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';

import SettingItem from '~/screens/Menu/AccountSettings/EditBasicInfo/fragments/SettingItem';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

const EditContact = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const myProfile = useKeySelector(menuKeySelector.myProfile);
  const {email, phone, address} = myProfile || {};

  const goToEditEmail = () => {
    rootNavigation.navigate(mainStack.editEmail);
  };

  return (
    <ScreenWrapper testID="EditContact" isFullView>
      <Header
        titleTextProps={{useI18n: true}}
        title={'settings:title_edit_contact'}
      />

      <View style={styles.infoItem}>
        <SettingItem
          title={'settings:title_email'}
          subtitle={email || i18next.t('common:text_not_set')}
          leftIcon={'EnvelopeAlt'}
          rightIcon={'EditAlt'}
          onPress={goToEditEmail}
        />
        <SettingItem
          title={'settings:title_phone_number'}
          subtitle={phone || i18next.t('common:text_not_set')}
          leftIcon={'Phone'}
          rightIcon={'EditAlt'}
        />
        <SettingItem
          title={'settings:title_address'}
          subtitle={address || i18next.t('common:text_not_set')}
          leftIcon={'LocationPoint'}
          rightIcon={'EditAlt'}
        />
      </View>
      <Divider style={styles.divider} />
    </ScreenWrapper>
  );
};

export default EditContact;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    infoItem: {
      marginHorizontal: spacing.margin.tiny,
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
  });
};
