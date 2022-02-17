import React, {useState, useRef, useMemo} from 'react';
import {StyleSheet, View, Platform, Keyboard, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';
import {isEqual} from 'lodash';
import {useRootNavigation} from '~/hooks/navigation';

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
import * as modalActions from '~/store/modal/actions';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../redux/keySelector';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import EditName from './fragments/EditName';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import TitleComponent from '../fragments/TitleComponent';
import Button from '~/beinComponents/Button';

const EditBasicInfo = () => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const {id, fullname, gender, birthday, relationship_status, language} =
    myProfileData;

  const genderSheetRef = useRef<any>();
  const relationshipSheetRef = useRef<any>();

  const [nameState, setNameState] = useState<string>(fullname);
  const [genderState, setGenderState] = useState<GENDER_TYPE>(gender);
  const [selectingDate, setSelectingDate] = useState<boolean>(false);
  const [birthdayState, setBirthdayState] = useState<string>(birthday);
  const [languageState, setLanguageState] = useState<string[]>(language);
  const [relationshipState, setRelationshipState] =
    useState<RELATIONSHIP_TYPE>(relationship_status);

  const [error, setError] = useState<boolean>(false);

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
    rootNavigation.goBack();
  };

  const resetData = () => {
    setNameState(fullname);
    setGenderState(gender);
    setBirthdayState(birthday);
    setLanguageState(language);
    setRelationshipState(relationship_status);
    setError(false);
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
    if (isValid) {
      Keyboard.dismiss();
      dispatch(
        modalActions.showAlert({
          title: i18next.t('common:label_discard_changes'),
          showCloseButton: true,
          cancelBtn: true,
          isDismissible: false,
          onConfirm: () => {
            resetData();
            rootNavigation.goBack();
          },
          confirmLabel: i18next.t('common:btn_discard'),
          content: i18next.t('common:text_not_saved_changes_warning'),
          stretchOnWeb: true,
        }),
      );
    } else {
      resetData();
      rootNavigation.goBack();
    }
  };

  const onGenderEditOpen = (e: any) => {
    Keyboard.dismiss();
    genderSheetRef?.current?.open?.(e?.pageX, e?.pageY);
  };

  const onDateEditOpen = () => {
    Keyboard.dismiss();
    setSelectingDate(true);
  };
  const onDateEditClose = () => setSelectingDate(false);

  const onRelationshipEditOpen = (e: any) => {
    Keyboard.dismiss();
    relationshipSheetRef?.current?.open?.(e?.pageX, e?.pageY);
  };

  const onChangeName = (text: string) => {
    const newName = text?.trim?.();
    setNameState(newName);
    if (!!newName) {
      error && setError(false);
    } else {
      setError(true);
    }
  };

  const checkIsValid = (
    nameState: string,
    genderState: string,
    birthdayState: string,
    languageState: string[],
    relationshipState: string,
  ) => {
    return (
      (fullname !== nameState ||
        gender !== genderState ||
        birthday !== birthdayState ||
        !isEqual(language, languageState) ||
        relationship_status !== relationshipState) &&
      nameState?.trim?.()?.length > 0
    );
  };

  const isValid = useMemo(
    () =>
      checkIsValid(
        nameState,
        genderState,
        birthdayState,
        languageState,
        relationshipState,
      ),
    [nameState, genderState, birthdayState, languageState, relationshipState],
  );

  return (
    <ScreenWrapper testID="EditBasicInfo" style={styles.container} isFullView>
      <Header
        titleTextProps={{useI18n: true}}
        title={'settings:title_edit_basic_info'}
        buttonText={'common:text_save'}
        buttonProps={{
          useI18n: true,
          color: theme.colors.primary6,
          textColor: theme.colors.background,
          borderRadius: theme.spacing.borderRadius.small,
          disabled: !isValid,
        }}
        onPressButton={onSave}
        onPressBack={_onPressBack}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        <EditName
          error={error}
          fullname={nameState}
          onChangeName={onChangeName}
        />
        <TitleComponent icon="UserSquare" title="settings:title_gender" />
        <Button
          testID="edit_basic_info.gender"
          textProps={{color: colors.textInput, variant: 'body'}}
          style={styles.buttonDropDown}
          contentStyle={styles.buttonDropDownContent}
          rightIcon={'AngleDown'}
          onPress={e => onGenderEditOpen(e)}>
          {titleCase(genderState) || i18next.t('common:text_not_set')}
        </Button>
        <TitleComponent icon="Calender" title="settings:title_birthday" />
        <Button
          testID="edit_basic_info.birthday"
          textProps={{color: colors.textInput, variant: 'body'}}
          style={styles.buttonDropDown}
          contentStyle={styles.buttonDropDownContent}
          onPress={() => onDateEditOpen()}>
          {formatDate(birthdayState, 'DD/MM/YYYY') ||
            i18next.t('common:text_not_set')}
        </Button>

        <LanguageOptionMenu
          title={'settings:title_choose_languages'}
          onChangeLanguages={_onChangeLanguages}
        />

        <TitleComponent
          icon="Heart"
          title="settings:title_relationship_status"
        />
        <Button
          testID="edit_basic_info.relationship"
          textProps={{color: colors.textInput, variant: 'body'}}
          style={styles.buttonDropDown}
          contentStyle={styles.buttonDropDownContent}
          rightIcon={'AngleDown'}
          onPress={e => onRelationshipEditOpen(e)}>
          {i18next.t(relationshipStatus[relationshipState]) ||
            i18next.t('common:text_not_set')}
        </Button>
      </ScrollView>

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
  const {spacing, colors} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      marginHorizontal: spacing.margin.large,
    },
    textEdit: {
      marginBottom: spacing.margin.small,
    },
    contentComponent: {marginHorizontal: spacing.margin.base},
    chooseGenderText: {
      margin: spacing.margin.base,
    },
    textinput: {},
    buttonDropDown: {
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.borderCard,
      minHeight: 44,
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingLeft: spacing.padding.base,
      marginVertical: spacing.margin.small,
    },
    buttonDropDownContent: {
      justifyContent: 'space-between',
    },
  });
};
