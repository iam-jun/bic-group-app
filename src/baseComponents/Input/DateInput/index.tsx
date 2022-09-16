import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  KeyboardTypeOptions,
  View,
  TouchableOpacity,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { fontFamilies } from '~/theme/fonts';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import Icon from '~/baseComponents/Icon';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import { formatDate } from '~/utils/formatData';

interface DateInputProps {
  mode: 'date' | 'time';
  testID?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  label?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions | undefined;
  value?: string;
  textInputRef?: React.Ref<View>;
  textColor?: string;
  outlineColor?: string;
  iconColor?: string;
  minDate?: Date;
  maxDate?: Date;
  onConfirm: (date: Date) => void;
}

const DateInput: React.FC<DateInputProps> = ({
  mode,
  testID,
  label,
  style,
  inputStyle,
  placeholder,
  value,
  textColor,
  outlineColor,
  iconColor,
  minDate,
  maxDate,
  onConfirm,
}: DateInputProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme, textColor);
  const [text, setText] = useState<string>(() => {
    if (!!value) {
      if (mode === 'date') {
        return formatDate(value, 'DD/MM/YYYY');
      }
      return formatDate(value, 'hh:mm A', undefined, 9999);
    }
    if (mode === 'date') return !!placeholder ? placeholder : 'DD/MM/YYYY';
    return !!placeholder ? placeholder : 'HH:MM';
  });
  const [isSelecting, setSelecting] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'date') {
      setText(formatDate(value, 'DD/MM/YYYY'));
    } else {
      setText(formatDate(value, 'hh:mm A', undefined, 9999));
    }
  }, [value]);

  const getIcon = () => {
    if (mode === 'date') return 'Calendar';
    return 'Clock';
  };

  const _onPress = () => {
    setSelecting(true);
  };

  const _onConfirm = (date: Date) => {
    onConfirm(date);
    // if (mode === 'date') {
    //   const newDate = formatDate(date, 'DD/MM/YYYY');
    //   setText(newDate);
    // } else {
    //   const newDate = formatDate(date, 'hh:mm A', undefined, 9999);
    //   setText(newDate);
    // }
    _onClosePopup();
  };

  const _onClosePopup = () => {
    setSelecting(false);
  };

  return (
    <View testID="date_input" style={[styles.container, style]}>
      {!!label && (
        <Text.LabelM color={colors.neutral80} style={styles.labelStyle}>
          {label}
        </Text.LabelM>
      )}
      <TouchableOpacity
        testID={testID}
        onPress={_onPress}
        style={[
          styles.row,
          { borderColor: outlineColor || colors.neutral5 },
          inputStyle,
        ]}
      >
        <Text.BodyM color={colors.neutral40}>{text}</Text.BodyM>
        <Icon
          icon={getIcon()}
          size={24}
          tintColor={iconColor || colors.neutral40}
        />
      </TouchableOpacity>
      <View style={{ position: 'absolute', alignSelf: 'center' }}>
        {isSelecting && (
          <DateTimePicker
            testID="date_input.date_picker"
            isVisible={isSelecting}
            date={!!value ? new Date(value) : new Date()}
            minDate={minDate}
            maxDate={maxDate}
            mode={mode}
            onConfirm={_onConfirm}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onCancel={_onClosePopup}
          />
        )}
      </View>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme, textColor?: string) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      marginVertical: spacing?.margin.tiny,
    },
    row: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: spacing.borderRadius.base,
      paddingRight: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
      justifyContent: 'space-between',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      height: 40,
      paddingHorizontal: spacing.padding.large,
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
      flex: 1,
    },
    defaultStyle: {
      color: textColor || colors.neutral80,
    },
    labelStyle: {
      marginBottom: spacing.margin.small,
    },
  });
};

export default React.memo(DateInput);
