import React, { useEffect, useRef } from 'react';
import {
  FlatList, ScrollView, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { fontFamilies } from '~/theme/fonts';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import Button from '~/beinComponents/Button';
import Toggle from '~/baseComponents/Toggle';

import { useRootNavigation } from '~/hooks/navigation';
import modalActions from '~/storeRedux/modal/actions';

import { useBaseHook } from '~/hooks';
import { formatDate } from '~/utils/formatData';
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
    selectingDate,
    selectingTime,
    disableButtonSave,
    showWarning,
    sCanComment,
    sCanReact,
    setSelectingDate,
    setSelectingTime,
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
          <Text.BodyS color={colors.danger}>{` ${list[0]?.name}`}</Text.BodyS>
        );
      case 2:
        return (
          <Text.BodyS
            color={
              colors.danger
            }
          >
            {` ${list[0]?.name}, ${list[1]?.name}`}
          </Text.BodyS>
        );
      case 3:
        return (
          <Text.BodyS
            color={
              colors.danger
            }
          >
            {` ${list[0]?.name}, ${list[1]?.name}, ${list[2]?.name}`}
          </Text.BodyS>
        );
      default:
        return (
          <Text.BodyS color={colors.danger}>
            {` ${list[0]?.name}, ${list[1]?.name}, ${t('post:and')} `}
            <Text.BodySMedium
              color={colors.danger}
              style={{ textDecorationLine: 'underline' }}
              onPress={onPressAudiences}
            >
              {`${t('common:text_more').replace('(number)', list.length - 2)}`}
            </Text.BodySMedium>
          </Text.BodyS>
        );
    }
  };

  const renderImportantDate = () => {
    const { expires_time } = sImportant || {};
    let date = t('common:text_set_date');
    let time = t('common:text_set_time');

    if (expires_time) {
      date = formatDate(
        expires_time, 'MMM Do, YYYY',
      );
      time = formatDate(
        expires_time, 'hh:mm A', undefined, 9999,
      );
    }

    return (
      <View style={styles.importantButtons}>
        <Button.Secondary
          testID="post_settings.important.btn_date"
          leftIcon="Calendar"
          leftIconProps={{ icon: 'Calendar', size: 20 }}
          style={styles.buttonDate}
          onPress={() => setSelectingDate(true)}
          color={colors.gray40}
          textProps={{ color: colors.neutral80 }}
        >
          {date}
        </Button.Secondary>
        <Button.Secondary
          testID="post_settings.important.btn_time"
          leftIcon="Clock"
          leftIconProps={{ icon: 'Clock', size: 20 }}
          style={styles.buttonTime}
          onPress={() => setSelectingTime(true)}
          color={colors.gray40}
          textProps={{ color: colors.neutral80 }}
        >
          {time}
        </Button.Secondary>
      </View>
    );
  };

  const renderImportant = () => {
    const { active } = sImportant || {};

    return (
      <View style={styles.content}>
        <View
          style={[
            styles.row,
            sImportant.active ? styles.active : styles.important,
          ]}
        >
          <View style={[styles.flex1]}>
            <Text style={[styles.flex1]} useI18n>
              post:mark_as_important
            </Text>
            {sImportant?.active ? (
              <Text.BodyS
                useI18n
                testID="post_settings.expire_time_desc"
                color={colors.gray50}
                style={{ fontFamily: fontFamilies.BeVietnamProSemiBold }}
              >
                post:expire_time_desc
              </Text.BodyS>
            ) : null}
          </View>
          <Toggle
            testID="post_settings.toggle_important"
            isChecked={sImportant?.active}
            onPress={handleToggleImportant}
          />
        </View>
        {!!showWarning && listAudiencesWithoutPermission?.length > 0 ? (
          <Text.BodyS color={colors.danger} style={styles.warningText}>
            {`${t('post:text_important_warning_1')}`}
            {renderListAudienceWithoutPermission(listAudiencesWithoutPermission)}
            {`${t('post:text_important_warning_2')}`}
          </Text.BodyS>
        ) : null}
        {!!active && listAudiencesWithoutPermission?.length < 1 && renderImportantDate()}
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
        <Text style={[styles.flex1]} useI18n>
          post:people_can_comment
        </Text>
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
        <Text style={[styles.flex1]} useI18n>
          post:people_can_react
        </Text>
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
        title="post:settings"
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
        <View style={{ position: 'absolute', alignSelf: 'center' }}>
          {selectingDate && (
            <DateTimePicker
              isVisible={selectingDate}
              date={
                sImportant.expires_time
                  ? new Date(sImportant.expires_time)
                  : new Date()
              }
              minDate={getMinDate()}
              maxDate={getMaxDate()}
              mode="date"
              onConfirm={handleChangeDatePicker}
              onCancel={handleChangeDatePicker}
              testID="post_settings.important.date_picker"
            />
          )}
          {selectingTime && (
            <DateTimePicker
              isVisible={selectingTime}
              date={
                sImportant.expires_time
                  ? new Date(sImportant.expires_time)
                  : new Date()
              }
              minDate={getMinDate()}
              maxDate={getMaxDate()}
              mode="time"
              onConfirm={handleChangeTimePicker}
              onCancel={handleChangeTimePicker}
              testID="post_settings.important.time_picker"
            />
          )}
        </View>
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
    container: { backgroundColor: colors.white, flex: 1 },
    row: { flexDirection: 'row', alignItems: 'center' },
    flex1: { flex: 1 },
    content: {
      marginBottom: spacing.margin.extraLarge,
      marginLeft: spacing.margin.large,
      marginRight: spacing.margin.base,
      justifyContent: 'center',
    },
    important: { marginTop: spacing.margin.base },
    active: { marginTop: spacing.margin.tiny },
    importantButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.padding.base,
    },
    buttonDate: {
      flex: 1,
      marginRight: spacing.margin.base,
      backgroundColor: colors.gray10,
      padding: spacing.padding.base,
    },
    buttonTime: {
      flex: 1,
      backgroundColor: colors.gray10,
      padding: spacing.padding.base,
    },
    warningText: {
      marginTop: spacing.padding.base,
    },
  });
};

export default PostSettings;
