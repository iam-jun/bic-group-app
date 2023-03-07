import React, { useEffect, useRef } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useController } from 'react-hook-form';
import BottomSheet from '~/baseComponents/BottomSheet';
import Button from '~/beinComponents/Button';
import TextInput from '~/beinComponents/inputs/TextInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

import * as validation from '~/constants/commonRegex';

import spacing from '~/theme/spacing';
import { formatTextRemoveSpace } from '~/utils/formatter';
import TitleComponent from '../../fragments/TitleComponent';
import { useBaseHook } from '~/hooks';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';
import { ICountryResponseItem } from '~/interfaces/IAuth';
import { IObject } from '~/interfaces/common';
import useMenuController from '~/screens/Menu/store';

interface EditPhoneNumberProps {
  onChangeCountryCode: (value: string) => void;
  countryCode: string;
  phoneNumber: string;
  useFormData: IObject<any>;
}

const EditPhoneNumber = ({
  onChangeCountryCode,
  countryCode,
  phoneNumber,
  useFormData,
}: EditPhoneNumberProps) => {
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(
    theme, screenHeight,
  );
  const country = useUserProfileStore((state) => state.country);

  const { t } = useBaseHook();

  const countryCodeSheetRef = useRef<any>();
  const editContactError = useMenuController((state) => state.editContactError);
  const actions = useMenuController((state) => state.actions);

  const phoneRules = {
    required: false,
    maxLength: {
      value: 12,
      message: t('settings:text_invalid_phone_length'),
    },
    minLength: {
      value: 7,
      message: t('settings:text_invalid_phone_length'),
    },
    pattern: {
      value: validation.phoneNumberRegex,
      message: t('settings:text_wrong_phone_number_format'),
    },
  };

  const {
    control,
    formState: { errors },
    setError,
    trigger,
  } = useFormData;

  const {
    field: { onChange, value },
  } = useController({
    control,
    name: 'phoneNumber',
    rules: phoneRules,
    defaultValue: phoneNumber,
  });

  const validateInputs = async () => trigger('phoneNumber');

  useEffect(() => {
    if (!!editContactError) {
      setError('phoneNumber', {
        type: 'validate',
        message: editContactError,
      });
    }
    return () => {
      actions.setEditContactError('');
    };
  }, [editContactError]);

  const onSelectCountryCode = (item: ICountryResponseItem) => {
    countryCodeSheetRef.current?.close();
    onChangeCountryCode(item.countryCode);
  };

  const renderItem = ({ item }: {item: ICountryResponseItem}) => (
    <PrimaryItem
      key={`edit_phone_number.country_code.${item.countryCode}`}
      testID="edit_phone_number.country_code.item"
      title={`${item.flag} ${item.name} (${item.countryCode})`}
      titleProps={{ variant: 'bodyM' }}
      onPress={() => onSelectCountryCode(item)}
    />
  );

  const renderCountryCodeList = () => (
    <BottomSheet
      modalizeRef={countryCodeSheetRef}
      ContentComponent={(
        <View style={styles.contentComponent}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listView}
          >
            {country.map((item) => renderItem({ item }))}
          </ScrollView>
        </View>
      )}
    />
  );

  const onOpenCountryCode = (e: any) => {
    Keyboard.dismiss();
    countryCodeSheetRef?.current?.open?.(
      e?.pageX, e?.pageY,
    );
  };

  const renderCountryCodeInput = () => (
    <Button
      testID="edit_phone_number.country_code"
      textProps={{ color: theme.colors.neutral80, variant: 'bodyM' }}
      style={styles.buttonDropDown}
      contentStyle={styles.buttonDropDownContent}
      rightIcon="AngleDown"
      rightIconProps={{ tintColor: colors.neutral40, size: 14 }}
      onPress={(e) => onOpenCountryCode(e)}
    >
      {`${countryCode || '+84'}`}
    </Button>
  );

  const renderPhoneNumberInput = () => (
    <View style={styles.phoneNumberView}>
      <TextInput
        value={value}
        testID="edit_phone_number.phone"
        onChangeText={(text: string) => {
          if (!!text && text?.trim?.()?.length > 0) {
            onChange(formatTextRemoveSpace(text));
            validateInputs();
          }
        }}
        error={errors?.phoneNumber}
        helperContent={errors?.phoneNumber?.message}
        helperTextProps={{ style: styles.textErrorPhoneNumber }}
        keyboardType="numeric"
        autoCapitalize="none"
        activeOutlineColor={theme.colors.purple50}
        outlineColor={theme.colors.neutral5}
        style={styles.inputContainer}
        inputStyle={styles.inputStyle}
        placeholder={t('settings:enter_phone')}
      />
    </View>
  );

  return (
    <>
      <TitleComponent title="settings:title_phone_number" isOptional />
      <View style={styles.inputsView}>
        {renderCountryCodeInput()}
        {renderPhoneNumberInput()}
      </View>
      {renderCountryCodeList()}
    </>
  );
};

export default EditPhoneNumber;

const createStyles = (
  theme: ExtendedTheme, screenHeight: number,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    inputsView: {
      flexDirection: 'row',
      alignContent: 'center',
    },
    phoneNumberView: {
      flex: 1,
    },
    inputContainer: {
      marginVertical: 0,
    },
    inputStyle: {
      borderRadius: spacing.borderRadius.large,
    },
    listView: {
      paddingHorizontal: spacing.padding.small,
    },
    buttonDropDown: {
      borderRadius: spacing.borderRadius.large,
      borderWidth: 1,
      borderColor: colors.neutral5,
      height: 46,
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingLeft: spacing.padding.large,
      marginRight: spacing.margin.small,
      minWidth: 80,
    },
    buttonDropDownContent: {
      justifyContent: 'space-between',
    },
    contentComponent: {
      maxHeight: 0.5 * screenHeight,
    },
    searchInput: {
      marginHorizontal: spacing.margin.base,
    },
    divider: {
      marginTop: spacing.margin.small,
    },
    textErrorPhoneNumber: {
      marginTop: spacing.margin.tiny,
    },
  });
};
