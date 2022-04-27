import React from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import Button from '~/beinComponents/Button';
import Toggle from '~/beinComponents/SelectionControl/Toggle';

import {useDispatch} from 'react-redux';

import {useRootNavigation} from '~/hooks/navigation';
import modalActions from '~/store/modal/actions';

import {useBaseHook} from '~/hooks';
import {formatDate} from '~/utils/formatData';
import {usePostSettings} from '~/screens/Post/PostSettings/usePostSettings';
import useCreatePost from '~/screens/Post/CreatePost/useCreatePost';
import {IPostSettingsParams} from '~/interfaces/IPost';

export interface PostSettingsProps {
  route?: {
    params?: IPostSettingsParams;
  };
}

const PostSettings = ({route}: PostSettingsProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;

  const styles = createStyle(theme);

  const screenParams = route?.params || {};
  const {postId} = screenParams;
  if (postId) {
    useCreatePost({screenParams});
  }

  const {
    sImportant,
    selectingDate,
    selectingTime,
    disableButtonSave,
    setSelectingDate,
    setSelectingTime,
    handlePressSave,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    getMinDate,
    getMaxDate,
  } = usePostSettings({postId});

  const onPressBack = () => {
    if (disableButtonSave) {
      rootNavigation.goBack();
    } else {
      dispatch(
        modalActions.showAlert({
          title: t('common:label_discard_changes'),
          content: t('common:text_discard_warning'),
          showCloseButton: true,
          cancelBtn: true,
          cancelLabel: t('common:btn_continue_editing'),
          confirmLabel: t('common:btn_discard'),
          onConfirm: () => {
            rootNavigation.goBack();
          },
          stretchOnWeb: true,
        }),
      );
    }
  };

  const renderImportantDate = () => {
    const {expires_time} = sImportant || {};
    let date = t('common:text_set_date');
    let time = t('common:text_set_time');

    if (expires_time) {
      date = formatDate(expires_time, 'MMM Do, YYYY');
      time = formatDate(expires_time, 'hh:mm A', undefined, 9999);
    }

    return (
      <View style={styles.importantButtons}>
        <Button.Secondary
          testID={'post_settings.important.btn_date'}
          leftIcon={'CalendarAlt'}
          leftIconProps={{icon: 'CalendarAlt', size: 20}}
          style={styles.buttonDate}
          onPress={() => setSelectingDate(true)}
          color={colors.bgHover}
          textProps={{color: colors.textPrimary}}
          contentStyle={
            Platform.OS === 'web' ? {padding: spacing.padding.base} : {}
          }>
          {date}
        </Button.Secondary>
        <Button.Secondary
          testID={'post_settings.important.btn_time'}
          leftIcon={'Clock'}
          leftIconProps={{icon: 'Clock', size: 20}}
          style={styles.buttonTime}
          onPress={() => setSelectingTime(true)}
          color={colors.bgHover}
          textProps={{color: colors.textPrimary}}
          contentStyle={
            Platform.OS === 'web' ? {padding: spacing.padding.base} : {}
          }>
          {time}
        </Button.Secondary>
      </View>
    );
  };

  const renderImportant = () => {
    const {active} = sImportant || {};

    return (
      <View style={styles.content}>
        <View
          style={[
            styles.row,
            sImportant.active ? styles.active : styles.important,
          ]}>
          <View style={[styles.flex1]}>
            <Text style={[styles.flex1]} useI18n>
              post:mark_as_important
            </Text>
            {sImportant?.active ? (
              <Text.Subtitle
                useI18n
                testID="post_settings.expire_time_desc"
                color={colors.textSecondary}
                style={{fontFamily: fontFamilies.OpenSansSemiBold}}>
                post:expire_time_desc
              </Text.Subtitle>
            ) : null}
          </View>
          <Toggle
            testID={'post_settings.toggle_important'}
            isChecked={sImportant?.active}
            onActionPress={handleToggleImportant}
          />
        </View>
        {!!active && renderImportantDate()}
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.surface}>
      <Header
        titleTextProps={{useI18n: true}}
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
        </ScrollView>
        <View style={{position: 'absolute', alignSelf: 'center'}}>
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
              mode={Platform.OS === 'web' ? 'time' : 'date'}
              onConfirm={handleChangeDatePicker}
              onCancel={handleChangeDatePicker}
              testID={'post_settings.important.date_picker'}
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
              mode={'time'}
              onConfirm={handleChangeTimePicker}
              onCancel={handleChangeTimePicker}
              testID={'post_settings.important.time_picker'}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {backgroundColor: colors.background, flex: 1},
    row: {flexDirection: 'row', alignItems: 'center'},
    flex1: {flex: 1},
    content: {
      marginBottom: spacing.margin.extraLarge,
      marginLeft: spacing.margin.large,
      marginRight: spacing.margin.base,
      justifyContent: 'center',
    },
    important: {marginTop: spacing.margin.base},
    active: {marginTop: spacing.margin.tiny},
    importantButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.padding.base,
    },
    buttonDate: {
      flex: 1,
      marginRight: spacing.margin.base,
      backgroundColor: colors.bgHover,
      padding: spacing.padding.base,
      ...Platform.select({
        web: {padding: 0},
      }),
    },
    buttonTime: {
      flex: 1,
      backgroundColor: colors.bgHover,
      padding: spacing.padding.base,
      ...Platform.select({
        web: {padding: 0},
      }),
    },
  });
};

export default PostSettings;
