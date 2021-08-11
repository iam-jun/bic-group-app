import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import useMenu from '~/hooks/menu';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import {IconType} from '~/resources/icons';

const AboutProfile = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();

  const menuData = useMenu();
  const {userProfile} = menuData;
  const {email, address, language, phone, isPublic} = userProfile;

  const renderItem = (icon: IconType, label: string) => {
    return (
      <>
        {label && (
          <View style={styles.itemComponent}>
            <Icon icon={icon} tintColor={theme.colors.primary5} size={24} />
            <Text.Body style={styles.text}>{label}</Text.Body>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text.ButtonBase style={styles.about}>
        {t('settings:title_about')}
      </Text.ButtonBase>
      {renderItem('BriefcaseAlt', 'Employer at EVOLGROUP')}
      {!isPublic && renderItem('LocationPoint', address)}
      {renderItem('CommentsAlt', language)}
      {!isPublic && renderItem('Phone', phone)}
      {!isPublic && renderItem('Envelope', email)}
    </View>
  );
};

export default AboutProfile;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.small,
    },
    itemComponent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.small,
    },
    about: {
      marginBottom: spacing.margin.small,
    },
    icon: {},
    text: {marginLeft: spacing.margin.large},
  });
};
