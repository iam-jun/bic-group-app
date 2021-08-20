import React, {FC} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import DatePickerComponentProps from '~/beinComponents/DateTimePicker/DatePickerComponentProps';

const DatePickerComponent: FC<DatePickerComponentProps> = ({
  date,
  onConfirm,
  onCancel,
  mode,
  minDate,
  maxDate,
  ...props
}: DatePickerComponentProps) => {
  const onChange = (data?: any) => {
    onConfirm?.(data);
  };

  const onClickOutside = () => {
    onCancel?.();
  };

  return (
    <DatePicker
      selected={date}
      onChange={onChange}
      onClickOutside={onClickOutside}
      showTimeSelect={mode === 'time'}
      minDate={minDate}
      maxDate={maxDate}
      inline
      {...props}
    />
  );
};

export default DatePickerComponent;
