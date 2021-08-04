import RNDateTimePicker from '@react-native-community/datetimepicker';

import React, {FC} from 'react';
import DatePickerComponentProps from '~/beinComponents/DateTimePicker/DatePickerComponentProps';

const DatePickerComponent: FC<DatePickerComponentProps> = ({
  onChange,
  ...props
}: DatePickerComponentProps) => {
  const _onChange = (event: Event, time: Date) => {
    onChange?.({event: event?.type, value: time});
  };
  // @ts-ignore
  return <RNDateTimePicker {...props} onChange={_onChange} />;
};

export default DatePickerComponent;
