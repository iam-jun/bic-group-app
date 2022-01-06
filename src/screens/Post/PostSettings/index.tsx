import React, {useState, useEffect} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import commonActions, {IAction} from '~/constants/commonActions';
import postActions from '~/screens/Post/redux/actions';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import Button from '~/beinComponents/Button';
import Toggle from '~/beinComponents/SelectionControl/Toggle';

import {useDispatch} from 'react-redux';

import {useRootNavigation} from '~/hooks/navigation';
import * as modalActions from '~/store/modal/actions';
import i18n from '~/localization';

import {useBaseHook} from '~/hooks';
import {useCreatePost} from '~/hooks/post';
import {formatDate} from '~/utils/formatData';

import {IActivityImportant} from '~/interfaces/IPost';

const MAX_DAYS = 7;

const PostSettings = () => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);
  const createPostData = useCreatePost();
  const {important} = createPostData || {};

  const [selectingDate, setSelectingDate] = useState<boolean>();
  const [selectingTime, setSelectingTime] = useState<boolean>();

  const [disableButtonSave, setDisableButtonSave] = useState<boolean>(true);
  const [sImportant, setImportant] = useState<IActivityImportant>({
    active: 0,
    expiresTime: '',
    ...important,
  });
  //   const [comments, setComments] = useState<boolean>(true);
  //   const [shares, setShares] = useState<boolean>(true);
  //   const [reacts, setReacts] = useState<boolean>(true);

  useEffect(() => {
    checkDisableButtonSave();
  }, [sImportant]);

  const onPressBack = () => {
    dispatch(
      modalActions.showAlert({
        title: i18n.t('common:label_discard_changes'),
        content: i18n.t('common:text_discard_warning'),
        showCloseButton: true,
        cancelBtn: true,
        cancelLabel: i18n.t('common:btn_continue_editing'),
        confirmLabel: i18n.t('common:btn_discard'),
        onConfirm: () => {
          rootNavigation.goBack();
        },
        stretchOnWeb: true,
      }),
    );
  };

  const onPressSave = () => {
    dispatch(postActions.setCreatePostSettings({important: sImportant}));
    rootNavigation.goBack();
  };

  const checkDisableButtonSave = () => {
    const isDisable = sImportant.active === important?.active;
    setDisableButtonSave(isDisable);
  };

  const onToggleImportant = (action: IAction) => {
    const newImportant = {...sImportant};
    newImportant.active = action === commonActions.checkBox ? 1 : 0;
    if (!sImportant.expiresTime) {
      newImportant.expiresTime = getDefaultExpire();
    }
    setImportant(newImportant);
  };

  const onChangeDatePicker = (date?: Date) => {
    setSelectingDate(false);
    setSelectingTime(false);
    if (date) {
      const newImportant = {...sImportant};
      let expiresTime = '';
      if (date) {
        const time = sImportant.expiresTime
          ? new Date(sImportant.expiresTime)
          : new Date();
        date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
        expiresTime = date.toISOString();
      }
      newImportant.expiresTime = expiresTime;
      setImportant(newImportant);
    }
  };

  const onChangeTimePicker = (time?: Date) => {
    setSelectingDate(false);
    setSelectingTime(false);
    if (time) {
      const newImportant = {...sImportant};
      const date = sImportant.expiresTime
        ? new Date(sImportant.expiresTime)
        : new Date();
      date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
      const expiresTime = date.toISOString();
      newImportant.expiresTime = expiresTime;
      setImportant(newImportant);
    }
  };

  const renderImportantDate = () => {
    const {expiresTime} = sImportant || {};
    let date = t('common:text_set_date');
    let time = t('common:text_set_time');

    if (expiresTime) {
      date = formatDate(expiresTime, 'MMM Do, YYYY');
      time = formatDate(expiresTime, 'hh:mm A', undefined, 9999);
    }

    return (
      <View style={{marginTop: spacing.margin.large}}>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text.H6 useI18n>post:expiring_time</Text.H6>
            <Text.Subtitle useI18n color={colors.textSecondary}>
              post:expire_time_desc
            </Text.Subtitle>
          </View>
        </View>
        <View style={styles.importantButtons}>
          <Button.Secondary
            testID="post_toolbar.date"
            leftIcon={'CalendarAlt'}
            leftIconProps={{icon: 'CalendarAlt', size: 14}}
            style={styles.buttonDate}
            onPress={() => setSelectingDate(true)}>
            {date}
          </Button.Secondary>
          <Button.Secondary
            testID="post_toolbar.time"
            leftIcon={'Clock'}
            leftIconProps={{icon: 'Clock', size: 16}}
            style={styles.buttonTime}
            onPress={() => setSelectingTime(true)}>
            {time}
          </Button.Secondary>
        </View>
      </View>
    );
  };

  const renderImportant = () => {
    const {active} = sImportant || {};

    return (
      <View style={styles.content}>
        <View style={styles.row}>
          <Text.H6 style={styles.flex1} useI18n>
            post:mark_as_important
          </Text.H6>
          <Toggle
            isChecked={sImportant?.active === 1}
            onActionPress={onToggleImportant}
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
        onPressButton={onPressSave}
        buttonProps={{
          disabled: disableButtonSave,
          useI18n: true,
          color: '#EAEDF2',
          style: {
            borderWidth: disableButtonSave ? 0 : 1,
            borderColor: colors.primary,
            marginRight: spacing?.margin.large,
          },
        }}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderImportant()}
          {/* <View style={[styles.content, styles.row]}>
            <Text.H6 style={styles.flex1} useI18n>
              post:people_can_comment
            </Text.H6>
            <Toggle
              isChecked={comments}
              onActionPress={() => setComments(!comments)}
            />
          </View>
          <View style={[styles.content, styles.row]}>
            <Text.H6 style={styles.flex1} useI18n>
              post:people_can_share
            </Text.H6>
            <Toggle
              isChecked={shares}
              onActionPress={() => setShares(!shares)}
            />
          </View>
          <View style={[styles.content, styles.row]}>
            <Text.H6 style={styles.flex1} useI18n>
              post:people_can_react
            </Text.H6>
            <Toggle
              isChecked={reacts}
              onActionPress={() => setReacts(!reacts)}
            />
          </View> */}
        </ScrollView>
        <View style={{position: 'absolute', alignSelf: 'center'}}>
          {selectingDate && (
            <DateTimePicker
              isVisible={selectingDate}
              date={
                sImportant.expiresTime
                  ? new Date(sImportant.expiresTime)
                  : new Date()
              }
              minDate={new Date()}
              maxDate={getMaxDate()}
              mode={Platform.OS === 'web' ? 'time' : 'date'}
              onConfirm={onChangeDatePicker}
              onCancel={onChangeDatePicker}
            />
          )}
          {selectingTime && (
            <DateTimePicker
              isVisible={selectingTime}
              date={
                sImportant.expiresTime
                  ? new Date(sImportant.expiresTime)
                  : new Date()
              }
              minDate={new Date()}
              maxDate={getMaxDate()}
              mode={'time'}
              onConfirm={onChangeTimePicker}
              onCancel={onChangeTimePicker}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const getMaxDate = () => {
  const now = new Date();
  const max = now.setDate(now.getDate() + MAX_DAYS);
  return new Date(max);
};

const getDefaultExpire = () => {
  const max = getMaxDate();
  const maxWithTime = new Date(max).setHours(23, 59, 0, 0);
  return new Date(maxWithTime).toISOString();
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {backgroundColor: colors.background, flex: 1},
    row: {flexDirection: 'row'},
    flex1: {flex: 1},
    content: {
      paddingVertical: Platform.select({
        web: spacing.padding.big,
        default: spacing.padding.small,
      }),
      paddingBottom: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      justifyContent: 'center',
    },
    importantButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.large,
    },
    buttonDate: {flex: 1, marginRight: spacing.margin.base},
    buttonTime: {flex: 1},
  });
};

export default PostSettings;
