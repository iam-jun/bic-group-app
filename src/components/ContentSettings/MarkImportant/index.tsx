import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import Button from '~/beinComponents/Button';
import Icon from '~/baseComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { DateInput } from '~/baseComponents/Input';
import Toggle from '~/baseComponents/Toggle';
import { isPostExpired } from '~/helpers/post';
import { IActivityImportant, IAudience } from '~/interfaces/IPost';
import { formatDate } from '~/utils/formatter';
import { useBaseHook } from '~/hooks';

interface MarkImportantProps {
    type: 'post' | 'article' | 'series';
    dataImportant: IActivityImportant;
    showWarning: boolean;
    onPressAudiences?: () => void;
    listAudiencesWithoutPermission?: IAudience[];
    handleToggleImportant: () => void;
    handleDropDown: () => void;
    showCustomExpire: boolean;
    getMinDate: any;
    getMaxDate: any;
    handleChangeDatePicker: () => void;
    handleChangeTimePicker: () => void;
}

const MarkImportant: React.FC<MarkImportantProps> = ({
  type,
  dataImportant,
  showWarning,
  onPressAudiences,
  listAudiencesWithoutPermission,
  handleToggleImportant,
  handleDropDown,
  showCustomExpire,
  getMinDate,
  getMaxDate,
  handleChangeDatePicker,
  handleChangeTimePicker,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const {
    active, expiresTime, neverExpires, chosenSuggestedTime,
  } = dataImportant || {};
  const isExpired = isPostExpired(expiresTime);
  const dateValue = formatDate(expiresTime, 'MMMM DD, YYYY HH:mm');
  const timeContent = chosenSuggestedTime || t('common:text_expires_on');

  const showTextAudiencesWithoutPermission = !!showWarning && listAudiencesWithoutPermission?.length > 0;
  const showImportantDate = !!active && (listAudiencesWithoutPermission?.length < 1 || !isExpired);

  const renderListAudienceWithoutPermission = (list: any[]) => {
    if (!Array.isArray(list) || isEmpty(list)) {
      return null;
    }

    if (list?.length <= 3) {
      const newList = list?.map((item) => item.name);
      return (
        <Text.BodyXS color={colors.danger}>
          {` ${newList?.join(', ')}`}
        </Text.BodyXS>
      );
    }

    return (
      <Text.BodyXS color={colors.danger}>
        {` ${list[0]?.name}, ${list[1]?.name}, ${t('post:and')} `}
        <Text.BodyXSMedium
          color={colors.danger}
          onPress={onPressAudiences}
        >
          {`${t('common:text_more').replace('(number)', list.length - 2)}`}
        </Text.BodyXSMedium>
      </Text.BodyXS>
    );
  };

  const renderTextWarningListAudienceWithoutPermission = () => {
    if (!showTextAudiencesWithoutPermission) return null;

    return (
      <Text.BodyXS color={colors.danger} style={styles.warningText}>
        {`${t('post:text_important_warning_1')}`}
        {renderListAudienceWithoutPermission(listAudiencesWithoutPermission)}
        {`${t('post:text_important_warning_2')}`}
      </Text.BodyXS>
    );
  };

  const renderLabelTime = () => {
    if (neverExpires) {
      return (
        <View style={styles.neverExpiresText}>
          <Icon icon="CircleInfo" size={16} tintColor={colors.neutral20} />
          <ViewSpacing width={spacing.margin.small} />
          <Text.BodyXS useI18n color={colors.neutral40}>common:text_never_expire</Text.BodyXS>
        </View>
      );
    }
    return (
      <View style={styles.expiresOnTextContainer}>
        <Text.BodyS useI18n color={colors.neutral40} style={styles.expiresOnText}>
          common:text_expires_on
        </Text.BodyS>
        <Text.BodySMedium>
          {dateValue}
        </Text.BodySMedium>
      </View>
    );
  };

  const renderCustomExpires = () => {
    if (!showCustomExpire) return null;

    return (
      <View style={styles.importantButtons}>
        <DateInput
          testID="post_settings.important.btn_date"
          mode="date"
          value={expiresTime}
          minDate={getMinDate()}
          maxDate={getMaxDate()}
          label={t('common:text_end_date')}
          onConfirm={handleChangeDatePicker}
          style={styles.flex1}
        />
        <ViewSpacing width={16} />
        <DateInput
          testID="post_settings.important.btn_time"
          mode="time"
          value={expiresTime}
          minDate={getMinDate()}
          maxDate={getMaxDate()}
          label={t('common:text_end_hour')}
          onConfirm={handleChangeTimePicker}
          style={styles.flex1}
        />
      </View>
    );
  };

  const renderImportantDate = () => {
    if (!showImportantDate) return null;

    return (
      <View>
        <Button onPress={handleDropDown} style={[styles.row, styles.dropdownStyle]}>
          <Text.DropdownM
            useI18n
            color={chosenSuggestedTime ? colors.neutral60 : colors.neutral20}
            style={styles.flex1}
          >
            {timeContent}
          </Text.DropdownM>
          <Icon icon="AngleDown" size={16} tintColor={colors.neutral40} />
        </Button>
        {renderLabelTime()}
        {renderCustomExpires()}
      </View>
    );
  };

  const renderImportant = () => (
    <View style={styles.content}>
      <View
        style={[
          styles.row,
          active ? styles.active : styles.important,
        ]}
      >
        <View style={[styles.flex1]}>
          <Text.SubtitleM style={[styles.flex1]} useI18n>
            {`common:mark_${type}_as_important`}
          </Text.SubtitleM>
          {renderTextWarningListAudienceWithoutPermission()}
        </View>
        <Toggle
          testID="post_settings.toggle_important"
          isChecked={active}
          onValueChanged={handleToggleImportant}
          disableBuiltInState
        />
      </View>
      {renderImportantDate()}
    </View>
  );

  return (
    <View>
      {renderImportant()}
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    content: {
      marginBottom: spacing.margin.extraLarge,
      marginHorizontal: spacing.margin.large,
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    active: {
      marginTop: spacing.margin.base,
    },
    important: {
      marginTop: spacing.margin.base,
      alignItems: 'flex-start',
    },
    flex1: { flex: 1 },
    warningText: {
      marginTop: spacing.padding.base,
    },
    dropdownStyle: {
      backgroundColor: colors.white,
      paddingVertical: spacing.padding.small,
      paddingLeft: spacing.padding.large,
      paddingRight: spacing.padding.base,
      borderColor: colors.neutral5,
      borderRadius: spacing.borderRadius.large,
      borderWidth: 1,
      marginTop: spacing.margin.large,
    },
    neverExpiresText: {
      marginTop: spacing.margin.extraLarge,
      backgroundColor: colors.gray1,
      padding: spacing.padding.small,
      flexDirection: 'row',
      alignItems: 'center',
    },
    expiresOnTextContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    expiresOnText: {
      marginTop: spacing.margin.large,
    },
    importantButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.padding.base,
    },
  });
};

export default MarkImportant;
