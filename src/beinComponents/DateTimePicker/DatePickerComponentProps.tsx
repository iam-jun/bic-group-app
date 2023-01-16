import { StyleProp, ViewStyle } from 'react-native';
import { ReactNativeModalDateTimePickerProps } from 'react-native-modal-datetime-picker';

interface DatePickerComponentProps extends ReactNativeModalDateTimePickerProps {
  style?: StyleProp<ViewStyle>;
  isVisible?: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  mode: 'date' | 'time';
  minDate?: Date;
  maxDate?: Date;
  testID?: string;
}

export default DatePickerComponentProps;
