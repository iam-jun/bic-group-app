import React, { useState, useRef } from 'react';
import {
  StyleSheet, Keyboard, ScrollView, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';
import { isEqual } from 'lodash';

import genders from '~/constants/genders';
import { formatDate } from '~/utils/formatData';
import menuActions from '~/storeRedux/menu/actions';
import {
  GENDER_TYPE,
  IGenderItem,
  IRelationshipItem,
  RELATIONSHIP_TYPE,
} from '~/interfaces/IEditUser';
import OptionMenu from './fragments/OptionMenu';
import LanguageOptionMenu from './fragments/LanguageOptionMenu';
import * as modalActions from '~/storeRedux/modal/actions';
import { useKeySelector } from '~/hooks/selector';
import menuKeySelector from '../../../../storeRedux/menu/keySelector';
import { useRootNavigation } from '~/hooks/navigation';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import EditName from './fragments/EditName';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import TitleComponent from '../fragments/TitleComponent';
import Button from '~/beinComponents/Button';
import { dataMapping, maxBirthday } from './helper';
import spacing from '~/theme/spacing';
import RELATIONSHIP_STATUS from '~/constants/relationshipStatus';

const EditBasicInfo = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const {
    id, fullname, gender, birthday, relationshipStatus, language,
  } = myProfileData;

  const genderSheetRef = useRef<any>();
  const relationshipSheetRef = useRef<any>();

  const [nameState, setNameState] = useState<string>(fullname);
  const [genderState, setGenderState] = useState<GENDER_TYPE>(gender);
  const [selectingDate, setSelectingDate] = useState<boolean>(false);
  const [birthdayState, setBirthdayState] = useState<string>(birthday);
  const [languageState, setLanguageState] = useState<string[]>(language);
  const [relationshipState, setRelationshipState] = useState<RELATIONSHIP_TYPE>(relationshipStatus);

  const [error, setError] = useState<boolean>(false);

  const relationshipStatusList = dataMapping(RELATIONSHIP_STATUS);
  const gendersList = dataMapping(genders);

  const checkIsValid = (
    nameState: string,
    genderState: string,
    birthdayState: string,
    languageState: string[],
    relationshipState: string,
  ) => (
    (fullname !== nameState
        || gender !== genderState
        || birthday !== birthdayState
        || !isEqual(language, languageState)
        || relationshipStatus !== relationshipState)
      && nameState?.trim?.()?.length > 0
  );

  const isValid = checkIsValid(
    nameState,
    genderState,
    birthdayState,
    languageState,
    relationshipState,
  );

  const onSave = () => {
    Keyboard.dismiss();
    dispatch(
      menuActions.editMyProfile({
        id,
        fullname: nameState,
        gender: genderState,
        birthday: birthdayState,
        language: languageState,
        relationshipStatus: relationshipState,
      }),
    );
    rootNavigation.goBack();
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

  const _onPressBack = () => {
    if (isValid) {
      Keyboard.dismiss();
      dispatch(modalActions.showAlert({
        title: i18next.t('common:label_discard_changes'),
        showCloseButton: true,
        cancelBtn: true,
        isDismissible: false,
        onConfirm: () => {
          rootNavigation.goBack();
        },
        confirmLabel: i18next.t('common:btn_discard'),
        content: i18next.t('common:text_not_saved_changes_warning'),
      }));
    } else {
      rootNavigation.goBack();
    }
  };

  const onGenderEditOpen = (e: any) => {
    Keyboard.dismiss();
    genderSheetRef?.current?.open?.(
      e?.pageX, e?.pageY,
    );
  };

  const onDateEditOpen = () => {
    Keyboard.dismiss();
    setSelectingDate(true);
  };
  const onDateEditClose = () => setSelectingDate(false);

  const onRelationshipEditOpen = (e: any) => {
    Keyboard.dismiss();
    relationshipSheetRef?.current?.open?.(
      e?.pageX, e?.pageY,
    );
  };

  const onChangeName = (text: string) => {
    const newName = text?.trim?.();
    setNameState(newName);
    if (newName) {
      error && setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <ScreenWrapper testID="EditBasicInfo" style={styles.container} isFullView>
      <Header
        titleTextProps={{ useI18n: true }}
        title="settings:title_edit_basic_info"
        buttonText="common:text_save"
        buttonProps={{
          useI18n: true,
          color: theme.colors.purple50,
          textColor: theme.colors.white,
          borderRadius: spacing.borderRadius.small,
          disabled: !isValid,
          testID: 'edit_basic_info.save',
        }}
        onPressButton={onSave}
        onPressBack={_onPressBack}
      />

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.content}
      >
        <EditName
          error={error}
          fullname={nameState}
          onChangeName={onChangeName}
        />
        <TitleComponent icon="SquareUser" title="settings:title_gender" />
        <Button
          testID="edit_basic_info.gender"
          textProps={{ color: colors.neutral80, variant: 'bodyM' }}
          style={styles.buttonDropDown}
          contentStyle={styles.buttonDropDownContent}
          rightIcon="AngleDown"
          onPress={(e) => onGenderEditOpen(e)}
        >
          {genderState
            ? i18next.t(genders[genderState])
            : i18next.t('common:text_not_set')}
        </Button>
        <TitleComponent icon="Calendar" title="settings:title_birthday" />
        <Button
          testID="edit_basic_info.birthday"
          textProps={{ color: colors.neutral80, variant: 'bodyM' }}
          style={styles.buttonDropDown}
          contentStyle={styles.buttonDropDownContent}
          onPress={() => onDateEditOpen()}
        >
          {formatDate(
            birthdayState, 'DD/MM/YYYY',
          )
            || i18next.t('common:text_not_set')}
        </Button>
        {selectingDate && (
          <View testID="edit_basic_info.date_picker">
            <DateTimePicker
              isVisible={selectingDate}
              date={maxBirthday()}
              mode="date"
              onConfirm={onSetBirthday}
              onCancel={onDateEditClose}
              maxDate={maxBirthday()}
            />
          </View>
        )}
        <LanguageOptionMenu
          title="settings:title_choose_languages"
          onChangeLanguages={_onChangeLanguages}
          selectedLanguages={languageState}
        />

        <TitleComponent
          icon="Heart"
          title="settings:title_relationship_status"
        />
        <Button
          testID="edit_basic_info.relationship"
          textProps={{ color: colors.neutral80, variant: 'bodyM' }}
          style={styles.buttonDropDown}
          contentStyle={styles.buttonDropDownContent}
          rightIcon="AngleDown"
          onPress={(e) => onRelationshipEditOpen(e)}
        >
          {i18next.t(RELATIONSHIP_STATUS[relationshipState])
            || i18next.t('common:text_not_set')}
        </Button>
      </ScrollView>
      <OptionMenu
        testID="edit_basic_info.gender_list"
        data={gendersList}
        value={genderState}
        title="settings:title_choose_gender"
        menuRef={genderSheetRef}
        onItemPress={onGenderItemPress}
      />
      <OptionMenu
        testID="edit_basic_info.relationship_status_list"
        data={relationshipStatusList}
        value={relationshipState}
        title="settings:title_choose_relationship"
        menuRef={relationshipSheetRef}
        onItemPress={onRelationshipItemPress}
      />
    </ScreenWrapper>
  );
};

export default EditBasicInfo;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

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
    contentComponent: { marginHorizontal: spacing.margin.base },
    chooseGenderText: {
      margin: spacing.margin.base,
    },
    textinput: {},
    buttonDropDown: {
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.gray40,
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
