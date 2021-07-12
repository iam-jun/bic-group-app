import React, {useEffect} from 'react';
import {Text} from "~/components";
import {Controller} from "react-hook-form";
import Input from "~/components/inputs";
import * as validation from "~/constants/commonRegex";
import PrimaryButton from "~/components/buttons/PrimaryButton";
import {useBaseHook} from "~/hooks";
import {IObject} from "~/interfaces/common";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {StyleSheet, View} from "react-native";
import {useTheme} from "react-native-paper";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import InputPassword from "~/components/inputs/InputPassword";
import * as actions from "~/screens/Auth/redux/actions";
import {useDispatch} from "react-redux";
import useAuth from "~/hooks/auth";
import {IForgotPasswordError} from "~/interfaces/IAuth";

interface Props {
    useFormData: IObject<any>,
}

const ForgotInputCodePw: React.FC<Props> = ({ useFormData }) => {
    const dispatch = useDispatch();
    const theme: IObject<any> = useTheme();
    const {t} = useBaseHook();
    const styles = themeStyles(theme);

    const {forgotPasswordError, forgotPasswordLoading} = useAuth();
    const {errConfirm} : IForgotPasswordError = forgotPasswordError || {};

    useEffect(() => {
        if (errConfirm) {
            setError("code", {
                type: "manual",
                message: errConfirm,
            });
        } else {
            clearErrors('code');
        }
    }, [errConfirm]);

    const {
        control,
        getValues,
        setError,
        clearErrors,
        setValue,
        formState: {errors},
        trigger,
    } = useFormData;

    const checkDisableConfirm = () => {
        const code = getValues('code');
        const email = getValues('email');
        const newPassword = getValues('newPassword');
        const confirmPassword = getValues('confirmPassword');
        const passwordMatched = newPassword === confirmPassword
        return !isEmpty(errors) || !email || !code || !newPassword || !confirmPassword || !passwordMatched || forgotPasswordLoading;
    }
    const disableConfirm = checkDisableConfirm();

    const checkDisableRequest = () => {
        const email = getValues('email');
        return forgotPasswordLoading || !email || !isEmpty(errors.email);
    };
    const disableRequest = checkDisableRequest();

    const onConfirmForgotPassword = () => {
        const email = getValues('email');
        const code = getValues('code');
        const newPassword = getValues('newPassword');
        const confirmPassword = getValues('confirmPassword');
        if (email && code && newPassword && confirmPassword && newPassword === confirmPassword && !disableConfirm) {
            dispatch(actions.forgotPasswordConfirm({ email, code, password: newPassword }));
        }
    }

    const onRequestForgotPassword = async () => {
        const email = getValues('email');
        if (email && !disableRequest) {
            setValue('code', '', { shouldValidate: false });
            clearErrors('code');
            dispatch(actions.forgotPasswordRequest(email));
        }
    }

    const validateCode = debounce(async () => {
        await trigger('code');
    }, 50);

    const validateNewPassword = debounce(async () => {
        await trigger('newPassword');
    }, 50);

    const validateConfirmPassword = debounce(async () => {
        await trigger('confirmPassword');
        if (getValues('newPassword') !== getValues('confirmPassword')) {
            setError("confirmPassword", {
                type: "manual",
                message: t("auth:text_err_confirm_password_not_matched"),
            });
        }
    }, 50);

    return (
        <>
            <View style={styles.inputCodePwContainer}>
                <Text h4 bold>{t('auth:text_forgot_password_input_code_title')}</Text>
                <Text h5 style={styles.inputCodePwDesc}>{t('auth:text_forgot_password_input_code_desc')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <Input
                            testID="inputCode"
                            label={t('auth:input_label_code')}
                            placeholder={t('auth:input_label_code')}
                            error={errors.code}
                            value={value}
                            keyboardType={'numeric'}
                            editable={!forgotPasswordLoading}
                            onChangeText={text => {
                                onChange(text.trim());
                                validateCode();
                            }}
                            helperType="error"
                            helperContent={errors?.code?.message}
                            helperVisible={errors.code}
                            helperAction={t('auth:text_request_new_code')}
                            helperContentTriggerAction={t('auth:text_err_wrong_code')}
                            helperOnPressAction={onRequestForgotPassword}
                        />
                    )}
                    name="code"
                    rules={{
                        required: t('auth:text_err_code'),
                        pattern: {
                            value: validation.codeRegex,
                            message: t('auth:text_err_code'),
                        },
                    }}
                    defaultValue=""
                />
                <Text h4 bold>{t('auth:text_forgot_password_input_pw_title')}</Text>
                <Text h5 style={styles.inputCodePwDesc}>{t('auth:text_forgot_password_input_pw_desc')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <InputPassword
                            testID="inputNewPassword"
                            label={t('auth:input_label_enter_new_password')}
                            placeholder={t('auth:input_label_enter_new_password')}
                            error={errors.newPassword}
                            value={value}
                            editable={!forgotPasswordLoading}
                            onChangeText={text => {
                                onChange(text);
                                validateNewPassword();
                            }}
                            helperType="error"
                            helperContent={errors?.newPassword?.message}
                            helperVisible={errors.newPassword}
                        />
                    )}
                    rules={{
                        required: t('auth:text_err_password_blank'),
                        min: 8,
                        max: 20,
                        pattern: {
                            value: validation.passwordRegex,
                            message: t('auth:text_err_password_format'),
                        },
                    }}
                    name="newPassword"
                    defaultValue=""
                />
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <InputPassword
                            testID="inputConfirmPassword"
                            label={t('auth:input_label_confirm_new_password')}
                            placeholder={t('auth:input_label_confirm_new_password')}
                            error={errors.confirmPassword}
                            value={value}
                            editable={!forgotPasswordLoading}
                            onChangeText={text => {
                                onChange(text);
                                validateConfirmPassword();
                            }}
                            helperType="error"
                            helperContent={errors?.confirmPassword?.message}
                            helperVisible={errors.confirmPassword}
                        />
                    )}
                    name="confirmPassword"
                    rules={{
                        required: t('auth:text_err_password_blank'),
                        min: 8,
                        max: 20,
                        // pattern: {
                        //   value: validation.passwordRegex,
                        //   message: t('auth:text_err_password_format'),
                        // },
                    }}
                    defaultValue=""
                />
            </View>
            <PrimaryButton
                testID="btnChangePassword"
                disabled={disableConfirm}
                loading={forgotPasswordLoading}
                title={t('auth:btn_send')}
                onPress={onConfirmForgotPassword}
            />
        </>
    );
}

const themeStyles = (theme: IObject<any>) => {
    const insets = useSafeAreaInsets();
    const {spacing} = theme;
    return StyleSheet.create({
        container: {
            flex: 1,
            alignContent: 'center',
            paddingTop: insets.top,
            paddingBottom: insets.bottom + spacing.padding.big,
        },
        inputCodePwContainer: {
            flex: 1,
            marginTop: spacing.margin.big,
        },
        button: {
            marginTop: spacing.margin.big,
        },
        desc: {
            marginTop: spacing.margin.tiny,
            marginBottom: spacing.margin.large,
        },
        logo: {
            width: 64,
            height: 64,
            marginVertical: spacing.margin.big,
        },
        imgComplete: {
            width: 305,
            height: 240,
            alignSelf: 'center',
            marginVertical: spacing.margin.big,
        },
        inputCodePwDesc: {
            marginBottom: spacing.margin.large,
        },
    });
}

export default ForgotInputCodePw;
