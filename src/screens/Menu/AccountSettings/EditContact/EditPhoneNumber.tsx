import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import i18next from 'i18next';
import {useTheme, TextInput as TextInputPaper} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import TextInput from '~/beinComponents/inputs/TextInput';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ListView from '~/beinComponents/list/ListView';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../redux/keySelector';
import * as validation from '~/constants/commonRegex';
import menuActions from '../../redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import {formatTextRemoveSpace} from '~/utils/formatData';
import {ICountryCodeList} from '~/interfaces/common';
import appConfig from '~/configs/appConfig';
import {dimension} from '~/theme';
import Icon from '~/beinComponents/Icon';
import {IconType} from '~/resources/icons';
import mainStack from '~/router/navigator/MainStack/stack';

const EditPhoneNumber = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();

  const myProfile = useKeySelector(menuKeySelector.myProfile);
  const {id, phone, country_code} = myProfile || {};
  const countryCodeList = useKeySelector(menuKeySelector.countryCodeList);
  const {data, searchResult} = countryCodeList || {};
  const phoneNumberEditError = useKeySelector(
    menuKeySelector.phoneNumberEditError,
  );
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const [codeValue, setCodeValue] = useState<string>(country_code);
  const [flagValue, setFlagValue] = useState<IconType>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    clearAllErrors();
  }, []);

  useEffect(() => {
    phoneNumberEditError && showErrors();
  }, [phoneNumberEditError]);

  useEffect(() => {
    const currentCode = data?.find(
      (item: ICountryCodeList) => item.code === country_code,
    );
    currentCode?.flag && setFlagValue(currentCode.flag);
  }, []);

  const {
    control,
    formState: {errors},
    trigger,
    getValues,
    setError,
    clearErrors,
  } = useForm();

  const navigateBack = () => {
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.editContact);
    }
    clearAllErrors();
  };

  const onSave = async () => {
    const validInputs = await validateInputs();

    if (!validInputs) {
      setShowSaveButton(false);
      return;
    }

    const phoneNumber = getValues('phoneNumber');
    dispatch(
      menuActions.editMyProfile(
        {id, phone: phoneNumber, country_code: codeValue},
        i18next.t('settings:title_phone_number'),
        navigateBack,
      ),
    );
  };

  const validateInputs = async () => {
    return await trigger('phoneNumber');
  };

  const showErrors = () => {
    setShowSaveButton(false);
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
    setIsOpen(false);
    setSearchQuery('');
  };

  const onSelectCountryCode = (item: ICountryCodeList) => {
    setCodeValue(item.code);
    setFlagValue(item.flag);
    !showSaveButton && setShowSaveButton(true);
    setIsOpen(false);
    setSearchQuery('');
  };

  const renderItem = ({item}: {item: ICountryCodeList}) => {
    return (
      <PrimaryItem
        height={34}
        title={`${item.name} (+${item.code})`}
        leftIcon={item.flag}
        onPress={() => onSelectCountryCode(item)}
      />
    );
  };

  const renderCountryCodeList = () => {
    return (
      <Modal visible={isOpen} transparent={true}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.appModalContainer}
            onPress={onCloseModal}>
            <View />
          </TouchableOpacity>
          <View style={styles.countryCodeModalList}>
            <SearchInput
              onChangeText={onQueryChanged}
              placeholder={i18next.t('input:search_country')}
            />
            <ListView
              listStyle={styles.listView}
              data={searchQuery ? searchResult : data}
              renderItem={renderItem}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const onOpenCountryCode = () => {
    setIsOpen(true);
  };

  const renderCountryCodeInput = () => {
    return (
      <ButtonWrapper onPress={onOpenCountryCode}>
        <View pointerEvents="none">
          <TextInput
            value={`+${codeValue}`}
            style={styles.countryExtension}
            left={
              <TextInputPaper.Icon
                name={() => (
                  <View style={styles.iconStyle}>
                    <Icon icon={flagValue} size={16} />
                  </View>
                )}
              />
            }
          />
        </View>
      </ButtonWrapper>
    );
  };

  const renderPhoneNumberInput = () => {
    return (
      <View style={styles.phoneNumberView}>
        <Controller
          name="phoneNumber"
          defaultValue={phone}
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              label={i18next.t('settings:title_phone_number')}
              value={value}
              onChangeText={(text: string) => {
                onChange(formatTextRemoveSpace(text));
                !showSaveButton && setShowSaveButton(true);
                clearAllErrors();
              }}
              error={errors.phoneNumber}
              helperContent={errors?.phoneNumber?.message}
              keyboardType="numeric"
              autoCapitalize="none"
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
    <ScreenWrapper testID="EditPhoneNumber" isFullView>
      <Header
        title={'settings:title_edit_phone_number'}
        titleTextProps={{useI18n: true}}
        buttonText={'common:text_save'}
        buttonProps={{
          useI18n: true,
          highEmphasis: true,
        }}
        onPressButton={showSaveButton ? onSave : undefined}
        onPressBack={navigateBack}
      />
      <View style={styles.inputsView}>
        {renderCountryCodeInput()}
        {renderPhoneNumberInput()}
      </View>
      {renderCountryCodeList()}
    </ScreenWrapper>
  );
};

export default EditPhoneNumber;

const createStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    inputsView: {
      flexDirection: 'row',
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.large,
    },
    countryExtension: {
      marginRight: spacing.margin.small,
      justifyContent: 'center',
    },
    phoneNumberView: {
      flex: 1,
    },
    countryCodeModalList: {
      position: 'absolute',
      zIndex: 3,
      backgroundColor: colors.background,
      borderRadius: 6,
      paddingVertical: spacing.padding.large,
      paddingHorizontal: spacing.padding.extraLarge,
      maxWidth: dimension.deviceWidth / (Platform.OS === 'web' ? 2 : 1),
      minWidth: dimension.deviceWidth / (Platform.OS === 'web' ? 2 : 1),
    },
    appModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(12, 13, 14, 0.5)',
      width: '100%',
    },
    modalView: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    listView: {
      marginVertical: spacing.margin.large,
    },
    iconStyle: {
      marginTop: spacing.margin.tiny,
    },
  });
};
