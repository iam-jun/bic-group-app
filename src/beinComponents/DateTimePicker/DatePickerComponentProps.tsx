import { StyleProp, ViewStyle } from 'react-native';

interface DatePickerComponentProps {
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
