import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import TextInput from '~/beinComponents/inputs/TextInput';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../redux/keySelector';
import * as validation from '~/constants/commonRegex';
import menuActions from '../../redux/actions';
import {useRootNavigation} from '~/hooks/navigation';

const EditEmail = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const myProfile = useKeySelector(menuKeySelector.myProfile);
  const {id, email} = myProfile || {};
  const emailEditError = useKeySelector(menuKeySelector.emailEditError);

  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    clearAllErrors();
  }, []);

  useEffect(() => {
    emailEditError && showErrors();
  }, [emailEditError]);

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
    const validEmail = await validateEmail();
    if (!validEmail) {
      setShowSaveButton(false);
      return;
    }

    const email = getValues('email');
    dispatch(
      menuActions.editMyProfile(
        {id, email},
        i18next.t('settings:title_email'),
        navigateBack,
      ),
    );
  };

  const validateEmail = async () => {
    return await trigger('email');
  };

  const showErrors = () => {
    setShowSaveButton(false);
    setError('email', {
      type: 'validate',
      message: emailEditError,
    });
  };

  const clearAllErrors = () => {
    clearErrors('email');
    dispatch(menuActions.setEmailEditError(''));
  };

  return (
    <ScreenWrapper testID="EditEmail" isFullView>
      <Header
        title={'settings:title_edit_email_address'}
        titleTextProps={{useI18n: true}}
        buttonText={'common:text_save'}
        buttonProps={{
          useI18n: true,
          highEmphasis: true,
        }}
        onPressButton={showSaveButton ? onSave : undefined}
        onPressBack={navigateBack}
      />

      <View style={styles.editEmail}>
        <Controller
          name="email"
          defaultValue={email}
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              label={i18next.t('settings:title_email')}
              value={value}
              style={styles.textinput}
              onChangeText={(text: string) => {
                onChange(text);
                !showSaveButton && setShowSaveButton(true);
                clearAllErrors();
              }}
              error={errors.email}
              helperContent={errors?.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
          rules={{
            required: i18next.t('auth:text_err_email_blank') as string,
            pattern: {
              value: validation.emailRegex,
              message: i18next.t('settings:text_wrong_email_format'),
            },
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default EditEmail;

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    editEmail: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.base,
    },
    textinput: {
      flex: 1,
    },
  });
};
