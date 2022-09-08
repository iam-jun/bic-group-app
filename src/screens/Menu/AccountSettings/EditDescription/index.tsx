import React, { useState } from 'react';
import {
  Keyboard,
} from 'react-native';
import { useDispatch } from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import menuActions from '../../../../storeRedux/menu/actions';
import menuKeySelector from '../../../../storeRedux/menu/keySelector';
import { useKeySelector } from '~/hooks/selector';
import { TextArea } from '~/baseComponents/Input';

const EditDescription = () => {
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const { id, description } = myProfileData;

  const [descriptionText, setDescription] = useState<string>(description);

  const navigateBack = () => {
    Keyboard.dismiss();
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.userEdit);
    }
  };

  const onSave = () => {
    dispatch(menuActions.editMyProfile(
      {
        id,
        description:
            descriptionText?.trim?.()?.length > 0 ? descriptionText : '',
      },
      '',
      () => {
        navigateBack();
      },
    ));
  };

  const onChangeDescription = (text: string) => {
    setDescription(text);
  };

  const checkIsValid = (descriptionText: string) => description !== descriptionText;

  const isValid = checkIsValid(descriptionText);

  return (
    <ScreenWrapper isFullView>
      <Header
        title="settings:title_edit_description"
        titleTextProps={{ useI18n: true }}
        buttonText="common:text_save"
        buttonProps={{
          useI18n: true,
          disabled: !isValid,
          testID: 'edit_description.save',
        }}
        onPressButton={onSave}
        onPressBack={navigateBack}
      />
      <TextArea
        testID="edit_description"
        label={t('settings:text_description')}
        placeholder={t('common:text_not_set')}
        onChangeText={onChangeDescription}
      />
    </ScreenWrapper>
  );
};

export default EditDescription;
