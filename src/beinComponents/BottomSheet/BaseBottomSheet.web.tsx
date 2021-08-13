import React from 'react';

import {BaseBottomSheetProps} from './BaseBottomSheet';
import WebModal from '~/beinComponents/BottomSheet/WebModal';

const BaseBottomSheet: React.FC<BaseBottomSheetProps> = ({
  modalizeRef,
  isOpen = false,
  ...props
}: BaseBottomSheetProps) => {
  return <WebModal ref={modalizeRef} isOpen={isOpen} {...props} />;
};

export default BaseBottomSheet;
