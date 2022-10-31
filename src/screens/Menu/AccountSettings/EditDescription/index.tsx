import React, { useState } from 'react';
import {
  Keyboard,
} from 'react-native';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import { TextArea } from '~/baseComponents/Input';
import useCommonController from '~/screens/store';
import useMenuController from '../../store';

const EditDescription = () => {
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const myProfileData = useCommonController((state) => state.myProfile);
  const { id, description } = myProfileData;
  const actions = useMenuController((state) => state.actions);

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
    actions.editMyProfile({
      data: {
        id,
        description:
            descriptionText?.trim?.()?.length > 0 ? descriptionText : '',
      },
      editFieldToastMessage: null,
      callback: navigateBack,
    });
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
