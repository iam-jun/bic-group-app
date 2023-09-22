import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';

type ScheduleProps = {
  isValidating: boolean;
  validButton: boolean;
  handleOpenPopupSchedule: () => void;
};

const Schedule: FC<ScheduleProps> = ({
  isValidating,
  validButton,
  handleOpenPopupSchedule,
}) => {
  const styles = createStyle();

  const disabled = !validButton || isValidating;

  return (
    <View style={styles.container}>
      <Button.Primary
        type="ghost"
        icon="CalendarDaysSolid"
        iconSize={14}
        onPress={handleOpenPopupSchedule}
        disabled={disabled}
        loading={isValidating}
      />
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    marginRight: spacing.margin.small,
  },
});

export default Schedule;
