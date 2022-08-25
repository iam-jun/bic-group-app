import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import { CheckBox } from '~/baseComponents';

export interface SelectAllAudienceProps {
  style?: StyleProp<ViewStyle>;
}

const SelectAllAudience: FC<SelectAllAudienceProps> = ({ style }: SelectAllAudienceProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Text.BodyMMedium style={{ flex: 1 }} useI18n>
        post:text_select_all_audience
      </Text.BodyMMedium>
      <CheckBox />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginTop: spacing.margin.base,
      marginBottom: 20,
    },
  });
};

export default SelectAllAudience;
