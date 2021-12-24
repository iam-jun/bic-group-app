import React, {useState, useRef} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import i18next from 'i18next';
import {isEqual} from 'lodash';

import {ITheme} from '~/theme/interfaces';
import useMenu from '~/hooks/menu';
import genders from '~/constants/genders';
import {titleCase} from '~/utils/common';
import {formatDate} from '~/utils/formatData';
import relationshipStatus from '~/constants/relationshipStatus';
import menuActions from '~/screens/Menu/redux/actions';
import {
  GENDER_TYPE,
  IGenderItem,
  IOptionItem,
  IRelationshipItem,
  RELATIONSHIP_TYPE,
} from '~/interfaces/IEditUser';
import OptionMenu from './fragments/OptionMenu';
import LanguageOptionMenu from './fragments/LanguageOptionMenu';
import SettingItem from './fragments/SettingItem';
import * as modalActions from '~/store/modal/actions';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import EditName from './EditName';
import DateTimePicker from '~/beinComponents/DateTimePicker';

const EditBasicInfo = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {myProfile} = useMenu();
  const {id, fullname, gender, birthday, relationship_status, language} =
    myProfile;

  const genderSheetRef = useRef<any>();
  const relationshipSheetRef = useRef<any>();

  const [nameState, setNameState] = useState<string>(fullname);
  const [genderState, setGenderState] = useState<GENDER_TYPE>(gender);
  const [selectingDate, setSelectingDate] = useState<boolean>(false);
  const [birthdayState, setBirthdayState] = useState<string>(birthday);
  const [languageState, setLanguageState] = useState<string[]>(language);
  const [relationshipState, setRelationshipState] =
    useState<RELATIONSHIP_TYPE>(relationship_status);

  const dataMapping = (dataObject: any): IOptionItem[] => {
    const dataList = Object.keys(dataObject).map(type => ({
      type,
      title: dataObject[type],
    }));
    return dataList;
  };

  const relationshipStatusList = dataMapping(relationshipStatus);
  const gendersList = dataMapping(genders);

  const onSave = () => {
    dispatch(
      menuActions.editMyProfile({
        id,
        fullname: nameState,
        gender: genderState,
        birthday: birthdayState,
        language: languageState,
        relationship_status: relationshipState,
      }),
    );
    navigation.goBack();
  };

  const onGenderItemPress = (item: IGenderItem) => {
    setGenderState(item.type);
    genderSheetRef.current?.close();
  };

  const onRelationshipItemPress = (item: IRelationshipItem) => {
    setRelationshipState(item.type);
    relationshipSheetRef.current?.close();
  };

  const onSetBirthday = (date?: Date) => {
    if (date) {
      setBirthdayState(date.toISOString());
    }
    setSelectingDate(false);
  };

  const _onChangeLanguages = (languages: string[]) => {
    setLanguageState(languages);
  };

  const maxBirthday = () => {
    const currentMoment = new Date();
    const currentDay = currentMoment.getDate();
    const currentMonth = currentMoment.getMonth();
    const currentYear = currentMoment.getFullYear();

    // user must be at least 8 years old up to today
    const maxDateToSelect = new Date(currentYear - 8, currentMonth, currentDay);
    return maxDateToSelect;
  };

  const _onPressBack = () => {
    const isChanged =
      fullname !== nameState ||
      gender !== genderState ||
      birthday !== birthdayState ||
      !isEqual(language, languageState) ||
      relationship_status !== relationshipState;

    if (isChanged) {
      dispatch(
        modalActions.showAlert({
          title: i18next.t('common:label_discard_changes'),
          showCloseButton: true,
          cancelBtn: true,
          isDismissible: false,
          onConfirm: () => navigation.goBack(),
          confirmLabel: i18next.t('common:btn_discard'),
          content: i18next.t('common:text_not_saved_changes_warning'),
          stretchOnWeb: true,
        }),
      );
    } else {
      navigation.goBack();
    }
  };

  const onGenderEditOpen = (e: any) =>
    genderSheetRef?.current?.open?.(e?.pageX, e?.pageY);

  const onDateEditOpen = () => setSelectingDate(true);
  const onDateEditClose = () => setSelectingDate(false);

  const onRelationshipEditOpen = (e: any) =>
    relationshipSheetRef?.current?.open?.(e?.pageX, e?.pageY);

  return (
    <ScreenWrapper testID="EditBasicInfo" style={styles.container} isFullView>
      <Header
        titleTextProps={{useI18n: true}}
        title={'settings:title_edit_basic_info'}
        buttonText={'common:text_save'}
        buttonProps={{
          useI18n: true,
          highEmphasis: true,
        }}
        onPressButton={onSave}
        onPressBack={_onPressBack}
      />

      <View style={styles.content}>
        <EditName onChangeName={setNameState} />

        <SettingItem
          title={'settings:title_gender'}
          subtitle={titleCase(genderState) || i18next.t('common:text_not_set')}
          leftIcon={'UserSquare'}
          rightIcon={'EditAlt'}
          testID="edit_basic_info.gender"
          onPress={e => onGenderEditOpen(e)}
        />
        <SettingItem
          title={'settings:title_birthday'}
          subtitle={
            formatDate(birthdayState, 'MMM Do, YYYY') ||
            i18next.t('common:text_not_set')
          }
          leftIcon={'Calender'}
          rightIcon={'EditAlt'}
          testID="edit_basic_info.birthday"
          onPress={onDateEditOpen}
        />
        <LanguageOptionMenu
          title={'settings:title_choose_languages'}
          onChangeLanguages={_onChangeLanguages}
        />
        <SettingItem
          title={'settings:title_relationship_status'}
          subtitle={
            i18next.t(relationshipStatus[relationshipState]) ||
            i18next.t('common:text_not_set')
          }
          leftIcon={'Heart'}
          rightIcon={'EditAlt'}
          testID="edit_basic_info.relationship"
          onPress={e => onRelationshipEditOpen(e)}
        />
      </View>

      <OptionMenu
        data={gendersList}
        value={genderState}
        title={'settings:title_choose_gender'}
        menuRef={genderSheetRef}
        onItemPress={onGenderItemPress}
      />
      <OptionMenu
        data={relationshipStatusList}
        value={relationshipState}
        title={'settings:title_choose_relationship'}
        menuRef={relationshipSheetRef}
        onItemPress={onRelationshipItemPress}
      />

      {selectingDate && (
        <DateTimePicker
          isVisible={selectingDate}
          date={maxBirthday()}
          mode={Platform.OS === 'web' ? 'time' : 'date'}
          onConfirm={onSetBirthday}
          onCancel={onDateEditClose}
          maxDate={maxBirthday()}
        />
      )}
    </ScreenWrapper>
  );
};

export default EditBasicInfo;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      marginHorizontal: spacing.margin.base,
    },
    textEdit: {
      marginBottom: spacing.margin.small,
    },
    contentComponent: {marginHorizontal: spacing.margin.base},
    chooseGenderText: {
      margin: spacing.margin.base,
    },
  });
};
