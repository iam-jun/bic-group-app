import React, {FC, useContext, useState} from 'react';
import {View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {useBaseHook} from '~/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '~/beinComponents/Button';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import {formatDateTime} from '~/beinComponents/TimeView';
import {AppContext} from '~/contexts/AppContext';
import {useDispatch} from 'react-redux';
import modalActions from '~/store/modal/actions';
import moment from 'moment';

export interface NFSFilterDateProps {
  startDate?: string;
  endDate?: string;
  onSelect?: (startDate?: string, endDate?: string) => void;
  dismissModalOnPress?: boolean;
}

const DEFAULT_DAYS_AGO = 7;

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
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);

  const isValidDate = (sd: any, ed: any) => {
    const start = moment(sd);
    const end = moment(ed);
    return end > start;
  };

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

  const renderDatePicker = () => {
    return (
      <View style={{position: 'absolute', alignSelf: 'center'}}>
        {selectingStartDate && (
          <DateTimePicker
            isVisible={selectingStartDate}
            date={selectedStartDate}
            // minDate={new Date()}
            maxDate={new Date()}
            mode={'date'}
            onConfirm={onChangeDatePicker}
            onCancel={onChangeDatePicker}
          />
        )}
        {selectingEndDate && (
          <DateTimePicker
            isVisible={selectingEndDate}
            date={selectedEndDate}
            // minDate={new Date()}
            maxDate={new Date()}
            mode={'date'}
            onConfirm={onChangeDatePicker}
            onCancel={onChangeDatePicker}
          />
        )}
      </View>
    );
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
        subTitleProps={{variant: 'subtitle', color: colors.error}}
        RightComponent={
          <Button.Secondary
            onPress={() => setSelectingStartDate(true)}
            style={startDateErr ? styles.buttonRightErr : styles.buttonRight}
            textColor={startDateErr ? colors.error : colors.primary6}>
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
        subTitleProps={{variant: 'subtitle', color: colors.error}}
        RightComponent={
          <Button.Secondary
            onPress={() => setSelectingEndDate(true)}
            style={endDateErr ? styles.buttonRightErr : styles.buttonRight}
            textColor={endDateErr ? colors.error : colors.primary6}>
            {formatDateTime(selectedEndDate, language)}
          </Button.Secondary>
        }
      />
      <Button.Primary
        onPress={onPressApply}
        style={styles.buttonApply}
        disabled={startDateErr || endDateErr}
        color={colors.primary6}>
        {t('home:newsfeed_search:apply')}
      </Button.Primary>
      {renderDatePicker()}
    </TouchableOpacity>
  );
};

const getDefaultStartDate = () => {
  const now = new Date();
  const defaultDate = now.setDate(now.getDate() - DEFAULT_DAYS_AGO);
  const startDefault = new Date(defaultDate).setHours(0, 0, 0, 0);
  return new Date(startDefault);
};

const getDefaultEndDate = () => {
  const now = new Date();
  const endDefault = new Date(now).setHours(23, 59, 59, 59);
  return new Date(endDefault);
};

const createStyle = (theme: ITheme, insets: any) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom:
        Platform.OS === 'web'
          ? spacing.padding.tiny
          : spacing.padding.extraLarge,
      minWidth: Platform.OS === 'web' ? 300 : undefined,
      minHeight: Platform.OS === 'web' ? 250 : undefined,
    },
    itemContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
    textHeader: {
      color: colors.textSecondary,
      marginTop:
        Platform.OS === 'web' ? spacing.margin.base : spacing.margin.tiny,
      marginBottom: spacing.margin.tiny,
      marginHorizontal: spacing.margin.extraLarge,
    },
    buttonRight: {
      marginLeft:
        Platform.OS === 'web' ? spacing.margin.extraLarge : spacing.margin.tiny,
      borderWidth: 1,
      borderColor: colors.primary1,
      backgroundColor: colors.primary1,
    },
    buttonRightErr: {
      marginLeft:
        Platform.OS === 'web' ? spacing.margin.extraLarge : spacing.margin.tiny,
      borderWidth: 1,
      borderColor: colors.error,
      backgroundColor: colors.background,
    },
    buttonApply: {
      marginHorizontal: spacing.margin.extraLarge,
      marginVertical: spacing.margin.small,
    },
  });
};

export default NFSFilterDate;
