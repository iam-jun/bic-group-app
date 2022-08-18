import { View } from 'react-native';
import React from 'react';
import DateTimePicker from '~/beinComponents/DateTimePicker';

interface Props {
  selectingStartDate?: boolean;
  selectingEndDate?: boolean;
  selectedStartDate: any;
  selectedEndDate: any;
  onChangeDatePicker: () => void;
}

const DatePicker = ({
  selectingStartDate,
  selectingEndDate,
  selectedStartDate,
  selectedEndDate,
  onChangeDatePicker,
}: Props) => (
  <View style={{ position: 'absolute', alignSelf: 'center' }}>
    {selectingStartDate && (
    <DateTimePicker
      isVisible={selectingStartDate}
      date={selectedStartDate}
      maxDate={new Date()}
      mode="date"
      onConfirm={onChangeDatePicker}
      onCancel={onChangeDatePicker}
    />
    )}
    {selectingEndDate && (
    <DateTimePicker
      isVisible={selectingEndDate}
      date={selectedEndDate}
      maxDate={new Date()}
      mode="date"
      onConfirm={onChangeDatePicker}
      onCancel={onChangeDatePicker}
    />
    )}
  </View>
);

export default DatePicker;
