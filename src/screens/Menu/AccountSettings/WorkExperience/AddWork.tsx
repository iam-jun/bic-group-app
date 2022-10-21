import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  TextInput as TextInputRN,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { isEmpty } from 'lodash';
import moment from 'moment';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';

import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import menuActions from '../../../../storeRedux/menu/actions';
import { useKeySelector } from '~/hooks/selector';
import menuKeySelector from '../../../../storeRedux/menu/keySelector';
import { showHideToastMessage } from '~/storeRedux/modal/actions';
import { ILocation, IToastMessage } from '~/interfaces/common';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import { DateInput, TextInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import EditLocation from '../EditContact/fragments/EditLocation';
import TitleComponent from '../fragments/TitleComponent';
import Checkbox from '~/baseComponents/Checkbox';
import { fontFamilies } from '~/theme/fonts';
import dimension from '~/theme/dimension';

const AddWork = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const selectedWorkItem = useKeySelector(menuKeySelector.selectedWorkItem);

  const {
    id,
    company,
    titlePosition,
    location,
    description,
    currentlyWorkHere,
    startDate,
    endDate,
  } = selectedWorkItem || {};

  const [companyValue, setCompanyValue] = useState<string>(company || '');
  const [positionValue, setPositionValue] = useState<string>(
    titlePosition || '',
  );
  const [locationValue, setLocationValue] = useState<string>(location || '');
  const [descriptionValue, setDescriptionValue] = useState<string>(
    description || '',
  );
  const [isWorkHere, setIsWorkHere] = useState<boolean>(
    !isEmpty(selectedWorkItem) && currentlyWorkHere !== null
      ? currentlyWorkHere
      : true,
  );
  const [startDateValue, setStartDateValue] = useState<string>(
    startDate || new Date().toISOString(),
  );
  const [endDateValue, setEndDateValue] = useState<string | null>(
    endDate || null,
  );
  const [isValidEndDate, setIsValidEndDate] = useState<boolean>(true);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const locationRef = useRef<any>();

  const isEnabledSubmit
    = companyValue.trim().length > 0
    && positionValue.trim().length > 0
    && isValidEndDate;

  useEffect(() => {
    if (isWorkHere) {
      setEndDateValue(null);
    } else {
      setEndDateValue(endDate || null);
    }
  }, [isWorkHere]);

  useEffect(() => {
    if (startDateValue && endDateValue) {
      setIsValidEndDate(
        new Date(startDateValue).getTime() < new Date(endDateValue).getTime(),
      );
    } else {
      setIsValidEndDate(true);
    }
  }, [startDateValue, endDateValue]);

  const navigateBack = () => {
    Keyboard.dismiss();
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.userEdit);
    }
  };

  const onSave = () => {
    if (!isValidEndDate) {
      const toastMessage: IToastMessage = {
        content: 'settings:text_enddate_after_startdate',
        props: { type: 'error' },
      };
      dispatch(showHideToastMessage(toastMessage));
      return;
    }

    if (!isWorkHere && !endDateValue) {
      const toastMessage: IToastMessage = {
        content: 'settings:text_enddate_must_choose',
        props: { type: 'error' },
      };
      dispatch(showHideToastMessage(toastMessage));
      return;
    }

    const data = {
      company: companyValue.trim(),
      titlePosition: positionValue.trim(),
      location: locationValue.trim(),
      description: descriptionValue.trim(),
      currentlyWorkHere: isWorkHere,
      startDate: startDateValue || undefined,
      endDate: endDateValue,
    };
    selectedWorkItem
      ? dispatch(menuActions.editWorkExperience(id, data, navigateBack))
      : dispatch(
        menuActions.addWorkExperience(data, () => {
          navigateBack();
        }),
      );
  };

  const onChangeCompany = (text: string) => {
    setCompanyValue(text);
  };

  const onChangePosition = (text: string) => {
    setPositionValue(text);
  };

  const onChangeDescription = (text: string) => {
    setDescriptionValue(text);
  };

  const onToggleCurrentlyWorkHere = () => {
    Keyboard.dismiss();
    setIsWorkHere(!isWorkHere);
  };

  const onSetStartDate = (date?: Date) => {
    setStartDateValue(moment(date).startOf('day').toISOString());
  };

  const onSetEndDate = (date?: Date) => {
    setEndDateValue(moment(date).startOf('day').toISOString());
  };

  const onFocusDescription = () => {
    setIsFocus(true);
  };

  const onBlurDescription = () => {
    setIsFocus(false);
  };

  const onEditLocationOpen = (e: any) => {
    Keyboard.dismiss();
    locationRef?.current?.open?.(e?.pageX, e?.pageY);
  };

  const onLocationItemPress = (item: ILocation) => {
    setLocationValue(item.name);
    locationRef?.current?.close();
    Keyboard.dismiss();
  };

  const renderCompanyInput = () => (
    <View style={styles.containerItem}>
      <TextInput
        testID="add_work.company"
        value={companyValue}
        label={t('settings:text_work_at')}
        onChangeText={onChangeCompany}
        maxLength={64}
        placeholder={t('settings:text_compamny')}
      />
      <Text.BodyXS useI18n>
        settings:text_input_edit_info_fullname_max_64
      </Text.BodyXS>
    </View>
  );

  const renderTitlePositionInput = () => (
    <View style={styles.containerItem}>
      <TextInput
        testID="add_work.title_position"
        value={positionValue}
        label={t('settings:text_title_position')}
        onChangeText={onChangePosition}
        maxLength={64}
        placeholder={t('settings:text_title_position')}
      />
      <Text.BodyXS useI18n>
        settings:text_input_edit_info_fullname_max_64
      </Text.BodyXS>
    </View>
  );

  const renderLocationInput = () => (
    <View style={styles.containerItem}>
      <TitleComponent title="settings:title_location" />
      <Button
        testID="add_work.location"
        textProps={{ color: theme.colors.neutral80, variant: 'bodyM' }}
        style={styles.buttonDropDown}
        contentStyle={styles.buttonDropDownContent}
        onPress={(e) => onEditLocationOpen(e)}
        rightIcon="AngleDown"
        rightIconProps={{ tintColor: theme.colors.neutral40, size: 14 }}
      >
        {locationValue || t('common:text_not_set')}
      </Button>
      <EditLocation
        modalizeRef={locationRef}
        onItemPress={onLocationItemPress}
      />
    </View>
  );

  const renderStartDate = () => (
    <View style={styles.containerItem}>
      <DateInput
        testID="add_work.start_date"
        testIDValue="add_work.start_date.value"
        style={{ marginVertical: 0 }}
        mode="date"
        value={startDateValue}
        label={t('common:text_start_date')}
        maxDate={new Date()}
        onConfirm={onSetStartDate}
        placeholder="DD/MM/YYYY"
      />
    </View>
  );

  const renderEndDate = () => (
    <View style={styles.containerItem}>
      <DateInput
        style={{ marginVertical: 0, marginBottom: spacing.margin.tiny }}
        mode="date"
        value={endDateValue}
        label={t('common:text_end_date')}
        maxDate={new Date()}
        onConfirm={onSetEndDate}
        placeholder="DD/MM/YYYY"
        disabled={isWorkHere}
      />
      {!isValidEndDate && (
        <Text.BodyXS color={colors.red60} useI18n>
          settings:end_date_must_be_after_start_date
        </Text.BodyXS>
      )}
    </View>
  );

  const renderDescriptionInput = () => (
    <>
      <TitleComponent title="common:text_description" />
      <View
        testID="add_work.description.view"
        style={[styles.containerDes, isFocus && styles.textInputFocus]}
      >
        <TextInputRN
          testID="add_work.description"
          value={descriptionValue}
          onChangeText={onChangeDescription}
          maxLength={255}
          placeholder={t('common:text_description')}
          multiline
          textAlignVertical="top"
          onFocus={onFocusDescription}
          onBlur={onBlurDescription}
          style={styles.textInput}
        />
      </View>
      <View style={styles.desCount}>
        <Text.BodyXS>{`${descriptionValue.length}/255`}</Text.BodyXS>
      </View>
    </>
  );

  const renderCurrentlyWorkHere = () => (
    <View style={[styles.selectionLineView, styles.containerItem]}>
      <Checkbox
        isChecked={isWorkHere}
        label="settings:text_currently_work_here"
        useI18n
        onPress={onToggleCurrentlyWorkHere}
      />
    </View>
  );

  return (
    <ScreenWrapper testID="AddWork" isFullView>
      <Header
        title={
          selectedWorkItem
            ? 'settings:text_edit_experience'
            : 'settings:text_add_experience'
        }
        titleTextProps={{ useI18n: true }}
        buttonText={selectedWorkItem ? 'common:text_save' : 'common:text_add'}
        buttonProps={{
          useI18n: true,
          disabled: !isEnabledSubmit,
          testID: 'add_work.save',
        }}
        onPressButton={onSave}
        onPressBack={navigateBack}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {renderCompanyInput()}
          {renderTitlePositionInput()}
          {renderLocationInput()}
          {renderStartDate()}
          {renderEndDate()}
          {renderCurrentlyWorkHere()}
          {renderDescriptionInput()}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default AddWork;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    containerItem: {
      marginBottom: spacing.margin.large,
    },
    container: {
      flex: 1,
      padding: spacing.padding.large,
    },
    containerDes: {
      height: 120,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      borderRadius: spacing.borderRadius.base,
      borderWidth: 1,
      borderColor: colors.neutral5,
    },
    textInput: {
      flex: 1,
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
    },
    textInputFocus: {
      borderColor: colors.purple50,
    },
    selectionView: {
      marginTop: spacing.margin.extraLarge,
      marginHorizontal: spacing.margin.large,
    },
    selectionLineView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.margin.extraLarge,
    },
    deleteWork: {
      margin: spacing.margin.large,
    },
    buttonDate: {
      padding: spacing.padding.small,
      backgroundColor: colors.neutral1,
    },
    calendarIcon: {
      marginRight: spacing.margin.small,
    },
    buttonDelete: {
      borderRadius: spacing.borderRadius.small,
    },
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
    desCount: {
      marginTop: spacing.margin.tiny,
      alignItems: 'flex-end',
      marginBottom: spacing.margin.large,
    },
  });
};
