import React from 'react';
import {Container, Image, Text} from "~/components";
import images from "~/resources/images";
import {Controller} from "react-hook-form";
import Input from "~/components/inputs";
import * as validation from "~/constants/commonRegex";
import PrimaryButton from "~/components/buttons/PrimaryButton";
import {useBaseHook} from "~/hooks";
import {IObject} from "~/interfaces/common";
import {StyleSheet} from "react-native";
import {useTheme} from "react-native-paper";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import {useDispatch} from "react-redux";
import * as actions from '~/screens/Auth/redux/actions';

interface Props {
    useFormData: IObject<any>,
}

const ForgotInputId: React.FC<Props> = ({ useFormData }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const {t} = useBaseHook();
    const styles = themeStyles(theme);

    const requesting = false; //todo update this

    const {
        control,
        getValues,
        setError,
        clearErrors,
        setValue,
        formState: {errors},
        trigger,
    } = useFormData;

    const onRequestForgotPassword = () => {
        const email = getValues('email');
        if (email) {
            dispatch(actions.forgotPasswordRequest(email));
        }
    }

    const validateEmail = debounce(async () => {
        await trigger('email');
    }, 50);

    const checkDisableRequest = () => {
        const email = getValues('email');
        return requesting || !email || !isEmpty(errors.email);
    };
    const disableRequest = checkDisableRequest();

    return (
        <>
            <Image resizeMode="contain" style={styles.logo} source={images.beinLogo}/>
            <Container fluid style={{flex: 1}}>
                <Text h4 bold>{t('auth:text_forgot_password')}</Text>
                <Text style={styles.desc}>{t('auth:text_forgot_password_input_desc')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <Input
                            testID="inputEmail"
                            label={t('auth:input_label_email')}
                            placeholder={t('auth:input_label_email')}
                            autoCapitalize="none"
                            value={value}
                            editable={!requesting}
                            error={errors.email}
                            onChangeText={text => {
                                onChange(text);
                                validateEmail();
                            }}
                            helperType="error"
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
                    defaultValue=""
                />
            </Container>
            <PrimaryButton
                testID="btnSend"
                disabled={disableRequest}
                loading={requesting}
                title={t('auth:btn_send')}
                onPress={onRequestForgotPassword}
            />
        </>
    );
}

const themeStyles = (theme: IObject<any>) => {
    const {spacing} = theme;
    return StyleSheet.create({
        desc: {
            marginTop: spacing.margin.tiny,
            marginBottom: spacing.margin.large,
        },
        logo: {
            width: 64,
            height: 64,
            marginVertical: spacing.margin.big,
        },
    });
}

export default ForgotInputId;
