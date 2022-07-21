import RNDateTimePicker from 'react-native-modal-datetime-picker';

import React, { FC } from 'react';
import DatePickerComponentProps from '~/beinComponents/DateTimePicker/DatePickerComponentProps';

const DatePickerComponent: FC<DatePickerComponentProps> = ({
  isVisible = false,
  date,
  onConfirm,
  onCancel,
  mode,
  minDate,
  maxDate,
  ...props
}: DatePickerComponentProps) => (
  <RNDateTimePicker
    isVisible={isVisible}
    onConfirm={onConfirm}
    onCancel={onCancel}
    mode={mode}
    date={date}
    minimumDate={minDate}
    maximumDate={maxDate}
    {...props}
  />
);
export default DatePickerComponent;
