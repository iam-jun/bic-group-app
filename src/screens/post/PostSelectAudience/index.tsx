import React, { FC, useMemo } from 'react';
import {
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { isEmpty } from 'lodash';
import { useBaseHook } from '~/hooks';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import { useRootNavigation } from '~/hooks/navigation';
import {
  checkChangeAudiences,
  ISelectAudienceParams,
} from './SelectAudienceHelper';
import { ICreatePostParams, PostType } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import spacing from '~/theme/spacing';
import useMounted from '~/hooks/mounted';
import SelectAudience, { ContentType } from '~/components/SelectAudience';
import useSelectAudienceStore from '~/components/SelectAudience/store';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import useModalStore from '~/store/modal';
import useCreatePostStore from '../CreatePost/store';
import { getAllAudiences } from '~/helpers/common';
import useValidateSeriesTags from '~/components/ValidateSeriesTags/store';
import { getParamsValidateSeriesTags } from '../CreatePost/helper';

export interface PostSelectAudienceProps {
  route?: {
    params?: ISelectAudienceParams;
  };
}

const PostSelectAudience: FC<PostSelectAudienceProps> = ({
  route,
}) => {
  const { isFirstStep, ...createPostParams } = route?.params || {};

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const isValidating = useValidateSeriesTags((state) => state.isValidating);
  const validateSeriesTagsActions = useValidateSeriesTags(
    (state) => state.actions,
  );

  const allAudiences = useSelectAudienceStore((state) => state.selectedAudiences);
  const chosenAudiences = useCreatePostStore((state) => state.createPost.chosenAudiences || []);
  const selectAudienceActions = useSelectAudienceStore((state) => state.actions);

  const createPostStoreActions = useCreatePostStore((state) => state.actions);

  const isEditAudience = !isEmpty(chosenAudiences);

  const selectedAudiences = useMemo(() => getAllAudiences(allAudiences), [allAudiences]);
  const alertActions = useModalStore((state) => state.actions);

  // check audience has been changed, currently check only group
  // when allow select user as audience, this function should be updated
  const isAudiencesHasChanged = useMemo(
    () => checkChangeAudiences(chosenAudiences, selectedAudiences),
    [selectedAudiences],
  );

  const buttonSaveDisabled = isValidating || isEmpty(selectedAudiences) || !isAudiencesHasChanged;

  useMounted(() => {
    const audiences = {};
    chosenAudiences?.forEach((item) => { audiences[item?.id] = item; });

    selectAudienceActions.setSelectedAudiences(audiences);
  });

  const showAlert = (title, content) => {
    alertActions.showAlert({
      title,
      content,
      cancelBtn: true,
      cancelLabel: t('common:btn_discard'),
      confirmLabel: t('common:btn_stay_here'),
      onCancel: rootNavigation.goBack,
    });
  };

  const saveAudiences = () => {
    createPostStoreActions.updateCreatePost({ chosenAudiences: selectedAudiences });
  };

  const onPressBack = () => {
    if (isFirstStep && isAudiencesHasChanged) {
      showAlert(t('post:create_post:title_discard_audience'), t('post:create_post:text_discard_audience'));
    } else if (isEditAudience && isAudiencesHasChanged) {
      showAlert(t('discard_alert:title'), t('discard_alert:content'));
    } else {
      rootNavigation.goBack();
    }
  };

  const validateSeriesTags = (
    onSuccess: (response) => void,
    onError: (error) => void,
  ) => {
    const validateParams = getParamsValidateSeriesTags(selectedAudiences);
    validateSeriesTagsActions.validateSeriesTags(validateParams, onSuccess, onError);
  };

  const saveSelectedAudienceWithValidate = (onValidateSeriesTagsSuccess: () => void) => {
    const onSuccess = onValidateSeriesTagsSuccess;
    const onError = (error) => {
      validateSeriesTagsActions.handleSeriesTagsError({
        error,
        onNext: () => saveSelectedAudienceWithValidate(onValidateSeriesTagsSuccess),
        postType: PostType.POST,
      });
    };
    validateSeriesTags(onSuccess, onError);
  };

  // change audiences of a published post or draft post
  // need to validate series and tags
  const onConfirmSaveAudienceEditingPost = () => {
    Keyboard.dismiss();
    const onValidateSeriesTagsSuccess = () => {
      saveAudiences();
      rootNavigation.goBack();
    };
    saveSelectedAudienceWithValidate(onValidateSeriesTagsSuccess);
  };

  const onPressSave = () => {
    // first step in flow select audience before create post
    if (isFirstStep) {
      saveAudiences();
      const params: ICreatePostParams = {
        ...createPostParams,
      };
      rootNavigation.replace(
        homeStack.createPost, params as any,
      );
    } else if (isEditAudience && isAudiencesHasChanged) {
      alertActions.showAlert({
        title: t('post:create_post:title_audience_changed'),
        content: t('post:create_post:text_discard_change_audience'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('post:create_post:btn_save_change'),
        onConfirm: onConfirmSaveAudienceEditingPost,
      });
    } else {
      rootNavigation.goBack();
    }
  };

  return (
    <ScreenWrapper isFullView style={styles.container}>
      <View style={styles.container}>
        <Header
          title="post:title_post_to"
          titleTextProps={{ useI18n: true }}
          buttonText="common:btn_next"
          buttonProps={{
            useI18n: true,
            disabled: buttonSaveDisabled,
            loading: isValidating,
            testID: 'select_audience.btn_done',
          }}
          onPressButton={onPressSave}
          onPressBack={onPressBack}
        />
        <SelectAudience contentType={ContentType.POST} />
      </View>
      <KeyboardSpacer iosOnly />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    searchInput: {
      margin: spacing?.margin.large,
    },
    item: {
      height: undefined,
      paddingHorizontal: undefined,
    },
    sectionHeaderContainer: {
      backgroundColor: colors.white,
    },
    sectionHeaderText: {
      marginVertical: spacing?.margin.small,
    },
  });
};

export default PostSelectAudience;
