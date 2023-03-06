import React, { FC } from 'react';

import Header, { HeaderProps } from '~/beinComponents/Header';
import useModalStore from '~/store/modal';

const ModalHeader: FC<HeaderProps> = ({ ...props }: HeaderProps) => {
  const modalActions = useModalStore((state) => state.actions);

  const _onPressBack = () => {
    modalActions.hideModal();
  };

  return (
    <Header
      disableInsetTop
      onPressBack={_onPressBack}
      {...props}
    />
  );
};

export default ModalHeader;
