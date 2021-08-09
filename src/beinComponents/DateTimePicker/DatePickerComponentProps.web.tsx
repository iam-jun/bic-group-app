import {StyleProp, ViewStyle} from 'react-native';

interface DatePickerComponentProps {
  selected: string;
  onChange: (data: string) => void;
  dateFormat?: string;
  showTimeSelect?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default DatePickerComponentProps;
