import {StyleProp, ViewStyle} from 'react-native';

interface DatePickerComponentProps {
  style?: StyleProp<ViewStyle>;
  value: Date;
  onChange: ({
    event,
    value,
  }: {
    event: 'set' | 'dismissed' | string;
    value: Date;
  }) => void;
}

export default DatePickerComponentProps;
