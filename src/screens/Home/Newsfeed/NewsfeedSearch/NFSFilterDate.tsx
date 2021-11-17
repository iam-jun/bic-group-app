import React, {FC, useContext, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
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

export interface NFSFilterDateProps {
  startDate?: string;
  endDate?: string;
  onSelect?: (startDate?: string, endDate?: string) => void;
}

const DEFAULT_DAYS_AGO = 7;

const NFSFilterDate: FC<NFSFilterDateProps> = ({
  startDate,
  endDate,
  onSelect,
}: NFSFilterDateProps) => {
  const [selectingStartDate, setSelectingStartDate] = useState(false);
  const [selectingEndDate, setSelectingEndDate] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<any>(
    startDate || getDefaultStartDate(),
  );
  const [selectedEndDate, setSelectedEndDate] = useState<any>(
    endDate || new Date(),
  );

  const dispatch = useDispatch();
  const {language} = useContext(AppContext);
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);

  const onPressApply = () => {
    dispatch(modalActions.hideModal());
    onSelect?.(selectedStartDate, selectedEndDate);
  };

  const onChangeDatePicker = (date?: Date) => {
    if (selectingStartDate) {
      setSelectingStartDate(false);
      if (date) {
        setSelectedStartDate(date);
      }
    } else if (selectedEndDate) {
      setSelectingEndDate(false);
      if (date) {
        setSelectedEndDate(date);
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
    <View style={styles.container}>
      <Text.ButtonSmall style={styles.textHeader}>
        {t('home:newsfeed_search:choose_date')}
      </Text.ButtonSmall>
      <Divider style={styles.divider} />
      <PrimaryItem
        height={52}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:from')}
        RightComponent={
          <Button.Secondary
            onPress={() => setSelectingStartDate(true)}
            style={styles.buttonRight}
            textColor={colors.primary6}>
            {formatDateTime(selectedStartDate, t, language)}
          </Button.Secondary>
        }
      />
      <PrimaryItem
        height={52}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:to')}
        RightComponent={
          <Button.Secondary
            onPress={() => setSelectingEndDate(true)}
            style={styles.buttonRight}
            textColor={colors.primary6}>
            {formatDateTime(selectedEndDate, t, language)}
          </Button.Secondary>
        }
      />
      <Button.Primary
        onPress={onPressApply}
        style={styles.buttonApply}
        color={colors.primary6}>
        {t('home:newsfeed_search:apply')}
      </Button.Primary>
      {renderDatePicker()}
    </View>
  );
};

const getDefaultStartDate = () => {
  const now = new Date();
  const defaultDate = now.setDate(now.getDate() - DEFAULT_DAYS_AGO);
  const startDefault = new Date(defaultDate).setHours(0, 0, 0, 0);
  return new Date(startDefault);
};

const createStyle = (theme: ITheme, insets: any) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom:
        Platform.OS === 'web'
          ? spacing.padding.tiny
          : spacing.padding.extraLarge + insets?.bottom,
    },
    itemContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
    textHeader: {
      color: colors.textSecondary,
      marginVertical: spacing.margin.tiny,
      marginHorizontal: spacing.margin.extraLarge,
    },
    buttonRight: {
      marginLeft:
        Platform.OS === 'web' ? spacing.margin.extraLarge : spacing.margin.tiny,
    },
    buttonApply: {
      marginHorizontal: spacing.margin.extraLarge,
      marginVertical: spacing.margin.small,
    },
  });
};

export default NFSFilterDate;
