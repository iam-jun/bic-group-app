import React, {FC} from 'react';
import DatePickerComponentProps from '~/beinComponents/DateTimePicker/DatePickerComponentProps';
import DatePickerComponent from '~/beinComponents/DateTimePicker/DatePickerComponent';

const DateTimePicker: FC<DatePickerComponentProps> = (
  props: DatePickerComponentProps,
) => {
  // @ts-ignore
  return <DatePickerComponent {...props} />;
};

export default DateTimePicker;
