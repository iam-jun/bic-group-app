import React, { ReactElement } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Button } from '~/baseComponents';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title: string;
  rightTitle?: ReactElement;
  children: React.ReactNode;

  onEdit?: () => void;
}

const InfoCard = ({
  style, testID = 'info_card', title, rightTitle, children, onEdit,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.row}>
        <Text.H4 testID="info_card.title" useI18n>
          {title}
        </Text.H4>
        {rightTitle}
        {onEdit && (
          <Button.Secondary
            testID="info_card.button_edit"
            type="ghost"
            icon="PenToSquareSolid"
            size="small"
            onPress={onEdit}
          />
        )}
      </View>
      <View style={style}>
        {children}
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: spacing.margin.large,
    },
  });
};

export default InfoCard;
