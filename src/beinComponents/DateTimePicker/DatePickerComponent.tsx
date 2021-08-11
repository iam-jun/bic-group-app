import RNDateTimePicker from 'react-native-modal-datetime-picker';

import React, {FC} from 'react';
import DatePickerComponentProps from '~/beinComponents/DateTimePicker/DatePickerComponentProps';

const DatePickerComponent: FC<DatePickerComponentProps> = ({
  isVisible = false,
  date,
  onConfirm,
  onCancel,
  mode,
  ...props
}: DatePickerComponentProps) => {
  // @ts-ignore
  return (
    <RNDateTimePicker
      isVisible={isVisible}
      onConfirm={onConfirm}
      onCancel={onCancel}
      mode={mode}
      date={date}
      {...props}
    />
  );
};

export default DatePickerComponent;
