import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, View, Keyboard, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import i18next from 'i18next';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import { useKeySelector } from '~/hooks/selector';
import menuKeySelector from '../../redux/keySelector';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import Button from '~/beinComponents/Button';
import TitleComponent from '../fragments/TitleComponent';
import EditPhoneNumber from './fragments/EditPhoneNumber';
import EditLocation from './fragments/EditLocation';
import { ILocation } from '~/interfaces/common';
import menuActions from '../../redux/actions';
import spacing from '~/theme/spacing';

const EditContact = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const locationRef = useRef<any>();

  const dispatch = useDispatch();

  const myProfile = useKeySelector(menuKeySelector.myProfile);
  const {
    email, phone, country_code, country, city, id,
  } = myProfile || {};

  const [countryCodeState, setCountryCountryCodeState] = useState<string>(country_code);
  const [countryState, setCountryState] = useState<string>(country);
  const [cityState, setCityState] = useState<string>(city);
  const phoneNumberEditError = useKeySelector(menuKeySelector.phoneNumberEditError);

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

  useEffect(
    () => {
      setValue(
        'phoneNumber', phone,
      );
    }, [],
  );

  const navigateBack = () => {
    Keyboard.dismiss();
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.userEdit);
    }
  };

  useEffect(
    () => {
      phoneNumberEditError && showErrors();
      return () => {
        dispatch(menuActions.setPhoneNumberEditError(''));
      };
    }, [phoneNumberEditError],
  );

  const onSave = async () => {
    const validInputs = await validateInputs();
    if (!validInputs) {
      return;
    }
    const phoneNumber = getValues('phoneNumber');

    dispatch(menuActions.editMyProfile(
      {
        id,
        phone: phoneNumber,
        country_code: phoneNumber ? countryCodeState : null,
        country: countryState,
        city: cityState,
      },
      i18next.t('settings:text_contact_info_update_success'),
      () => {
        navigateBack();
      },
    ));
  };

  const validateInputs = async () => trigger('phoneNumber');

  const showErrors = () => {
    setError(
      'phoneNumber', {
        type: 'validate',
        message: phoneNumberEditError,
      },
    );
  };

  const clearAllErrors = () => {
    clearErrors('phoneNumber');
    dispatch(menuActions.setPhoneNumberEditError(''));
  };

  const onEditLocationOpen = (e: any) => {
    Keyboard.dismiss();
    locationRef?.current?.open?.(
      e?.pageX, e?.pageY,
    );
  };

  const onLocationItemPress = (item: ILocation) => {
    setCountryState(item.country);
    setCityState(item.name);
    locationRef?.current?.close();
    Keyboard.dismiss();
  };

  const onChangeCountryCode = (_countryCode: string) => {
    setCountryCountryCodeState(_countryCode);
  };

  const checkIsValid = (
    countryCodeState: string,
    countryState: string,
    cityState: string,
    phoneNumber: string,
  ) => (
    country_code !== countryCodeState
      || country !== countryState
      || city !== cityState
      || phone !== phoneNumber
  );

  const isValid = checkIsValid(
    countryCodeState,
    countryState,
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
          color: theme.colors.purple50,
          textColor: theme.colors.white,
          borderRadius: spacing.borderRadius.small,
          disabled: !isValid,
          testID: 'edit_contact.save',
        }}
        onPressButton={onSave}
      />
      <ScrollView keyboardShouldPersistTaps="always" scrollEnabled={false}>
        <View style={styles.infoItem}>
          <EditPhoneNumber
            countryCode={country_code}
            phoneNumber={phone}
            onChangeCountryCode={onChangeCountryCode}
            control={control}
            errorsState={errors}
            clearAllErrors={clearAllErrors}
          />
          <TitleComponent icon="Envelope" title="settings:title_email" />
          <Button
            testID="edit_contact.email"
            textProps={{ color: theme.colors.gray60, variant: 'bodyM' }}
            style={[
              styles.buttonDropDown,
              { backgroundColor: theme.colors.gray10 },
            ]}
            contentStyle={styles.buttonDropDownContent}
            activeOpacity={1}
            disabled
          >
            {email || i18next.t('common:text_not_set')}
          </Button>

          <TitleComponent icon="LocationDot" title="settings:title_address" />
          <Button
            testID="edit_contact.location"
            textProps={{ color: theme.colors.neutral80, variant: 'bodyM' }}
            style={styles.buttonDropDown}
            contentStyle={styles.buttonDropDownContent}
            onPress={(e) => onEditLocationOpen(e)}
          >
            {cityState && countryState
              ? `${cityState}, ${countryState}`
              : i18next.t('common:text_not_set')}
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
    infoItem: {
      paddingHorizontal: spacing.margin.large,
    },
    buttonDropDown: {
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.gray40,
      minHeight: 44,
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingLeft: spacing.padding.base,
      marginVertical: spacing.margin.small,
    },
    buttonDropDownContent: {
      justifyContent: 'space-between',
    },
  });
};
