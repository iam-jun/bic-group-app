import React, { useEffect, useRef } from 'react';
import {
  FlatList, ScrollView, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';
import Toggle from '~/baseComponents/Toggle';
import MarkImportant from '~/components/ContentSettings/MarkImportant';
import { useBackPressListener } from '~/hooks/navigation';
import { usePostSettings } from '~/screens/post/PostSettings/usePostSettings';
import { IPostSettingsScreenParams } from '~/interfaces/IPost';
import spacing from '~/theme/spacing';
import BottomSheet from '~/baseComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import images from '~/resources/images';
import { timeSuggest } from '~/constants/importantTimeSuggest';
import useCreatePost from '../CreatePost/hooks/useCreatePost';
import useCreatePostStore from '../CreatePost/store';

export interface PostSettingsProps {
  route?: {
    params?: IPostSettingsScreenParams;
  };
}

const PostSettings = ({ route }: PostSettingsProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const audienceSheetRef = useRef<any>();
  const expireTimeSheetRef = useRef<any>();

  const screenParams = route?.params || {};
  const { postId, isFromPostMenuSettings } = screenParams;

  // in case of going directly to PostSetting from post's menu
  // we have postId, and useCreatePost will init create post store
  // if go to PostSetting from CreatePost, then we already have the data create post store,
  // so you may or may not need to pass the postId in screenParams
  const { audienceListWithNoPermission: listAudiencesWithoutPermission } = useCreatePost({ screenParams });

  const resetCreatePostStore = useCreatePostStore((state) => state.reset);

  useEffect(
    () => () => {
      // in case of going directly to PostSetting from post's menu
      // when navigate back, need to clear create post store
      if (isFromPostMenuSettings) {
        resetCreatePostStore();
      }
    }, [],
  );

  const {
    sImportant,
    disableButtonSave,
    loading,
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
    handleBack,
  } = usePostSettings({ postId, listAudiencesWithoutPermission });

  const disabled = disableButtonSave || loading;

  useBackPressListener(handleBack);

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
    <ScreenWrapper testID="post_settings" isFullView backgroundColor={colors.neutral1}>
      <Header
        titleTextProps={{ useI18n: true }}
        title={!!postId ? 'post:post_menu_edit_settings' : 'common:settings'}
        buttonText="post:save"
        onPressBack={handleBack}
        onPressButton={handlePressSave}
        buttonVariant="Secondary"
        buttonProps={{
          disabled,
          loading,
          useI18n: true,
          testID: 'post_settings.btn_save',
        }}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <MarkImportant
            type="post"
            dataImportant={sImportant}
            showWarning={showWarning}
            onPressAudiences={onPressAudiences}
            listAudiencesWithoutPermission={listAudiencesWithoutPermission}
            handleToggleImportant={handleToggleImportant}
            handleDropDown={handleDropDown}
            showCustomExpire={showCustomExpire}
            getMinDate={getMinDate}
            getMaxDate={getMaxDate}
            handleChangeDatePicker={handleChangeDatePicker}
            handleChangeTimePicker={handleChangeTimePicker}
          />
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
    expireTimeDesc: {
      marginTop: spacing.margin.tiny,
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
