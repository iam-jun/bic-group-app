import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View, Keyboard, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import Button from '~/beinComponents/Button';
import TitleComponent from '../fragments/TitleComponent';
import EditPhoneNumber from './fragments/EditPhoneNumber';
import EditLocation from './fragments/EditLocation';
import {ILocation} from '~/interfaces/common';
import menuActions from '../../redux/actions';
import {useForm} from 'react-hook-form';

const EditContact = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const locationRef = useRef<any>();

  const dispatch = useDispatch();

  const myProfile = useKeySelector(menuKeySelector.myProfile);
  const {email, phone, country_code, country, city, id} = myProfile || {};

  const [countryCodeState, setCountryCountryCodeState] =
    useState<string>(country_code);
  const [countryState, setCountryState] = useState<string>(country);
  const [cityState, setCityState] = useState<string>(city);
  const phoneNumberEditError = useKeySelector(
    menuKeySelector.phoneNumberEditError,
  );

  const {
    control,
    formState: {errors},
    trigger,
    getValues,
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const navigateBack = () => {
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.userEdit);
    }
  };

  const resetData = () => {
    setCountryCountryCodeState(country_code);
    setCountryState(country);
    setCityState(city);
    setValue('phoneNumber', phone);
    clearErrors('phoneNumber');
  };

  useEffect(() => {
    phoneNumberEditError && showErrors();
  }, [phoneNumberEditError]);

  const onSave = async () => {
    const validInputs = await validateInputs();
    if (!validInputs) {
      return;
    }
    const phoneNumber = getValues('phoneNumber');

    dispatch(
      menuActions.editMyProfile(
        {
          id,
          phone: phoneNumber,
          country_code: countryCodeState,
          country: countryState,
          city: cityState,
        },
        i18next.t('settings:text_contact_info_update_success'),
      ),
    );
    navigateBack();
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

  const onEditLocationOpen = (e: any) => {
    locationRef?.current?.open?.(e?.pageX, e?.pageY);
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

  return (
    <ScreenWrapper testID="EditContact" isFullView>
      <Header
        titleTextProps={{useI18n: true}}
        title={'settings:title_edit_contact'}
        onPressBack={() => {
          resetData();
          navigateBack();
        }}
        buttonText={'common:text_save'}
        buttonProps={{
          useI18n: true,
          color: theme.colors.primary6,
          textColor: theme.colors.background,
          borderRadius: theme.spacing.borderRadius.small,
        }}
        onPressButton={onSave}
      />
      <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
        <View style={styles.infoItem}>
          <EditPhoneNumber
            countryCode={country_code}
            phoneNumber={phone}
            onChangeCountryCode={onChangeCountryCode}
            control={control}
            errorsState={errors}
            clearAllErrors={clearAllErrors}
          />
          <TitleComponent icon="EnvelopeAlt" title="settings:title_email" />
          <Button
            testID="edit_contact.phone"
            textProps={{color: theme.colors.borderCard, variant: 'body'}}
            style={[
              styles.buttonDropDown,
              {backgroundColor: theme.colors.bgHover},
            ]}
            contentStyle={styles.buttonDropDownContent}
            activeOpacity={1}>
            {email || i18next.t('common:text_not_set')}
          </Button>

          <TitleComponent icon="LocationPoint" title="settings:title_address" />
          <Button
            testID="edit_contact.location"
            textProps={{color: theme.colors.textInput, variant: 'body'}}
            style={styles.buttonDropDown}
            contentStyle={styles.buttonDropDownContent}
            onPress={e => onEditLocationOpen(e)}>
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

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    infoItem: {
      paddingHorizontal: spacing.margin.large,
    },
    buttonDropDown: {
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.borderCard,
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
