import React, {FC} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import DatePickerComponentProps from '~/beinComponents/DateTimePicker/DatePickerComponentProps';

const DatePickerComponent: FC<DatePickerComponentProps> = ({
  onChange,
  ...props
}: DatePickerComponentProps) => {
  return (
    <DatePicker {...props} onChange={data => console.log('time data', data)} />
  );
};

export default DatePickerComponent;
