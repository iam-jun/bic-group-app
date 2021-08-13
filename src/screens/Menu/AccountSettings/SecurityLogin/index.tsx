import React from 'react';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import * as modalActions from '~/store/modal/actions';

import {ISetting} from '~/interfaces/common';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {securityLoginMenu} from '~/constants/settings';

const SecurityLogin = () => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();

  const onSecurityLoginPress = (item: ISetting) => {
    switch (item.type) {
      case 'changePassword':
        dispatch(
          modalActions.showAlert({
            title: 'Change password',
            content: 'Nothing to look here 😏😏😏',
            onConfirm: () => dispatch(modalActions.hideAlert()),
            confirmLabel: 'Got it',
          }),
        );
        return;

      default:
        dispatch(
          modalActions.showAlert({
            title: 'Info',
            content:
              'Function has not been developed. Stay tuned for further releases 😀',
            onConfirm: () => dispatch(modalActions.hideAlert()),
            confirmLabel: 'Got it',
          }),
        );
    }
  };

  return (
    <ScreenWrapper testID="SecurityAndLogin" isFullView>
      <Header title={t('settings:title_security_login')} />
      <ListView
        type="menu"
        data={securityLoginMenu}
        scrollEnabled={false}
        onItemPress={onSecurityLoginPress}
      />
    </ScreenWrapper>
  );
};

export default SecurityLogin;
