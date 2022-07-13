import React, {FC, useContext, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import {formatDateTime} from '~/beinComponents/TimeView';
import {AppContext} from '~/contexts/AppContext';
import {useBaseHook} from '~/hooks';
import modalActions from '~/store/modal/actions';

import spacing from '~/theme/spacing';
import DatePicker from './component/DatePicker';
import {getDefaultEndDate, getDefaultStartDate, isValidDate} from './helper';

export interface NFSFilterDateProps {
  startDate?: string;
  endDate?: string;
  onSelect?: (startDate?: string, endDate?: string) => void;
  dismissModalOnPress?: boolean;
}

const NFSFilterDate: FC<NFSFilterDateProps> = ({
  startDate,
  endDate,
  onSelect,
  dismissModalOnPress,
}: NFSFilterDateProps) => {
  const [selectingStartDate, setSelectingStartDate] = useState(false);
  const [selectingEndDate, setSelectingEndDate] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<any>(
    startDate || getDefaultStartDate(),
  );
  const [selectedEndDate, setSelectedEndDate] = useState<any>(
    endDate || getDefaultEndDate(),
  );
  const [startDateErr, setStartDateErr] = useState(false);
  const [endDateErr, setEndDateErr] = useState(false);

  const dispatch = useDispatch();
  const {language} = useContext(AppContext);
  const {t} = useBaseHook();
  const theme = useTheme() as ExtendedTheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const onPressApply = () => {
    dismissModalOnPress && dispatch(modalActions.hideModal());
    onSelect?.(selectedStartDate, selectedEndDate);
  };

  const onChangeDatePicker = (date?: Date) => {
    let isValid;
    if (selectingStartDate) {
      setSelectingStartDate(false);
      if (date) {
        setSelectedStartDate(date);
        isValid = isValidDate(date, selectedEndDate);
        setStartDateErr(!isValid);
        setEndDateErr(false);
      }
    } else if (selectedEndDate) {
      setSelectingEndDate(false);
      if (date) {
        date.setHours(23, 59, 59);
        setSelectedEndDate(date);
        isValid = isValidDate(selectedStartDate, date);
        setEndDateErr(!isValid);
        setStartDateErr(false);
      }
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <Text.ButtonSmall style={styles.textHeader}>
        {t('home:newsfeed_search:choose_date')}
      </Text.ButtonSmall>
      <Divider style={styles.divider} />
      <PrimaryItem
        height={52}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:from')}
        subTitle={
          startDateErr ? t('home:newsfeed_search:text_error_date') : undefined
        }
        subTitleProps={{variant: 'subtitle', color: colors.red60}}
        RightComponent={
          <Button.Secondary
            onPress={() => setSelectingStartDate(true)}
            style={startDateErr ? styles.buttonRightErr : styles.buttonRight}
            textColor={startDateErr ? colors.red60 : colors.purple50}>
            {formatDateTime(selectedStartDate, language)}
          </Button.Secondary>
        }
      />
      <PrimaryItem
        height={52}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:to')}
        subTitle={
          endDateErr ? t('home:newsfeed_search:text_error_date') : undefined
        }
        subTitleProps={{variant: 'subtitle', color: colors.red60}}
        RightComponent={
          <Button.Secondary
            onPress={() => setSelectingEndDate(true)}
            style={endDateErr ? styles.buttonRightErr : styles.buttonRight}
            textColor={endDateErr ? colors.red60 : colors.purple50}>
            {formatDateTime(selectedEndDate, language)}
          </Button.Secondary>
        }
      />
      <Button.Primary
        onPress={onPressApply}
        style={styles.buttonApply}
        disabled={startDateErr || endDateErr}
        color={colors.purple50}>
        {t('home:newsfeed_search:apply')}
      </Button.Primary>
      <DatePicker
        selectingStartDate={selectingStartDate}
        selectingEndDate={selectingEndDate}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
        onChangeDatePicker={onChangeDatePicker}
      />
    </TouchableOpacity>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.extraLarge,
    },
    itemContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
    textHeader: {
      color: colors.gray50,
      marginTop: spacing.margin.tiny,
      marginBottom: spacing.margin.tiny,
      marginHorizontal: spacing.margin.extraLarge,
    },
    buttonRight: {
      marginLeft: spacing.margin.tiny,
      borderWidth: 1,
      borderColor: colors.violet1,
      backgroundColor: colors.violet1,
    },
    buttonRightErr: {
      marginLeft: spacing.margin.tiny,
      borderWidth: 1,
      borderColor: colors.red60,
      backgroundColor: colors.white,
    },
    buttonApply: {
      marginHorizontal: spacing.margin.extraLarge,
      marginVertical: spacing.margin.small,
    },
  });
};

export default NFSFilterDate;
