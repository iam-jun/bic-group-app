import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import SettingItem from '../../../EditBasicInfo/fragments/SettingItem';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import genders from '~/constants/genders';
import { formatDate } from '~/utils/formatData';
import RELATIONSHIP_STATUS from '~/constants/relationshipStatus';
import { spacing } from '~/theme';
import { getLanguages } from '~/screens/Menu/UserProfile/helper';

interface Props {
  fullname: string;
  gender: string;
  birthday: string;
  language: string[];
  relationshipStatus: string;
  onPressEdit: () => void;
}

const BasicInfo = ({
  fullname,
  gender,
  birthday,
  language,
  relationshipStatus,
  onPressEdit,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const { t } = useBaseHook();

  return (
    <View>
      <View style={styles.headerItem}>
        <Text.BodyM color={colors.neutral80} useI18n>
          settings:title_basic_info
        </Text.BodyM>
        <ButtonWrapper style={styles.editBtn} onPress={onPressEdit}>
          <Text.H6
            testID="basic_info.edit"
            color={colors.neutral80}
            useI18n
          >
            settings:title_edit
          </Text.H6>
        </ButtonWrapper>
      </View>
      <View style={styles.infoItem}>
        <SettingItem
          title="settings:title_name"
          subtitle={fullname || t('common:text_not_set')}
          leftIcon="TextSize"
          isTouchDisabled
        />
        <SettingItem
          title="settings:title_gender"
          subtitle={t(genders[gender]) || t('common:text_not_set')}
          leftIcon="SquareUser"
          isTouchDisabled
        />
        <SettingItem
          title="settings:title_birthday"
          subtitle={formatDate(birthday, 'MMMM DD, YYYY') || t('common:text_not_set')}
          leftIcon="Calendar"
          isTouchDisabled
        />
        <SettingItem
          title="settings:title_speaking_languages"
          subtitle={getLanguages(language) || t('common:text_not_set')}
          leftIcon="Comments"
          isTouchDisabled
        />
        <SettingItem
          title="settings:title_relationship_status"
          subtitle={t(RELATIONSHIP_STATUS[relationshipStatus]) || t('common:text_not_set')}
          leftIcon="Heart"
          isTouchDisabled
        />
      </View>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  headerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: spacing.padding.base,
    paddingVertical: spacing.padding.small,
    paddingLeft: spacing.padding.large,
    alignItems: 'center',
  },
  editBtn: { padding: spacing.padding.small },
  infoItem: {
    marginHorizontal: spacing.margin.tiny,
  },
});

export default BasicInfo;
