import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import spacing from '~/theme/spacing';

interface TitleComponentProps {
  icon: any;
  title: string;
}

const TitleComponent = ({icon, title}: TitleComponentProps) => {
  const theme = useTheme() as ExtendedTheme;

  return (
    <View style={styles.container}>
      {!!icon && (
        <Icon
          size={24}
          icon={icon}
          tintColor={theme.colors.purple50}
          style={styles.iconStyle}
        />
      )}
      {!!title && <Text.H5 useI18n>{title}</Text.H5>}
    </View>
  );
};

export default TitleComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: spacing.padding.small,
  },
  iconStyle: {
    marginRight: spacing.margin.small,
  },
});
