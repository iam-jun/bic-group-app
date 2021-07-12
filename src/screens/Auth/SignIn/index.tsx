import React, {useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from "react-redux";
import {useForm, Controller} from 'react-hook-form';
import {isEmpty, debounce} from 'lodash';
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {IObject} from '~/interfaces/common';
import {authStack} from '~/configs/navigator';
import * as validation from '~/constants/commonRegex';
import images from '~/resources/images';
import * as actions from '../redux/actions';

import {useBaseHook} from "~/hooks";
import useAuth from "~/hooks/auth";
import useAuthAmplifyHub from '~/hooks/authAmplifyHub';
import Input from '~/components/inputs';
import InputPassword from '~/components/inputs/InputPassword';
import PrimaryButton from '~/components/buttons/PrimaryButton';
import TransparentButton from '~/components/buttons/TransparentButton';
import {Container, Text, ScreenWrapper} from '~/components';
import SignInOAuth from '../components/SignInOAuth';

const SignIn = () => {
    useAuthAmplifyHub();
    const {t, navigation} = useBaseHook();
    const dispatch = useDispatch();
    const {loading, signingInError} = useAuth();

    const theme = useTheme();
    const styles = themeStyles(theme);

    const {
        control,
        formState: {errors},
        trigger,
        setError,
        clearErrors,
        getValues,
    } = useForm();

    useEffect(() => {
        const email = getValues('email');
        if (email) {
            trigger();
        }
    }, []);

    useEffect(() => {
        if (signingInError) {
            setError('password', {
                type: 'required',
                message: signingInError,
            });
        } else {
            clearErrors('password');
        }
    }, [signingInError]);

    const onSignIn = async () => {
        if (disableSignIn) {
            return;
        }
        const email = getValues('email');
        const password = getValues('password');
        dispatch(actions.signIn({email, password}));
    };

    const validateEmail = debounce(async () => {
        await trigger('email');
    }, 50);

    const validatePassword = debounce(async () => {
        await trigger('password');
    }, 50);

    const checkDisableSignIn = () => {
        const email = getValues('email');
        const password = getValues('password');
        return !isEmpty(errors) || !email || !password || loading;
    };

    const disableSignIn = checkDisableSignIn();

    return (
        <ScreenWrapper
            testID="SignInScreen"
            style={styles.container}
            isFullView>
            <Container>
                <Image resizeMode="contain" style={styles.logo} source={images.beinLogo}/>
                <Text h4 bold style={styles.desc}>
                    {t('auth:text_sign_in_desc')}
                </Text>
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <Input
                            testID="inputEmail"
                            label={t('auth:input_label_email')}
                            placeholder={t('auth:input_label_email')}
                            autoCapitalize="none"
                            editable={!loading}
                            value={value}
                            error={errors.email}
                            onChangeText={text => {
                                onChange(text);
                                validateEmail();
                            }}
                            helperType={errors.email?.message ? 'error' : undefined}
                            helperContent={errors?.email?.message}
                            helperVisible={errors.email}
                        />
                    )}
                    rules={{
                        required: t('auth:text_err_email_blank'),
                        pattern: {
                            value: validation.emailRegex,
                            message: t('auth:text_err_email_format'),
                        },
                    }}
                    name="email"
                    defaultValue={__DEV__ && 'evol@mailinator.com'}
                />
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <InputPassword
                            testID="inputPassword"
                            label={t('auth:input_label_password')}
                            placeholder={t('auth:input_label_password')}
                            error={errors.password}
                            editable={!loading}
                            value={value}
                            onChangeText={text => {
                                onChange(text);
                                validatePassword();
                            }}
                            helperType="error"
                            helperContent={errors?.password?.message}
                            helperVisible={errors.password}
                            style={{marginTop: 0, marginBottom: 0,}}
                        />
                    )}
                    name="password"
                    rules={{
                        required: t('auth:text_err_password_blank'),
                        min: 8,
                        max: 20,
                        pattern: {
                            value: validation.passwordRegex,
                            message: t('auth:text_err_password_format'),
                        },
                    }}
                    defaultValue={__DEV__ && 'ABCxyz123@'}
                />
                <TransparentButton
                    style={{alignSelf: 'flex-end'}}
                    textStyle={styles.forgotButtonText}
                    testID="btnSignInForgotPassword"
                    title={t('auth:btn_forgot_password')}
                    onPress={() => navigation.navigate(authStack.forgotPassword)}
                />
                <PrimaryButton
                    testID="btnLogin"
                    style={styles.button}
                    disabled={disableSignIn}
                    title={t('auth:btn_sign_in')}
                    loading={loading}
                    onPress={onSignIn}
                />
            </Container>
            <Container style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text h4 bold>{t('auth:text_or')}</Text>
            </Container>
            <SignInOAuth/>
            <TransparentButton
                style={styles.buttonSignUp}
                textStyle={styles.signUpWithDescButtonText}
                title={t('auth:btn_sign_up_with_desc')}
                onPress={() => navigation.navigate(authStack.signup)}
            />
        </ScreenWrapper>
    );
};

const themeStyles = (theme: IObject<any>) => {
    const insets = useSafeAreaInsets();
    const {dimension, spacing, colors} = theme;
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: insets.top,
            alignContent: 'center'
        },
        desc: {
            marginBottom: spacing.margin.large,
        },
        button: {
            marginBottom: spacing.margin.base,
            marginTop: spacing.margin.big,
        },
        logo: {
            width: 64,
            height: 64,
            marginVertical: spacing.margin.big,
        },
        forgotButtonText: {
            fontSize: dimension.sizes.h6,
            fontWeight: "bold",
        },
        signUpWithDescButtonText: {
            fontSize: dimension.sizes.h5,
            fontWeight: "bold",
        },
        buttonSignUp: {
            marginTop: spacing.margin.small,
            marginBottom: 64,
        }
    });
};

export default SignIn;
