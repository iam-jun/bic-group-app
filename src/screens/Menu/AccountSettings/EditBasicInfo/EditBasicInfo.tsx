import React, { useState, useRef } from 'react';
import { StyleSheet, Keyboard, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { isEqual } from 'lodash';

import { useBaseHook } from '~/hooks';
import genders from '~/constants/genders';
import menuActions from '~/storeRedux/menu/actions';
import {
  GENDER_TYPE,
  IGenderItem,
  IRelationshipItem,
  RELATIONSHIP_TYPE,
} from '~/interfaces/IEditUser';
import OptionMenu from './fragments/OptionMenu';
import * as modalActions from '~/storeRedux/modal/actions';
import { useKeySelector } from '~/hooks/selector';
import menuKeySelector from '../../../../storeRedux/menu/keySelector';
import { useRootNavigation } from '~/hooks/navigation';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import TitleComponent from '../fragments/TitleComponent';
import Button from '~/beinComponents/Button';
import { dataMapping } from './helper';
import spacing from '~/theme/spacing';
import RELATIONSHIP_STATUS from '~/constants/relationshipStatus';
import { DateInput, TextInput } from '~/baseComponents/Input';
import LanguageOptionMenu from './fragments/LanguageOptionMenu';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Gender from './fragments/Gender';

const EditBasicInfo = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();

  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const {
    id, fullname, gender, birthday, relationshipStatus, language,
  }
    = myProfileData;

  const genderSheetRef = useRef<any>();
  const relationshipSheetRef = useRef<any>();

  const [nameState, setNameState] = useState<string>(fullname);
  const [genderState, setGenderState] = useState<GENDER_TYPE>(gender);
  const [birthdayState, setBirthdayState] = useState<string>(birthday);
  const [languageState, setLanguageState] = useState<string[]>(language);
  const [relationshipState, setRelationshipState]
    = useState<RELATIONSHIP_TYPE>(relationshipStatus);

  const [error, setError] = useState<boolean>(false);

  const relationshipStatusList = dataMapping(RELATIONSHIP_STATUS);
  const gendersList = dataMapping(genders);

  const checkIsValid = (
    nameState: string,
    genderState: string,
    birthdayState: string,
    languageState: string[],
    relationshipState: string,
  ) => (fullname !== nameState
      || gender !== genderState
      || birthday !== birthdayState
      || !isEqual(language, languageState)
      || relationshipStatus !== relationshipState)
    && nameState?.trim?.()?.length > 0;

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
      menuActions.editMyProfile(
        {
          id,
          fullname: nameState,
          gender: genderState,
          birthday: birthdayState,
          language: languageState,
          relationshipStatus: relationshipState,
        },
        null,
        () => rootNavigation.goBack(),
      ),
    );
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
  };

  const _onChangeLanguages = (languages: string[]) => {
    setLanguageState(languages);
  };

  const _onPressBack = () => {
    if (isValid) {
      Keyboard.dismiss();
      dispatch(
        modalActions.showAlert({
          title: t('common:label_discard_changes'),
          cancelBtn: true,
          isDismissible: false,
          onConfirm: () => {
            rootNavigation.goBack();
          },
          confirmLabel: t('common:btn_discard'),
          content: t('common:text_not_saved_changes_warning'),
        }),
      );
    } else {
      rootNavigation.goBack();
    }
  };

  const onRelationshipEditOpen = (e: any) => {
    Keyboard.dismiss();
    relationshipSheetRef?.current?.open?.(e?.pageX, e?.pageY);
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
          disabled: !isValid,
          testID: 'edit_basic_info.save',
          style: styles.btnRightHeader,
        }}
        onPressButton={onSave}
        onPressBack={_onPressBack}
      />

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.content}
      >
        <TextInput
          testID="edit_name.text_input"
          value={fullname}
          label={t('settings:title_name')}
          onChangeText={onChangeName}
          error={error}
          helperText={
            error ? t('profile:text_name_must_not_be_empty') : undefined
          }
          maxLength={64}
          placeholder={t('settings:enter_name')}
        />
        <Text.BodyXS useI18n>
          settings:text_input_edit_info_fullname_max_64
        </Text.BodyXS>
        <ViewSpacing height={spacing.padding.large} />
        <TitleComponent title="settings:title_gender" />
        <Gender genderState={genderState} setGenderState={setGenderState} />
        <ViewSpacing height={spacing.padding.large} />
        <DateInput
          testID="edit_basic_info.birthday"
          style={{ marginVertical: 0 }}
          mode="date"
          value={birthdayState}
          label={t('settings:title_birthday')}
          maxDate={new Date()}
          onConfirm={onSetBirthday}
          placeholder="DD/MM/YYYY"
        />
        <ViewSpacing height={spacing.padding.large} />
        <LanguageOptionMenu
          onChangeLanguages={_onChangeLanguages}
          selectedLanguages={languageState}
        />
        <ViewSpacing height={spacing.padding.large} />
        <TitleComponent title="settings:title_relationship_status" />
        <Button
          testID="edit_basic_info.relationship"
          textProps={{
            color: relationshipState ? colors.neutral80 : colors.neutral20,
            variant: 'bodyM',
          }}
          style={styles.buttonDropDown}
          contentStyle={styles.buttonDropDownContent}
          rightIcon="AngleDown"
          rightIconProps={{ tintColor: colors.neutral40, size: 14 }}
          onPress={(e) => onRelationshipEditOpen(e)}
        >
          {t(RELATIONSHIP_STATUS[relationshipState])
            || t('settings:select_relationship')}
        </Button>
      </ScrollView>
      <OptionMenu
        testID="edit_basic_info.gender_list"
        data={gendersList}
        value={genderState}
        menuRef={genderSheetRef}
        onItemPress={onGenderItemPress}
      />
      <OptionMenu
        testID="edit_basic_info.relationship_status_list"
        data={relationshipStatusList}
        value={relationshipState}
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
      padding: spacing.margin.large,
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
      borderRadius: spacing.borderRadius.large,
      borderWidth: 1,
      borderColor: colors.neutral5,
      minHeight: 44,
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingLeft: spacing.padding.large,
    },
    buttonDropDownContent: {
      justifyContent: 'space-between',
    },
    btnRightHeader: {
      marginRight: spacing.margin.small,
    },
  });
};
