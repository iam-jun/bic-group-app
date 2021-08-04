import React, {FC} from 'react';
import DatePickerComponentProps from '~/beinComponents/DateTimePicker/DatePickerComponentProps';
import DatePickerComponent from '~/beinComponents/DateTimePicker/DatePickerComponent';

export interface DateTimePickerProps extends DatePickerComponentProps {
  mode?: 'date' | 'time';
}

const DateTimePicker: FC<DateTimePickerProps> = ({
  mode,
  ...props
}: DateTimePickerProps) => {
  // @ts-ignore
  return <DatePickerComponent mode={mode} {...props} />;
};

export default DateTimePicker;
