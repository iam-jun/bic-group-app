import React, { useState, useRef } from 'react';
import { StyleSheet, Keyboard, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEqual } from 'lodash';

import { useBaseHook } from '~/hooks';
import {
  GENDER_TYPE,
  IRelationshipItem,
  RELATIONSHIP_TYPE,
} from '~/interfaces/IEditUser';
import OptionMenu from './fragments/OptionMenu';
import { useRootNavigation } from '~/hooks/navigation';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import TitleComponent from '../fragments/TitleComponent';
import Button from '~/beinComponents/Button';
import { dataMapping, maxBirthday } from './helper';
import spacing from '~/theme/spacing';
import RELATIONSHIP_STATUS from '~/constants/relationshipStatus';
import { DateInput, TextInput } from '~/baseComponents/Input';
import LanguageOptionMenu from './fragments/LanguageOptionMenu';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Gender from './fragments/Gender';
import useCommonController from '~/screens/store';
import useMenuController from '../../store';
import useModalStore from '~/store/modal';
import { formatDate } from '~/utils/formatter';

const EditBasicInfo = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();

  const styles = themeStyles(theme);
  const { showAlert } = useModalStore((state) => state.actions);
  const { rootNavigation } = useRootNavigation();

  const myProfileData = useCommonController((state) => state.myProfile);
  const {
    id, fullname, gender, birthday, relationshipStatus, language,
  }
    = myProfileData;

  const relationshipSheetRef = useRef<any>();

  const [nameState, setNameState] = useState<string>(fullname);
  const [genderState, setGenderState] = useState<GENDER_TYPE>(gender);
  const [birthdayState, setBirthdayState] = useState<string>(birthday);
  const [languageState, setLanguageState] = useState<string[]>(language);
  const [relationshipState, setRelationshipState]
    = useState<RELATIONSHIP_TYPE>(relationshipStatus);

  const [error, setError] = useState<boolean>(false);
  const actions = useMenuController((state) => state.actions);

  const relationshipStatusList = dataMapping(RELATIONSHIP_STATUS);

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
    actions.editMyProfile({
      data: {
        id,
        fullname: nameState,
        gender: genderState,
        birthday: birthdayState,
        language: languageState,
        relationshipStatus: relationshipState,
      },
      callback: () => rootNavigation.goBack(),
    });
  };

  const onRelationshipItemPress = (item: IRelationshipItem) => {
    setRelationshipState(item.type);
    relationshipSheetRef.current?.close();
  };

  const onSetBirthday = (date?: Date) => {
    if (date) {
      // BE requests to clear timezone effect
      const dateTime = `${formatDate(date, 'YYYY-MM-DD')}T00:00:00.000Z`;
      setBirthdayState(dateTime);
    }
  };

  const _onChangeLanguages = (languages: string[]) => {
    setLanguageState(languages);
  };

  const _onPressBack = () => {
    if (isValid) {
      Keyboard.dismiss();
      showAlert({
        title: t('common:label_discard_changes'),
        cancelBtn: true,
        isDismissible: false,
        onConfirm: () => {
          rootNavigation.goBack();
        },
        confirmLabel: t('common:btn_discard'),
        content: t('common:text_not_saved_changes_warning'),
      });
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
          testID="edit_basic_info.name.text_input"
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
        <TitleComponent title="settings:title_gender" isOptional />
        <Gender genderState={genderState} setGenderState={setGenderState} />
        <ViewSpacing height={spacing.padding.large} />
        <TitleComponent title="settings:title_birthday" isOptional />
        <DateInput
          testID="edit_basic_info.birthday"
          style={{ marginVertical: 0 }}
          mode="date"
          value={birthdayState}
          maxDate={maxBirthday()}
          onConfirm={onSetBirthday}
          placeholder="DD/MM/YYYY"
        />
        <ViewSpacing height={spacing.padding.large} />
        <LanguageOptionMenu
          onChangeLanguages={_onChangeLanguages}
          selectedLanguages={languageState}
        />
        <ViewSpacing height={spacing.padding.large} />
        <TitleComponent title="settings:title_relationship_status" isOptional />
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
