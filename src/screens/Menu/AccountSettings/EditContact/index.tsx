import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, View, Keyboard, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import menuKeySelector from '../../../../storeRedux/menu/keySelector';
import { useRootNavigation } from '~/hooks/navigation';
import Button from '~/beinComponents/Button';
import TitleComponent from '../fragments/TitleComponent';
import EditPhoneNumber from './fragments/EditPhoneNumber';
import EditLocation from './fragments/EditLocation';
import menuActions from '../../../../storeRedux/menu/actions';
import spacing from '~/theme/spacing';
import { TextInput } from '~/baseComponents/Input';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { ICityResponseItem } from '~/interfaces/IAuth';
import useCommonController from '~/screens/store';
import useMenuController from '../../store';

const EditContact = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const locationRef = useRef<any>();

  const dispatch = useDispatch();

  const myProfile = useCommonController((state) => state.myProfile);
  const {
    email, phone, countryCode, city, id,
  } = myProfile || {};
  const actions = useMenuController((state) => state.actions);

  const [countryCodeState, setCountryCountryCodeState]
    = useState<string>(countryCode || '+84');
  const [cityState, setCityState] = useState<string>(city);
  const phoneNumberEditError = useKeySelector(
    menuKeySelector.phoneNumberEditError,
  );

  const {
    control,
    formState: { errors },
    trigger,
    getValues,
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    setValue('phoneNumber', phone);
  }, []);

  const navigateBack = () => {
    Keyboard.dismiss();
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    }
  };

  useEffect(() => {
    phoneNumberEditError && showErrors();
    return () => {
      dispatch(menuActions.setPhoneNumberEditError(''));
    };
  }, [phoneNumberEditError]);

  const onSave = async () => {
    const validInputs = await validateInputs();
    if (!validInputs) {
      return;
    }
    const phoneNumber = getValues('phoneNumber');

    actions.editMyProfile({
      data: {
        id,
        phone: phoneNumber,
        countryCode: phoneNumber ? countryCodeState : null,
        city: cityState,
      },
      callback: navigateBack,
    });
  };

  const validateInputs = async () => trigger('phoneNumber');

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

  const onEditLocationOpen = (e: any) => {
    Keyboard.dismiss();
    locationRef?.current?.open?.(e?.pageX, e?.pageY);
  };

  const onLocationItemPress = (item: ICityResponseItem) => {
    setCityState(item.name);
    locationRef?.current?.close();
    Keyboard.dismiss();
  };

  const onChangeCountryCode = (_countryCode: string) => {
    setCountryCountryCodeState(_countryCode);
  };

  const checkIsValid = (
    countryCodeState: string,
    cityState: string,
    phoneNumber: string,
  ) => countryCode !== countryCodeState
    || city !== cityState
    || phone !== phoneNumber;

  const isValid = checkIsValid(
    countryCodeState,
    cityState,
    watch('phoneNumber'),
  );

  return (
    <ScreenWrapper testID="EditContact" isFullView>
      <Header
        titleTextProps={{ useI18n: true }}
        title="settings:title_edit_contact"
        onPressBack={navigateBack}
        buttonText="common:text_save"
        buttonProps={{
          useI18n: true,
          disabled: !isValid,
          testID: 'edit_contact.save',
          style: styles.btnRightHeader,
        }}
        onPressButton={onSave}
      />
      <ScrollView
        keyboardShouldPersistTaps="always"
        scrollEnabled={false}
        contentContainerStyle={styles.content}
      >
        <View>
          <TextInput
            label={t('settings:title_email')}
            testID="edit_contact.email"
            editable={false}
            value={email || t('common:text_not_set')}
          />
          <ViewSpacing height={spacing.padding.large} />
          <EditPhoneNumber
            countryCode={countryCodeState}
            phoneNumber={phone}
            onChangeCountryCode={onChangeCountryCode}
            control={control}
            errorsState={errors}
            clearAllErrors={clearAllErrors}
          />
          <ViewSpacing height={spacing.padding.large} />
          <TitleComponent title="settings:title_location" isOptional />
          <Button
            testID="edit_contact.location"
            textProps={{
              color:
                cityState
                  ? theme.colors.neutral80
                  : theme.colors.neutral20,
              variant: 'bodyM',
            }}
            style={styles.buttonDropDown}
            contentStyle={styles.buttonDropDownContent}
            onPress={(e) => onEditLocationOpen(e)}
            rightIcon="AngleDown"
            rightIconProps={{ tintColor: theme.colors.neutral40, size: 14 }}
          >
            {cityState
              ? `${cityState}`
              : t('settings:select_location')}
          </Button>
        </View>
        <EditLocation
          modalizeRef={locationRef}
          onItemPress={onLocationItemPress}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default EditContact;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    content: {
      padding: spacing.margin.large,
    },
    buttonDropDown: {
      borderRadius: spacing.borderRadius.large,
      borderWidth: 1,
      borderColor: colors.neutral5,
      minHeight: 44,
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingLeft: spacing.padding.large,
    },
    buttonDropDownContent: {
      justifyContent: 'space-between',
    },
    btnRightHeader: {
      marginRight: spacing.margin.small,
    },
  });
};
