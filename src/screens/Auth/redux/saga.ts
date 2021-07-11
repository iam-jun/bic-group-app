import {put, call, takeLatest} from 'redux-saga/effects';
import {Auth} from 'aws-amplify';

import {authStack, rootSwitch} from '~/configs/navigator';
import * as types from './constants';
import * as IAuth from '~/interfaces/IAuth';
import * as refNavigator from '~/utils/refNavigator';
import * as storage from '~/utils/localStorage';
import * as actions from './actions';
import * as actionsCommon from '~/store/modal/actions';
import {ERROR} from '~/constants/common';
import {convertMultiLanguage} from '~/utils/language';
import {IObject} from '~/interfaces/common';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth/lib/types/Auth';
import {IUserResponse} from '~/interfaces/IAuth';

export default function* authSaga() {
    yield takeLatest(types.SIGN_IN, signIn);
    yield takeLatest(types.SIGN_UP, signUp);
    yield takeLatest(types.SIGN_IN_OAUTH, signInOAuth);
    yield takeLatest(types.FORGOT_PASSWORD, forgotPassword);
    yield takeLatest(types.CHANGE_PASSWORD, forgotPasswordSubmit);
    yield takeLatest(types.SIGN_OUT, signOut);
    yield takeLatest(types.CHECK_AUTH_STATE, checkAuthState);
    yield takeLatest(types.SIGN_IN_SUCCESS, signInSuccess);
}

const languages = convertMultiLanguage();

/**
 * SignIn
 * @param payload
 * @returns {IterableIterator<*>}
 */

function* signIn({payload}: { type: string; payload: IAuth.ISignIn }) {
    try {
        yield put(actions.setLoading(true));
        const {email, password} = payload;
        const userResponse: IObject<any> = yield Auth.signIn(email, password);
        const user = {
            ...userResponse,
            ...userResponse.attributes,
        };
        yield onSignInSuccess(user);
    } catch (err) {
        yield put(actions.setLoading(false));
        yield put(actionsCommon.showAlert({title: ERROR, content: err.message}));
    }
}

function* signInOAuth({
                          payload,
                      }: {
    type: string;
    payload: CognitoHostedUIIdentityProvider;
}) {
    try {
        const userResponse: IObject<any> = yield call(federatedSignIn, payload);
        const user = {
            ...userResponse,
            ...userResponse.attributes,
        };
        yield onSignInSuccess(user);
    } catch (e) {
        console.log(e);
    }
}

function* signInSuccess({payload}: { type: string; payload: IUserResponse }) {
    yield onSignInSuccess(payload);
}

function* onSignInSuccess(user: IUserResponse) {
    yield storage.setUser(user);
    yield put(actions.setUser(user));
    yield put(actions.setLoading(false));

    refNavigator.replace(rootSwitch.mainStack);
}

function federatedSignIn(provider: CognitoHostedUIIdentityProvider) {
    return new Promise((resolve, reject) => {
        Auth.federatedSignIn({provider}).then(result => {
            Auth.currentAuthenticatedUser().then(userResponse => {
                resolve(userResponse);
            });
        });
    });
}

function* signUp({payload}: { type: string; payload: IAuth.ISignUp }) {
    const {username, email, password} = payload;
    try {
        yield put(actions.setLoading(true));

        const response: IAuth.ISignUpResponse = yield Auth.signUp({
            username: email,
            password,
            attributes: {
                email,
                name: username,
            },
        });
        if (response) {
            yield put(actions.setLoading(false));

            yield put(
                actionsCommon.showAlert({
                    title: languages.auth.text_title_success,
                    content: languages.auth.text_sign_up_success,
                    onConfirm: () => refNavigator.navigate(authStack.login),
                }),
            );
        }
    } catch (err) {
        yield put(actions.setLoading(false));

        yield put(actionsCommon.showAlert({title: ERROR, content: err.message}));
    }
}

function* forgotPassword({payload}: {
    type: string;
    payload: IAuth.IForgotPassword;
}) {
    const {email, callback} = payload;
    try {
        yield put(actions.setLoading(true));
        yield Auth.forgotPassword(email);
        yield put(actions.setLoading(false));
        callback();
    } catch (err) {
        yield put(actions.setLoading(false));
        yield put(actionsCommon.showAlert({title: ERROR, content: err.message}));
    }
}

function* forgotPasswordSubmit({payload}: {
    type: string;
    payload: IAuth.IForgotPasswordRequest;
}) {
    const {code, email, password, callback} = payload;
    try {
        yield put(actions.setLoading(true));
        yield Auth.forgotPasswordSubmit(email, code, password);
        yield put(actions.setLoading(false));
        callback(undefined);
    } catch (err) {
        yield put(actions.setLoading(false));
        callback(err);
    }
}

function* signOut() {
    try {
        yield storage.removeUser();
        yield Auth.signOut();
        refNavigator.replace(rootSwitch.authStack);
    } catch (err) {
        yield put(actionsCommon.showAlert({title: ERROR, content: err.message}));
    }
}

function* checkAuthState() {
    try {
        const user: IAuth.IUser = yield storage.getUser();
        if (user) {
            yield put(actions.setUser(user));
            refNavigator.replace(rootSwitch.mainStack);
        } else {
            refNavigator.replace(rootSwitch.authStack);
        }
    } catch (e) {
        console.error('checkAuthState', e);
    }
}
