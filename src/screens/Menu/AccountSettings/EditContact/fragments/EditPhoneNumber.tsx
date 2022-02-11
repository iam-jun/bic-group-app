import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  useWindowDimensions,
  ScrollView,
  Keyboard,
} from 'react-native';
import i18next from 'i18next';
import {useTheme, TextInput as TextInputPaper} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';

import TextInput from '~/beinComponents/inputs/TextInput';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import Button from '~/beinComponents/Button';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../../redux/keySelector';
import * as validation from '~/constants/commonRegex';
import menuActions from '../../../redux/actions';
import {formatTextRemoveSpace} from '~/utils/formatData';
import {ICountryCodeList} from '~/interfaces/common';
import appConfig from '~/configs/appConfig';
import TitleComponent from '../../fragments/TitleComponent';
import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';

interface EditPhoneNumberProps {
  onChangeCountryCode: (value: string) => void;
  onChangePhoneNumber: (value: string) => void;
  countryCode: string;
  phoneNumber: string;
}

const EditPhoneNumber = ({
  onChangeCountryCode,
  onChangePhoneNumber,
  countryCode,
  phoneNumber,
}: EditPhoneNumberProps) => {
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme, screenHeight);
  const dispatch = useDispatch();

  const countryCodeList = useKeySelector(menuKeySelector.countryCodeList);
  const {data, searchResult} = countryCodeList || {};
  const phoneNumberEditError = useKeySelector(
    menuKeySelector.phoneNumberEditError,
  );
  const [codeValue, setCodeValue] = useState<string>(countryCode);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const countryCodeSheetRef = useRef<any>();

  useEffect(() => {
    clearAllErrors();
  }, []);

  useEffect(() => {
    phoneNumberEditError && showErrors();
  }, [phoneNumberEditError]);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      console.log('>>>>>keyboardDidHide>>>>>>');
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  const {
    control,
    formState: {errors},
    trigger,
    getValues,
    setError,
    clearErrors,
  } = useForm();

  const onEndEditing = async () => {
    const validInputs = await validateInputs();
    if (!validInputs) {
      return;
    }
    const phoneNumber = getValues('phoneNumber');
    // onChangePhoneNumber(phoneNumber);
  };

  const validateInputs = async () => {
    return await trigger('phoneNumber');
  };

  const showErrors = () => {
    setError('phoneNumber', {
      type: 'validate',
      message: phoneNumberEditError,
    });
  };

  const clearAllErrors = () => {
    clearErrors('phoneNumber');
    dispatch(menuActions.setPhoneNumberEditError(''));
  };

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

  const renderItem = ({item}: {item: ICountryCodeList}) => {
    return (
      <PrimaryItem
        testID={'edit_phone_number.country_code.item'}
        height={34}
        title={`${item.name} (+${item.code})`}
        leftIcon={item.flag}
        titleProps={{variant: 'body'}}
        onPress={() => onSelectCountryCode(item)}
      />
    );
  };

  const renderCountryCodeList = () => {
    return (
      <BottomSheet
        modalizeRef={countryCodeSheetRef}
        modalStyle={styles.modalStyle}
        onClose={onCloseModal}
        ContentComponent={
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
              contentContainerStyle={styles.listView}>
              {(searchQuery ? searchResult : data || []).map(
                (item: ICountryCodeList) => renderItem({item}),
              )}
            </ScrollView>
          </View>
        }
      />
    );
  };

  const onOpenCountryCode = (e: any) =>
    countryCodeSheetRef?.current?.open?.(e?.pageX, e?.pageY);

  const renderCountryCodeInput = () => {
    return (
      <Button
        testID="edit_phone_number.country_code"
        textProps={{color: theme.colors.textInput, variant: 'body'}}
        style={styles.buttonDropDown}
        contentStyle={styles.buttonDropDownContent}
        rightIcon={'AngleDown'}
        onPress={e => onOpenCountryCode(e)}>
        {`+${codeValue}`}
      </Button>
    );
  };

  const renderPhoneNumberInput = () => {
    return (
      <View style={styles.phoneNumberView}>
        <Controller
          name="phoneNumber"
          defaultValue={phoneNumber}
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              value={value}
              testID="edit_phone_number.phone"
              onChangeText={(text: string) => {
                onChange(formatTextRemoveSpace(text));
                clearAllErrors();
              }}
              error={errors.phoneNumber}
              helperContent={errors?.phoneNumber?.message}
              keyboardType="numeric"
              autoCapitalize="none"
              onEndEditing={onEndEditing}
              activeOutlineColor={theme.colors.primary6}
              outlineColor={theme.colors.borderCard}
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
  };

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

const createStyles = (theme: ITheme, screenHeight: number) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    inputsView: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      // justifyContent: 'center',
    },
    phoneNumberView: {
      flex: 1,
    },
    listView: {
      paddingHorizontal: spacing.padding.small,
    },
    buttonDropDown: {
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.borderCard,
      minHeight: 40,
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingLeft: spacing.padding.base,
      marginVertical: spacing.margin.small,
      marginRight: spacing.margin.small,
      marginTop: spacing.margin.base,
      minWidth: 80,
    },
    buttonDropDownContent: {
      justifyContent: 'space-between',
    },
    contentComponent: {
      maxHeight: 0.8 * screenHeight,
      ...Platform.select({
        web: {
          maxHeight: 0.55 * screenHeight,
        },
      }),
      minHeight: 0.5 * screenHeight,
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
