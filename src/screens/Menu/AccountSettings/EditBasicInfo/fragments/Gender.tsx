import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Radio } from '~/baseComponents';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { GENDER_TYPE } from '~/interfaces/IEditUser';

type GenderProps = {
  genderState: GENDER_TYPE;
  disabled?: boolean;
  setGenderState: (gender: GENDER_TYPE) => void;
};

const SPACING = 48;

const Gender: FC<GenderProps> = ({ genderState, disabled, setGenderState }) => (
  <View style={styles.row}>
    <Radio
      useI18n
      testID="settings.male"
      label="settings:text_male"
      isChecked={genderState === GENDER_TYPE.MALE}
      disabled={disabled ? genderState === GENDER_TYPE.MALE ? 'disabled-auto-selected' : 'disabled' : undefined}
      onPress={() => setGenderState(GENDER_TYPE.MALE)}
    />
    <ViewSpacing width={SPACING} />
    <Radio
      useI18n
      testID="settings.female"
      label="settings:text_female"
      isChecked={genderState === GENDER_TYPE.FEMALE}
      disabled={disabled ? genderState === GENDER_TYPE.FEMALE ? 'disabled-auto-selected' : 'disabled' : undefined}
      onPress={() => setGenderState(GENDER_TYPE.FEMALE)}
    />
    <ViewSpacing width={SPACING} />
    <Radio
      useI18n
      testID="settings.others"
      label="settings:text_others"
      isChecked={genderState === GENDER_TYPE.OTHERS}
      disabled={disabled ? genderState === GENDER_TYPE.OTHERS ? 'disabled-auto-selected' : 'disabled' : undefined}
      onPress={() => setGenderState(GENDER_TYPE.OTHERS)}
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Gender;
