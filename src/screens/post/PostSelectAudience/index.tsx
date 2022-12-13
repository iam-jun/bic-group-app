import React, { FC, useMemo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { isEmpty } from 'lodash';
import { useBaseHook } from '~/hooks';

import postActions from '~/storeRedux/post/actions';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/storeRedux/post/keySelector';
import modalActions from '~/storeRedux/modal/actions';
import {
  checkChangeAudiences,
  ISelectAudienceParams,
} from './SelectAudienceHelper';
import { ICreatePostParams, IPostAudience } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import spacing from '~/theme/spacing';
import useMounted from '~/hooks/mounted';
import SelectAudience, { ContentType } from '~/components/SelectAudience';
import useSelectAudienceStore from '~/components/SelectAudience/store';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

export interface PostSelectAudienceProps {
  route?: {
    params?: ISelectAudienceParams;
  };
}

const PostSelectAudience: FC<PostSelectAudienceProps> = ({
  route,
}) => {
  const { isFirstStep, ...createPostParams } = route?.params || {};

  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const allAudiences = useSelectAudienceStore((state) => state.selectedAudiences);
  const initAudiences = useKeySelector(postKeySelector.createPost.initAudiences) || [];
  const selectAudienceActions = useSelectAudienceStore((state) => state.actions);

  const isEditAudience = !isEmpty(initAudiences);

  const selectedAudiences = useMemo(() => getAllAudiences(allAudiences), [allAudiences]);

  // check audience has been changed, currently check only group
  // when allow select user as audience, this function should be updated
  const isAudiencesHasChanged = useMemo(
    () => checkChangeAudiences(initAudiences, selectedAudiences),
    [selectedAudiences],
  );

  const buttonSaveDisabled = isEmpty(selectedAudiences) || !isAudiencesHasChanged;

  useMounted(() => {
    if (isFirstStep) {
      dispatch(postActions.clearCreatPostData());
    }
    const audiences = {};
    initAudiences?.forEach((item) => { audiences[item?.id] = item; });

    selectAudienceActions.setSelectedAudiences(audiences);
  });

  const showAlert = (title, content) => {
    dispatch(modalActions.showAlert({
      title,
      content,
      cancelBtn: true,
      cancelLabel: t('common:btn_discard'),
      confirmLabel: t('common:btn_stay_here'),
      onCancel: rootNavigation.goBack,
    }));
  };

  const saveAudiences = () => {
    dispatch(postActions.setCreatePostChosenAudiences(selectedAudiences));
    /**
       * Save new selected audiences to initAudiences
       * to avoid user press CreatePostChosenAudiences
       * and show empty audiences when creating post
       */
    // Temporary force selectedAudiences type until revamp
    dispatch(postActions.setCreatePostInitAudiences(selectedAudiences as IPostAudience));
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

  const onPressSave = () => {
    // [TO-DO] refactor useCreatePost later

    // first step in flow select audience before create post
    if (isFirstStep) {
      saveAudiences();
      const params: ICreatePostParams = {
        ...createPostParams,
        initAutoSaveDraft: true,
      };
      rootNavigation.replace(
        homeStack.createPost, params as any,
      );
    } else if (isEditAudience && isAudiencesHasChanged) {
      dispatch(modalActions.showAlert({
        title: t('post:create_post:title_audience_changed'),
        content: t('post:create_post:text_discard_change_audience'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('post:create_post:btn_save_change'),
        onConfirm: () => {
          saveAudiences();
          rootNavigation.goBack();
        },
      }));
    } else {
      dispatch(postActions.setCreatePostChosenAudiences(selectedAudiences));
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

const getAllAudiences = (selectedAudiences) => {
  const groupAudiences = Object.keys(selectedAudiences.groups).map(
    (key: string) => selectedAudiences.groups[key],
  );
  const userAudiences = Object.keys(selectedAudiences.users).map(
    (key: string) => selectedAudiences.users[key],
  );

  return groupAudiences.concat(userAudiences);
};
