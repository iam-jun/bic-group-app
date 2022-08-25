import React, { useEffect, useRef } from 'react';
import {
  FlatList, ScrollView, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import Toggle from '~/baseComponents/Toggle';

import { useRootNavigation } from '~/hooks/navigation';
import modalActions from '~/storeRedux/modal/actions';

import { useBaseHook } from '~/hooks';
import { usePostSettings } from '~/screens/post/PostSettings/usePostSettings';
import useCreatePost from '~/screens/post/CreatePost/hooks/useCreatePost';
import { IPostSettingsParams } from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '../../../storeRedux/post/keySelector';
import BottomSheet from '~/baseComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import images from '~/resources/images';
import { DateInput } from '~/baseComponents/Input';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface PostSettingsProps {
  route?: {
    params?: IPostSettingsParams;
  };
}

const PostSettings = ({ route }: PostSettingsProps) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const modalizeRef = useRef<any>();

  let chosenAudiences: any[];
  const screenParams = route?.params || {};
  const { postId } = screenParams;
  if (postId) {
    useCreatePost({ screenParams });
    chosenAudiences = useKeySelector(postKeySelector.postAudienceById(postId))?.groups;
  } else {
    chosenAudiences = useKeySelector(postKeySelector.createPost.chosenAudiences);
  }

  const { getListOfChosenAudiencesWithoutPermission, PERMISSION_KEY } = useMyPermissions();
  const listAudiencesWithoutPermission = getListOfChosenAudiencesWithoutPermission(
    'groups',
    chosenAudiences,
    PERMISSION_KEY.GROUP.CREATE_IMPORTANT_POST,
  );

  useEffect(
    () => () => {
      if (postId) {
        dispatch(postActions.clearCreatPostData());
        dispatch(postActions.setSearchResultAudienceGroups([]));
        dispatch(postActions.setSearchResultAudienceUsers([]));
      }
    }, [],
  );

  const {
    sImportant,
    disableButtonSave,
    showWarning,
    sCanComment,
    sCanReact,
    handlePressSave,
    handleToggleImportant,
    handleToggleCanComment,
    handleToggleCanReact,
    handleChangeDatePicker,
    handleChangeTimePicker,
    getMinDate,
    getMaxDate,
  } = usePostSettings({ postId, listAudiencesWithoutPermission });

  const onPressBack = () => {
    if (disableButtonSave) {
      rootNavigation.goBack();
    } else {
      dispatch(modalActions.showAlert({
        title: t('common:label_discard_changes'),
        content: t('common:text_discard_warning'),
        cancelBtn: true,
        cancelLabel: t('common:btn_continue_editing'),
        confirmLabel: t('common:btn_discard'),
        onConfirm: () => {
          rootNavigation.goBack();
        },
      }));
    }
  };

  const onPressAudiences = () => {
    modalizeRef.current?.open?.();
  };

  const renderListAudienceWithoutPermission = (list: any[]) => {
    if (!Array.isArray(list) || isEmpty(list)) {
      return null;
    }
    switch (list?.length) {
      case 1:
        return (
          <Text.BodyXS color={colors.danger}>{` ${list[0]?.name}`}</Text.BodyXS>
        );
      case 2:
        return (
          <Text.BodyXS
            color={
              colors.danger
            }
          >
            {` ${list[0]?.name}, ${list[1]?.name}`}
          </Text.BodyXS>
        );
      case 3:
        return (
          <Text.BodyXS
            color={
              colors.danger
            }
          >
            {` ${list[0]?.name}, ${list[1]?.name}, ${list[2]?.name}`}
          </Text.BodyXS>
        );
      default:
        return (
          <Text.BodyXS color={colors.danger}>
            {` ${list[0]?.name}, ${list[1]?.name}, ${t('post:and')} `}
            <Text.BodyXSMedium
              color={colors.danger}
              onPress={onPressAudiences}
            >
              {`${t('common:text_more').replace('(number)', list.length - 2)}`}
            </Text.BodyXSMedium>
          </Text.BodyXS>
        );
    }
  };

  const renderImportantDate = () => {
    const { expires_time } = sImportant || {};

    return (
      <View style={styles.importantButtons}>
        <DateInput
          testID="post_settings.important.btn_date"
          mode="date"
          value={expires_time}
          minDate={getMinDate()}
          maxDate={getMaxDate()}
          label={t('common:text_end_date')}
          onConfirm={handleChangeDatePicker}
          style={{ flex: 1 }}
        />
        <ViewSpacing width={16} />
        <DateInput
          testID="post_settings.important.btn_time"
          mode="time"
          value={expires_time}
          minDate={getMinDate()}
          maxDate={getMaxDate()}
          label={t('common:text_end_hour')}
          onConfirm={handleChangeTimePicker}
          style={{ flex: 1 }}
        />
      </View>
    );
  };

  const renderImportant = () => {
    const { active, expires_time } = sImportant || {};
    const notExpired = new Date().getTime() < new Date(expires_time).getTime();

    return (
      <View style={styles.content}>
        <View
          style={[
            styles.row,
            active ? styles.active : styles.important,
          ]}
        >
          <View style={[styles.flex1]}>
            <Text.SubtitleM style={[styles.flex1]} useI18n>
              post:mark_as_important
            </Text.SubtitleM>
            {(active && notExpired) ? (
              <Text.BodyXS
                useI18n
                testID="post_settings.expire_time_desc"
                color={colors.neutral40}
                style={styles.expireTimeDesc}
              >
                post:expire_time_desc
              </Text.BodyXS>
            ) : null}
            {!!showWarning && listAudiencesWithoutPermission?.length > 0 ? (
              <Text.BodyXS color={colors.danger} style={styles.warningText}>
                {`${t('post:text_important_warning_1')}`}
                {renderListAudienceWithoutPermission(listAudiencesWithoutPermission)}
                {`${t('post:text_important_warning_2')}`}
              </Text.BodyXS>
            ) : null}
          </View>
          <Toggle
            testID="post_settings.toggle_important"
            isChecked={(active && notExpired)}
            onPress={handleToggleImportant}
          />
        </View>
        {!!active && (listAudiencesWithoutPermission?.length < 1 || notExpired) && renderImportantDate()}
      </View>
    );
  };

  const keyExtractor = (item: any) => JSON.stringify(item);

  const renderBottomSheetContent = () => (
    <FlatList
      style={{ flex: 1, paddingVertical: spacing.padding.tiny, height: 400 }}
      data={listAudiencesWithoutPermission.slice(2)}
      keyExtractor={keyExtractor}
      renderItem={({ item }:any) => (
        <PrimaryItem
          title={item?.name}
          showAvatar
          avatar={item?.icon || images.img_user_avatar_default}
          titleProps={{ variant: 'subtitleM' }}
        />
      )}
    />
  );

  const renderCanComment = () => (
    <View
      style={[
        styles.row, styles.content,
      ]}
    >
      <View style={[styles.flex1]}>
        <Text.SubtitleM style={[styles.flex1]} useI18n>
          post:people_can_comment
        </Text.SubtitleM>
      </View>
      <Toggle
        testID="post_settings.toggle_can_comment"
        isChecked={sCanComment}
        onPress={handleToggleCanComment}
      />
    </View>
  );

  const renderCanReact = () => (
    <View
      style={[
        styles.row, styles.content,
      ]}
    >
      <View style={[styles.flex1]}>
        <Text.SubtitleM style={[styles.flex1]} useI18n>
          post:people_can_react
        </Text.SubtitleM>
      </View>
      <Toggle
        testID="post_settings.toggle_can_react"
        isChecked={sCanReact}
        onPress={handleToggleCanReact}
      />
    </View>
  );

  return (
    <ScreenWrapper isFullView backgroundColor={colors.neutral1}>
      <Header
        titleTextProps={{ useI18n: true }}
        title={!!postId ? 'post:post_menu_edit_settings' : 'post:settings'}
        buttonText="post:save"
        onPressBack={onPressBack}
        onPressButton={handlePressSave}
        buttonVariant="Secondary"
        buttonProps={{
          disabled: disableButtonSave,
          useI18n: true,
          testID: 'post_settings.btn_save',
        }}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderImportant()}
          {renderCanComment()}
          {renderCanReact()}
        </ScrollView>
      </View>
      <BottomSheet
        modalizeRef={modalizeRef}
        ContentComponent={renderBottomSheetContent()}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      flex: 1,
      paddingTop: spacing.padding.large,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    flex1: { flex: 1 },
    content: {
      marginBottom: spacing.margin.extraLarge,
      marginHorizontal: spacing.margin.large,
      justifyContent: 'center',
    },
    important: { marginTop: spacing.margin.base, alignItems: 'flex-start' },
    active: { marginTop: spacing.margin.tiny },
    importantButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.padding.base,
    },
    warningText: {
      marginTop: spacing.padding.base,
    },
    expireTimeDesc: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default PostSettings;
