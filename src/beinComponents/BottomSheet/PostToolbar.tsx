import React, {useRef, useState} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Keyboard,
} from 'react-native';
import {throttle} from 'lodash';
import {useTheme} from 'react-native-paper';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {GestureEvent} from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import {useDispatch} from 'react-redux';

import BaseBottomSheet, {
  BaseBottomSheetProps,
} from '~/beinComponents/BottomSheet/BaseBottomSheet';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

import {ITheme} from '~/theme/interfaces';
import {useCreatePost} from '~/hooks/post';
import commonActions, {IAction} from '~/constants/commonActions';
import postActions from '~/screens/Post/redux/actions';
import {useBaseHook} from '~/hooks';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import {formatDate} from '~/utils/formatData';
import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import Toggle from '~/beinComponents/SelectionControl/Toggle';

export interface PostToolbarProps extends BaseBottomSheetProps {
  modalizeRef: any;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const PostToolbar = ({
  modalizeRef,
  style,
  containerStyle,
  ...props
}: PostToolbarProps) => {
  const [selectingDate, setSelectingDate] = useState<boolean>();
  const [selectingTime, setSelectingTime] = useState<boolean>();
  const animated = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const createPostData = useCreatePost();
  const {important} = createPostData || {};

  const openModal = throttle(() => {
    Keyboard.dismiss();
    modalizeRef?.current?.open?.();
  }, 500);

  const handleGesture = (event: GestureEvent<any>) => {
    const {nativeEvent} = event;
    if (nativeEvent.velocityY < 0) {
      openModal();
    }
  };

  const onToggleImportant = (action: IAction) => {
    const newImportant = {...important};
    if (action === commonActions.checkBox) {
      newImportant.active = true;
    } else {
      newImportant.active = false;
    }
    dispatch(postActions.setCreatePostImportant(newImportant));
  };

  const onClearImportantDate = () => {
    const newImportant = {...important};
    newImportant.expiresTime = '';
    dispatch(postActions.setCreatePostImportant(newImportant));
  };

  const onPressSelectImage = () => {
    alert('select image');
  };

  const onPressSelectFile = () => {
    alert('select file');
  };

  const onChangeDatePicker = ({event, value}: any) => {
    setSelectingDate(false);
    setSelectingTime(false);
    const newImportant = {...important};
    let expiresTime = '';
    if (value) {
      const time = important.expiresTime
        ? new Date(important.expiresTime)
        : new Date();
      const date = new Date(value);
      date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
      expiresTime = date.toISOString();
    }
    newImportant.expiresTime = expiresTime;
    dispatch(postActions.setCreatePostImportant(newImportant));
  };

  const onChangeTimePicker = ({event, value}: any) => {
    setSelectingDate(false);
    setSelectingTime(false);
    const newImportant = {...important};
    let expiresTime = '';
    if (value) {
      const time = new Date(value);
      const date = important.expiresTime
        ? new Date(important.expiresTime)
        : new Date();
      date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
      expiresTime = date.toISOString();
    }
    newImportant.expiresTime = expiresTime;
    dispatch(postActions.setCreatePostImportant(newImportant));
  };

  const renderToolbarButton = (icon: any) => {
    return (
      <View style={styles.toolbarButton}>
        <Icon size={16} tintColor={colors.primary7} icon={icon} />
      </View>
    );
  };

  const renderToolbar = () => {
    return (
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View style={containerStyle}>
          <TouchableOpacity
            activeOpacity={1}
            style={StyleSheet.flatten([styles.toolbarStyle, style])}
            onPress={openModal}>
            <Text.Subtitle style={{flex: 1}}>Add to your post</Text.Subtitle>
            {renderToolbarButton('ImagePlus')}
            {renderToolbarButton('Link')}
            <View
              style={[
                styles.toolbarButton,
                {backgroundColor: colors.primary7},
              ]}>
              <Icon
                size={16}
                tintColor={colors.iconTintReversed}
                icon={'InfoCircle'}
              />
            </View>
          </TouchableOpacity>
          <KeyboardSpacer iosOnly />
          {selectingDate && (
            <DateTimePicker
              value={
                important.expiresTime
                  ? new Date(important.expiresTime)
                  : new Date()
              }
              onChange={onChangeDatePicker}
            />
          )}
          {selectingTime && (
            <DateTimePicker
              mode={'time'}
              value={
                important.expiresTime
                  ? new Date(important.expiresTime)
                  : new Date()
              }
              onChange={onChangeTimePicker}
            />
          )}
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const renderImportant = () => {
    const {active, expiresTime} = important || {};
    let date = t('common:text_set_date');
    let time = t('common:text_set_time');

    if (expiresTime) {
      date = formatDate(expiresTime, 'MMM Do, YYYY');
      time = formatDate(expiresTime, 'hh:mm A', 9999);
    }

    return (
      <View style={styles.importantContainer}>
        <View style={styles.row}>
          <Text.H6 style={styles.flex1} useI18n>
            post:mark_as_important
          </Text.H6>
          <Toggle
            isChecked={important?.active}
            onActionPress={onToggleImportant}
          />
        </View>
        {active && (
          <View>
            <Text.Subtitle color={colors.textSecondary}>
              Choose expire date and time
            </Text.Subtitle>
            <View style={styles.importantButtons}>
              <Button.Secondary
                leftIcon={'CalendarAlt'}
                leftIconProps={{icon: 'CalendarAlt', size: 14}}
                style={styles.buttonDate}
                onPress={() => setSelectingDate(true)}>
                {date}
              </Button.Secondary>
              <Button.Secondary
                leftIcon={'Clock'}
                leftIconProps={{icon: 'Clock', size: 16}}
                style={styles.buttonTime}
                onPress={() => setSelectingTime(true)}>
                {time}
              </Button.Secondary>
              {!!expiresTime && (
                <Button
                  useI18n
                  style={styles.buttonClear}
                  textProps={{color: colors.textInfo}}
                  onPress={onClearImportantDate}>
                  common:text_clear
                </Button>
              )}
            </View>
            <Divider />
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        {renderImportant()}
        <PrimaryItem
          height={48}
          title={'Add Photo'}
          leftIcon={'ImagePlus'}
          leftIconProps={{
            icon: 'ImagePlus',
            size: 20,
            tintColor: colors.primary7,
            style: {marginRight: spacing?.margin.base},
          }}
          onPress={onPressSelectImage}
        />
        <PrimaryItem
          height={48}
          title={'Add Files'}
          leftIcon={'Link'}
          leftIconProps={{
            icon: 'Link',
            size: 20,
            tintColor: colors.primary7,
            style: {marginRight: spacing?.margin.base},
          }}
          onPress={onPressSelectFile}
        />
      </View>
    );
  };

  return (
    <BaseBottomSheet
      modalizeRef={modalizeRef}
      ContentComponent={renderContent()}
      panGestureAnimatedValue={animated}
      overlayStyle={{backgroundColor: 'transparent'}}
      {...props}>
      {renderToolbar()}
    </BaseBottomSheet>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    row: {flexDirection: 'row'},
    flex1: {flex: 1},
    toolbarStyle: {
      height: 52,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
      paddingHorizontal: spacing?.padding.extraLarge,
      alignItems: 'center',
      flexDirection: 'row',
    },
    toolbarButton: {
      backgroundColor: colors.primary1,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing?.borderRadius.small,
      marginLeft: spacing?.padding.small,
    },
    contentContainer: {
      paddingHorizontal: spacing?.padding.base,
      paddingBottom: spacing?.padding.base,
    },
    importantContainer: {
      paddingHorizontal: spacing.padding.large,
      minHeight: 48,
      justifyContent: 'center',
    },
    importantButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.large,
    },
    buttonTime: {flex: 1},
    buttonDate: {flex: 1, marginRight: spacing.margin.base},
    buttonClear: {padding: spacing.padding.small},
    expireDate: {
      marginLeft: spacing?.margin.tiny,
      textDecorationLine: 'underline',
    },
    expireClearButton: {
      color: colors.primary7,
      marginLeft: spacing?.margin.base,
    },
    expireNotSetButton: {
      color: colors.primary7,
      marginLeft: spacing?.margin.tiny,
    },
  });
};

export default PostToolbar;
