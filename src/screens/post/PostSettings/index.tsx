import React, { useEffect, useRef } from 'react';
import {
  FlatList, ScrollView, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';
import Toggle from '~/baseComponents/Toggle';

import { useRootNavigation } from '~/hooks/navigation';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import modalActions from '~/storeRedux/modal/actions';

import { useBaseHook } from '~/hooks';
import { usePostSettings } from '~/screens/post/PostSettings/usePostSettings';
import useCreatePost from '~/screens/post/CreatePost/hooks/useCreatePost';
import { IPostSettingsParams } from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import spacing from '~/theme/spacing';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '../../../storeRedux/post/keySelector';
import BottomSheet from '~/baseComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import images from '~/resources/images';
import { isPostExpired } from '~/helpers/post';
import Icon from '~/baseComponents/Icon';
import { formatDate } from '~/utils/formatData';
import { timeSuggest } from '~/constants/importantTimeSuggest';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { DateInput } from '~/baseComponents/Input';
import { Button } from '~/baseComponents';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';

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

  const audienceSheetRef = useRef<any>();
  const expireTimeSheetRef = useRef<any>();

  let chosenAudiences: any[];
  const screenParams = route?.params || {};
  const { postId } = screenParams;
  if (postId) {
    useCreatePost({ screenParams });
    chosenAudiences = usePostsStore(postsSelector.getAudience(postId))?.groups;
  } else {
    chosenAudiences = useKeySelector(postKeySelector.createPost.chosenAudiences);
  }

  const { getAudienceListWithNoPermission } = useMyPermissionsStore((state) => state.actions);

  const listAudiencesWithoutPermission = getAudienceListWithNoPermission(
    chosenAudiences,
    PermissionKey.EDIT_POST_SETTING,
  );

  useEffect(
    () => () => {
      if (postId) {
        dispatch(postActions.clearCreatPostData());
      }
    }, [],
  );

  const {
    sImportant,
    disableButtonSave,
    showWarning,
    sCanComment,
    sCanReact,
    showCustomExpire,
    handlePressSave,
    handleToggleImportant,
    handleToggleCanComment,
    handleToggleCanReact,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handleChangeSuggestDate,
    getMinDate,
    getMaxDate,
  } = usePostSettings({ postId, listAudiencesWithoutPermission });

  const onPressBack = () => {
    if (disableButtonSave) {
      rootNavigation.goBack();
    } else {
      dispatch(modalActions.showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      }));
    }
  };

  const onPressAudiences = () => {
    audienceSheetRef.current?.open?.();
  };

  const handleDropDown = () => {
    expireTimeSheetRef.current?.open?.();
  };

  const handlePressSuggestDate = (item: any) => {
    expireTimeSheetRef?.current?.close?.();
    handleChangeSuggestDate(item);
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
    const { expiresTime, chosenSuggestedTime, neverExpires } = sImportant || {};
    const dateValue = formatDate(expiresTime, 'MMMM DD, YYYY HH:mm');
    const timeContent = chosenSuggestedTime || t('common:text_expires_on');

    return (
      <View>
        <Button onPress={handleDropDown} style={[styles.row, styles.dropdownStyle]}>
          <Text.DropdownM
            useI18n
            color={chosenSuggestedTime ? colors.neutral60 : colors.neutral20}
            style={styles.flex1}
          >
            {timeContent}
          </Text.DropdownM>
          <Icon icon="AngleDown" size={16} tintColor={colors.neutral40} />
        </Button>
        {neverExpires
          ? (
            <View style={styles.neverExpiresText}>
              <Icon icon="CircleInfo" size={16} tintColor={colors.neutral20} />
              <ViewSpacing width={spacing.margin.small} />
              <Text.BodyXS useI18n color={colors.neutral40}>common:text_never_expire</Text.BodyXS>
            </View>
          )
          : (
            <View style={styles.expiresOnTextContainer}>
              <Text.BodyS useI18n color={colors.neutral40} style={styles.expiresOnText}>
                common:text_expires_on
              </Text.BodyS>
              <Text.BodySMedium>
                {dateValue}
              </Text.BodySMedium>
            </View>
          )}
        {
          showCustomExpire
          && (
          <View style={styles.importantButtons}>
            <DateInput
              testID="post_settings.important.btn_date"
              mode="date"
              value={expiresTime}
              minDate={getMinDate()}
              maxDate={getMaxDate()}
              label={t('common:text_end_date')}
              onConfirm={handleChangeDatePicker}
              style={styles.flex1}
            />
            <ViewSpacing width={16} />
            <DateInput
              testID="post_settings.important.btn_time"
              mode="time"
              value={expiresTime}
              minDate={getMinDate()}
              maxDate={getMaxDate()}
              label={t('common:text_end_hour')}
              onConfirm={handleChangeTimePicker}
              style={styles.flex1}
            />
          </View>
          )
        }
      </View>
    );
  };

  const renderImportant = () => {
    const { active, expiresTime } = sImportant || {};
    const isExpired = isPostExpired(expiresTime);

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
            isChecked={active}
            onValueChanged={handleToggleImportant}
            disableBuiltInState
          />
        </View>
        {!!active && (listAudiencesWithoutPermission?.length < 1 || !isExpired) && renderImportantDate()}
      </View>
    );
  };

  const keyExtractor = (item: any) => JSON.stringify(item);

  const renderItem = ({
    item, titleProps, onPress = undefined, showAvatar = true,
  }:
      {item: any, titleProps?: any, showAvatar?:boolean, onPress?: any}) => (
        <PrimaryItem
          title={item?.name || item.title}
          showAvatar={showAvatar}
          avatar={showAvatar ? (item?.icon || images.img_user_avatar_default) : null}
          titleProps={titleProps}
          onPress={onPress}
        />
  );

  const renderAudienceItem = ({ item }: {item:any}) => renderItem({ item, titleProps: { variant: 'subtitleM' } });

  const renderExpireTimeItem = ({ item }: {item:any}) => renderItem({
    item,
    showAvatar: false,
    titleProps: { variant: 'bodyM', color: colors.neutral60 },
    onPress: () => handlePressSuggestDate(item),
  });

  const renderAudiencesSheet = () => (
    <FlatList
      style={[styles.expireTimeSheet, styles.audiencesSheet]}
      data={listAudiencesWithoutPermission.slice(2)}
      keyExtractor={keyExtractor}
      renderItem={renderAudienceItem}
    />
  );

  const renderExpireTimeSheet = () => (
    <FlatList
      style={styles.expireTimeSheet}
      data={timeSuggest}
      keyExtractor={keyExtractor}
      renderItem={renderExpireTimeItem}
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
        onValueChanged={handleToggleCanComment}
        disableBuiltInState
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
        disableBuiltInState
        onValueChanged={handleToggleCanReact}
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
        modalizeRef={audienceSheetRef}
        ContentComponent={renderAudiencesSheet()}
      />
      <BottomSheet
        modalizeRef={expireTimeSheetRef}
        ContentComponent={renderExpireTimeSheet()}
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
    dropdownStyle: {
      backgroundColor: colors.white,
      paddingVertical: spacing.padding.small,
      paddingLeft: spacing.padding.large,
      paddingRight: spacing.padding.base,
      borderColor: colors.neutral5,
      borderRadius: spacing.borderRadius.large,
      borderWidth: 1,
      marginTop: spacing.margin.large,
    },
    expiresOnTextContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    expiresOnText: {
      marginTop: spacing.margin.large,
    },
    neverExpiresText: {
      marginTop: spacing.margin.extraLarge,
      backgroundColor: colors.gray1,
      padding: spacing.padding.small,
      flexDirection: 'row',
      alignItems: 'center',
    },
    expireTimeSheet: {
      flex: 1,
      paddingVertical: spacing.padding.tiny,
    },
    audiencesSheet: {
      height: 400,
    },
  });
};

export default PostSettings;
