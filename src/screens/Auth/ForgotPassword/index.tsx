import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {useBaseHook} from '~/hooks';
import ScreenWrapper from '~/components/ScreenWrapper';
import {IObject} from '~/interfaces/common';
import {Container, Text, Image} from '~/components';
import ErrorBox from "~/components/ErrorBox";
import PrimaryButton from '~/components/buttons/PrimaryButton';
import images from "~/resources/images";
import {authStack} from "~/configs/navigator";
import ForgotInputId from "~/screens/Auth/ForgotPassword/components/ForgotInputId";
import ForgotInputCodePw from "~/screens/Auth/ForgotPassword/components/ForgotInputCodePw";
import {forgotPasswordStages} from "~/constants/authConstants";
import useAuth from "~/hooks/auth";
import {useDispatch} from "react-redux";
import * as actions from '~/screens/Auth/redux/actions';
import {useForm} from "react-hook-form";
import {IForgotPasswordError} from "~/interfaces/IAuth";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const {t, navigation} = useBaseHook();
    const styles = themeStyles(theme);

    const {forgotPasswordStage, forgotPasswordError} = useAuth();
    const {errBox} : IForgotPasswordError = forgotPasswordError || {};

    const useFormData = useForm();

    useEffect(() => {
        dispatch(actions.setForgotPasswordStage(forgotPasswordStages.INPUT_ID));
    }, []);

    const onClearErrorBox = () => {
        dispatch(actions.setForgotPasswordError({ errBox: '' }));
    }

    const renderComplete = () => {
        return (
            <>
                <Image resizeMode="contain" style={styles.imgComplete}
                       source={images.img_auth_forgot_password_complete}/>
                <View style={{flex: 1, justifyContent: 'space-around'}}>
                    <View>
                        <Text h4 bold>{t('auth:text_forgot_password_complete_title')}</Text>
                        <Text h5>{t('auth:text_forgot_password_complete_desc')}</Text>
                    </View>
                    <PrimaryButton
                        testID="btnComplete"
                        title={t('auth:btn_sign_in')}
                        onPress={() => navigation.navigate(authStack.login)}
                    />
                </View>
            </>
        );
    }

    return (
        <ScreenWrapper
            testID="ForgotPasswordScreen"
            isFullView>
            <Container style={styles.container}>
                {!!errBox && <ErrorBox content={errBox} onClose={onClearErrorBox}/>}
                {forgotPasswordStage === forgotPasswordStages.INPUT_ID && <ForgotInputId useFormData={useFormData} />}
                {forgotPasswordStage === forgotPasswordStages.INPUT_CODE_PW && <ForgotInputCodePw useFormData={useFormData} />}
                {forgotPasswordStage === forgotPasswordStages.COMPLETE && renderComplete()}
            </Container>
        </ScreenWrapper>
    );
};

const themeStyles = (theme: IObject<any>) => {
    const insets = useSafeAreaInsets();
    const {spacing, colors} = theme;
    return StyleSheet.create({
        container: {
            flex: 1,
            alignContent: 'center',
            paddingTop: insets.top,
            paddingBottom: insets.bottom + spacing.padding.big,
            backgroundColor: colors.white,
        },
        imgComplete: {
            width: 305,
            height: 240,
            alignSelf: 'center',
            marginVertical: spacing.margin.big,
        },
    });
};

export default ForgotPassword;
