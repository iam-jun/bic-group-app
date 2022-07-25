import i18next from 'i18next';
import { debounce } from 'lodash';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Controller } from 'react-hook-form';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import BottomSheet from '~/beinComponents/BottomSheet';
import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import TextInput from '~/beinComponents/inputs/TextInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

import appConfig from '~/configs/appConfig';
import * as validation from '~/constants/commonRegex';
import { useKeySelector } from '~/hooks/selector';
import { ICountryCodeList } from '~/interfaces/common';

import spacing from '~/theme/spacing';
import { formatTextRemoveSpace } from '~/utils/formatData';
import menuActions from '../../../redux/actions';
import menuKeySelector from '../../../redux/keySelector';
import TitleComponent from '../../fragments/TitleComponent';

interface EditPhoneNumberProps {
  onChangeCountryCode: (value: string) => void;
  countryCode: string;
  phoneNumber: string;
  control: any;
  errorsState: any;
  clearAllErrors: () => void;
}

const EditPhoneNumber = ({
  onChangeCountryCode,
  control,
  errorsState,
  clearAllErrors,
  countryCode,
  phoneNumber,
}: EditPhoneNumberProps) => {
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme, screenHeight);
  const dispatch = useDispatch();

  const countryCodeList = useKeySelector(menuKeySelector.countryCodeList);
  const { data, searchResult } = countryCodeList || {};

  const [codeValue, setCodeValue] = useState<string>(countryCode);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const countryCodeSheetRef = useRef<any>();

  useEffect(() => {
    clearAllErrors();
  }, []);

  const doSearch = (searchQuery: string) => {
    searchQuery && dispatch(menuActions.searchCountryCode(searchQuery));
  };

  const searchHandler = useCallback(
    debounce(doSearch, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    setSearchQuery(text);
    searchHandler(text);
  };

  const onCloseModal = () => {
    setSearchQuery('');
  };

  const onSelectCountryCode = (item: ICountryCodeList) => {
    countryCodeSheetRef.current?.close();
    setCodeValue(item.code);
    setSearchQuery('');
    Keyboard.dismiss();
    onChangeCountryCode(item.code);
  };

  const renderItem = ({ item }: {item: ICountryCodeList}) => (
    <PrimaryItem
      testID="edit_phone_number.country_code.item"
      height={34}
      title={`${item.name} (+${item.code})`}
      leftIcon={item.flag}
      titleProps={{ variant: 'bodyM' }}
      onPress={() => onSelectCountryCode(item)}
    />
  );

  const renderCountryCodeList = () => (
    <BottomSheet
      modalizeRef={countryCodeSheetRef}
      modalStyle={styles.modalStyle}
      onClose={onCloseModal}
      ContentComponent={(
        <View style={styles.contentComponent}>
          <SearchInput
            testID="edit_phone_number.country_code.search"
            onChangeText={onQueryChanged}
            placeholder={i18next.t('input:search_country')}
            style={styles.searchInput}
          />
          <Divider style={styles.divider} />
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listView}
          >
            {(searchQuery ? searchResult : data || []).map(
              (item: ICountryCodeList) => renderItem({ item }),
            )}
          </ScrollView>
        </View>
        )}
    />
  );

  const onOpenCountryCode = (e: any) => {
    Keyboard.dismiss();
    countryCodeSheetRef?.current?.open?.(e?.pageX, e?.pageY);
  };

  const renderCountryCodeInput = () => (
    <Button
      testID="edit_phone_number.country_code"
      textProps={{ color: theme.colors.neutral80, variant: 'bodyM' }}
      style={styles.buttonDropDown}
      contentStyle={styles.buttonDropDownContent}
      rightIcon="AngleDown"
      onPress={(e) => onOpenCountryCode(e)}
    >
      {`+${codeValue || '84'}`}
    </Button>
  );

  const renderPhoneNumberInput = () => (
    <View style={styles.phoneNumberView}>
      <Controller
        name="phoneNumber"
        defaultValue={phoneNumber}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            testID="edit_phone_number.phone"
            onChangeText={(text: string) => {
              if (!!text && text?.trim?.()?.length > 0) {
                onChange(formatTextRemoveSpace(text));
                clearAllErrors();
              }
            }}
            error={errorsState?.phoneNumber}
            helperContent={errorsState?.phoneNumber?.message}
            keyboardType="numeric"
            autoCapitalize="none"
            activeOutlineColor={theme.colors.purple50}
            outlineColor={theme.colors.gray40}
            style={styles.inputStyle}
          />
        )}
        rules={{
          required: false,
          maxLength: {
            value: 12,
            message: i18next.t('settings:text_invalid_phone_length'),
          },
          minLength: {
            value: 7,
            message: i18next.t('settings:text_invalid_phone_length'),
          },
          pattern: {
            value: validation.phoneNumberRegex,
            message: i18next.t('settings:text_wrong_phone_number_format'),
          },
        }}
      />
    </View>
  );

  return (
    <>
      <TitleComponent icon="Phone" title="settings:title_phone_number" />
      <View style={styles.inputsView}>
        {renderCountryCodeInput()}
        {renderPhoneNumberInput()}
      </View>
      {renderCountryCodeList()}
    </>
  );
};

export default EditPhoneNumber;

const createStyles = (theme: ExtendedTheme, screenHeight: number) => {
  const { colors } = theme;

  return StyleSheet.create({
    inputsView: {
      flexDirection: 'row',
      alignContent: 'center',
      marginVertical: spacing.margin.small,
    },
    phoneNumberView: {
      flex: 1,
    },
    inputStyle: {
      marginVertical: 0,
    },
    listView: {
      paddingHorizontal: spacing.padding.small,
    },
    buttonDropDown: {
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.gray40,
      minHeight: 44,
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingLeft: spacing.padding.base,
      marginRight: spacing.margin.small,
      minWidth: 80,
    },
    buttonDropDownContent: {
      justifyContent: 'space-between',
    },
    contentComponent: {
      minHeight: 0.8 * screenHeight,
    },
    modalStyle: {
      borderTopRightRadius: spacing.borderRadius.small,
      borderTopLeftRadius: spacing.borderRadius.small,
    },
    searchInput: {
      marginHorizontal: spacing.margin.base,
    },
    divider: {
      marginTop: spacing.margin.small,
    },
  });
};
