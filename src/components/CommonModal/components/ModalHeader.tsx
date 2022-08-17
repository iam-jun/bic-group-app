import React, { FC } from 'react';

import { useDispatch } from 'react-redux';
import Header, { HeaderProps } from '~/beinComponents/Header';
import modalActions from '~/storeRedux/modal/actions';

const ModalHeader: FC<HeaderProps> = ({ ...props }: HeaderProps) => {
  const dispatch = useDispatch();

  const _onPressBack = () => {
    dispatch(modalActions.hideModal())
  }

  return (
    <Header
      disableInsetTop
      onPressBack={_onPressBack}
      {...props}
    />
  );
};

export default ModalHeader;
