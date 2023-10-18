import React, { FC, PropsWithChildren } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import { Button } from '~/baseComponents';

type SelectionBoxProps = {
  placeholder: string;
  isShowCaret?: boolean;
  onPress: () => void;
};

const SelectionBox: FC<PropsWithChildren<SelectionBoxProps>> = ({
  placeholder,
  isShowCaret = false,
  onPress,
  children,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const renderPlaceholder = () => (
    <View style={styles.placeholderView}>
      <Text.DropdownM useI18n color={colors.neutral20}>{placeholder}</Text.DropdownM>
      {isShowCaret && (
        <Icon icon="AngleDown" size={16} tintColor={colors.neutral40} />
      )}
    </View>
  );

  return (
    <Button testID="selection_box.btn" style={styles.container} onPress={onPress}>
      {!!children ? children : renderPlaceholder()}
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      minHeight: 40,
      borderRadius: spacing.borderRadius.base,
      borderWidth: 1,
      borderColor: colors.neutral5,
      padding: spacing.padding.small,
    },
    placeholderView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
};

export default SelectionBox;
