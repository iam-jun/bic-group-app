import React, {useRef} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';

import {useKeySelector} from '~/hooks/selector';
import modalActions from '~/store/modal/actions';
import commonKeySelector from '~/store/modal/keySelector';
import BottomSheet from '~/beinComponents/BottomSheet';
import Text from '~/beinComponents/Text';

const UserProfilePreviewBottomSheet = () => {
  const userPreviewRef: any = useRef();

  const dispatch = useDispatch();

  const bottomSheetData = useKeySelector(
    commonKeySelector.userProfilePreviewBottomSheet,
  );
  const {isOpen, userId, position} = bottomSheetData || {};

  const onClose = () => {
    dispatch(modalActions.hideUserProfilePreviewBottomSheet());
  };
  if (isOpen) console.log('[DEBUG] showing preview', userId);

  const renderUserProfile = () => {
    console.log('DEBUG', bottomSheetData);
    return (
      <View>
        <Text.Body>User profile, {userId}</Text.Body>
      </View>
    );
  };

  return (
    <BottomSheet
      modalizeRef={userPreviewRef}
      isOpen={isOpen}
      position={position}
      onClose={onClose}
      ContentComponent={renderUserProfile()}
    />
  );
};

export default UserProfilePreviewBottomSheet;
