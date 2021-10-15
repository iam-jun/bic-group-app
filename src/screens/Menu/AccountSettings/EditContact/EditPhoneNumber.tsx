import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import TextInput from '~/beinComponents/inputs/TextInput';
import Text from '~/beinComponents/Text';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../redux/keySelector';
import * as validation from '~/constants/commonRegex';
import menuActions from '../../redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import modalActions from '~/store/modal/actions';
import {formatTextRemoveSpace} from '~/utils/formatData';

const EditPhoneNumber = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();

  const myProfile = useKeySelector(menuKeySelector.myProfile);
  const {id, phone} = myProfile || {};
  const phoneNumberEditError = useKeySelector(
    menuKeySelector.phoneNumberEditError,
  );
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);

  useEffect(() => {
    clearAllErrors();
  }, []);

  useEffect(() => {
    phoneNumberEditError && showErrors();
  }, [phoneNumberEditError]);

  const {
    control,
    formState: {errors},
    trigger,
    getValues,
    setError,
    clearErrors,
  } = useForm();

  const navigateBack = () => {
    rootNavigation.goBack();
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
        {id, phone: phoneNumber},
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

  const onOpenCountryExtension = () => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        useAppBottomSheet: false,
        ContentComponent: (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              marginHorizontal: 16,
              borderRadius: 6,
              padding: 12,
            }}>
            <Text>Input your phone number</Text>
          </View>
        ),
        props: {webModalStyle: {minHeight: undefined}},
      }),
    );
  };

  const renderCountryPhoneExtensionInput = () => {
    return (
      <TextInput
        // label={i18next.t('settings:title_email')}
        value={'+84'}
        style={styles.countryExtension}
        // onChangeText={}
        error={errors.email}
        helperContent={errors?.email?.message}
        // keyboardType="email-address"
        autoCapitalize="none"
      />
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
      />

      <View style={styles.inputsView}>
        {renderCountryPhoneExtensionInput()}
        {renderPhoneNumberInput()}
      </View>
    </ScreenWrapper>
  );
};

export default EditPhoneNumber;

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    inputsView: {
      flexDirection: 'row',
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.large,
    },
    countryExtension: {
      marginRight: spacing.margin.small,
    },
    phoneNumberView: {
      flex: 1,
    },
  });
};
