import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import EditPhoneNumber from './EditPhoneNumber';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';
import { responseGetCity } from '~/screens/Menu/UserProfile/store/__mocks__/data';
import i18n from '~/localization';

const country = [{
  countryCode: '+84',
  flag: '🇻🇳',
  isoCode: 'VN',
  name: 'Việt Nam',
}];

describe('EditPhoneNumber conponent', () => {
  const countryCodeState = '+84';
  const useForm = {
    setError: jest.fn(),
    clearErrors: jest.fn(),
    trigger: jest.fn(),
    handleSubmit: () => jest.fn(),
    control: {
      register: jest.fn(),
      unregister: jest.fn(),
      getFieldState: jest.fn(),
      _names: {
        array: new Set('test'),
        mount: new Set('test'),
        unMount: new Set('test'),
        watch: new Set('test'),
        focus: 'test',
        watchAll: false,
      },
      _subjects: {
        watch: jest.fn(),
        array: jest.fn(),
        state: jest.fn(),
      },
      _getWatch: jest.fn(),
      _formValues: ['test'],
      _defaultValues: ['test'],
    },
    getValues: () => '',
    setValue: () => jest.fn(),
    formState: {
      errors: {
        newPassword: {
          type: 'validate',
          message: 'signingInError',
        },
      },
    },
    watch: () => jest.fn(),
  };
  it('should render correctly with no phone number', () => {
    const onChangeCountryCode = jest.fn();

    useUserProfileStore.setState((state) => {
      state.city = responseGetCity.data as any;
      return state;
    });
    const wrapper = renderWithRedux(
      <EditPhoneNumber
        countryCode={countryCodeState}
        phoneNumber=""
        onChangeCountryCode={onChangeCountryCode}
        useFormData={useForm}
      />,
    );
    const countryCodeInputComp = wrapper.getByTestId('edit_phone_number.country_code');
    expect(countryCodeInputComp).toBeDefined();

    const phonenumberComp = wrapper.getByTestId('edit_phone_number.phone');
    expect(phonenumberComp).toBeDefined();
    expect(phonenumberComp.props?.placeholder).toEqual(i18n.t('settings:enter_phone'));
    expect(phonenumberComp.props?.value).toEqual('');
  });

  it('should render correctly with phone number', () => {
    const onChangeCountryCode = jest.fn();
    const phoneNumber = '0987299777';
    useUserProfileStore.setState((state) => {
      state.city = responseGetCity.data as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <EditPhoneNumber
        countryCode={countryCodeState}
        phoneNumber={phoneNumber}
        onChangeCountryCode={onChangeCountryCode}
        useFormData={useForm}
      />,
    );
    const countryCodeInputComp = wrapper.getByTestId('edit_phone_number.country_code');
    expect(countryCodeInputComp).toBeDefined();

    const phonenumberComp = wrapper.getByTestId('edit_phone_number.phone');
    expect(phonenumberComp).toBeDefined();
    expect(phonenumberComp.props?.value).toEqual(phoneNumber);
  });

  it('should call prop onChangeCountryCode:', () => {
    const onChangeCountryCode = jest.fn();
    const phoneNumber = '0987299777';
    useUserProfileStore.setState((state) => {
      state.country = country;
      return state;
    });

    const wrapper = renderWithRedux(
      <EditPhoneNumber
        countryCode={countryCodeState}
        phoneNumber={phoneNumber}
        onChangeCountryCode={onChangeCountryCode}
        useFormData={useForm}
      />,
    );
    const countryCodeInputComp = wrapper.getByTestId('edit_phone_number.country_code');
    expect(countryCodeInputComp).toBeDefined();

    fireEvent.press(countryCodeInputComp);
    const listCountryCodeComp = wrapper.queryAllByTestId('edit_phone_number.country_code.item');
    expect(listCountryCodeComp.length).toEqual(country.length);
    fireEvent.press(listCountryCodeComp[0]);
    expect(onChangeCountryCode).toBeCalled();
  });
});
