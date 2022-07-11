import React, {useState, useEffect} from 'react';
import i18next from 'i18next';
import {View, StyleSheet, ScrollView, TextInput, Keyboard} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import TextInputBein from '~/beinComponents/inputs/TextInput';
import Icon from '~/beinComponents/Icon';
import Toggle from '~/beinComponents/SelectionControl/Toggle';
import Text from '~/beinComponents/Text';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';

import {ITheme} from '~/theme/interfaces';
import {useRootNavigation} from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import {fontFamilies} from '~/theme/fonts';
import menuActions from '../../redux/actions';
import {formatDate} from '~/utils/formatData';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../redux/keySelector';
import {showHideToastMessage} from '~/store/modal/actions';
import {IToastMessage} from '~/interfaces/common';
import {isEmpty} from 'lodash';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

const AddWork = () => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

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
  const [selectingStartDate, setSelectingStartDate] = useState<boolean>(false);

  const [endDateValue, setEndDateValue] = useState<string | null>(
    endDate || null,
  );
  const [selectingEndDate, setSelectingEndDate] = useState<boolean>(false);

  const [isFocus, setIsFocus] = useState<boolean>(false);

  useEffect(() => {
    if (isWorkHere) {
      setEndDateValue(null);
    } else {
      setEndDateValue(endDate || null);
    }
  }, [isWorkHere]);

  const navigateBack = () => {
    Keyboard.dismiss();
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.userEdit);
    }
  };

  const onSave = () => {
    if (
      endDateValue &&
      new Date(startDateValue).getTime() > new Date(endDateValue).getTime()
    ) {
      const toastMessage: IToastMessage = {
        content: 'settings:text_enddate_after_startdate',
        props: {
          textProps: {useI18n: true},
          type: 'error',
        },
      };
      dispatch(showHideToastMessage(toastMessage));
      return;
    }

    if (!isWorkHere && !endDateValue) {
      const toastMessage: IToastMessage = {
        content: 'settings:text_enddate_must_choose',
        props: {
          textProps: {useI18n: true},
          type: 'error',
        },
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
      startDate: startDateValue ? startDateValue : undefined,
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

  const onDelete = () => {
    dispatch(menuActions.deleteWorkExperience(id, navigateBack));
  };

  const onChangeCompany = (text: string) => {
    setCompanyValue(text);
  };

  const onChangePosition = (text: string) => {
    setPositionValue(text);
  };

  const onChangeLocation = (text: string) => {
    setLocationValue(text);
  };

  const onChangeDescription = (text: string) => {
    setDescriptionValue(text);
  };

  const onToggleCurrentlyWorkHere = () => {
    Keyboard.dismiss();
    setIsWorkHere(!isWorkHere);
  };

  const onStartDateEditOpen = () => setSelectingStartDate(true);

  const onStartDateEditClose = () => setSelectingStartDate(false);

  const onSetStartDate = (date?: Date) => {
    if (date) {
      setStartDateValue(date.toISOString());
    }
    setSelectingStartDate(false);
  };

  const onEndDateEditOpen = () => setSelectingEndDate(true);

  const onEndDateEditClose = () => setSelectingEndDate(false);

  const onSetEndDate = (date?: Date) => {
    if (date) {
      setEndDateValue(date.toISOString());
    }
    setSelectingEndDate(false);
  };

  const onFocusDescription = () => {
    setIsFocus(true);
  };

  const onBlurDescription = () => {
    setIsFocus(false);
  };

  const renderCompanyInput = () => {
    return (
      <TextInputBein
        value={companyValue}
        maxLength={50}
        testID="add_work.company"
        onChangeText={onChangeCompany}
        outlineColor={colors.borderCard}
        activeOutlineColor={colors.primary6}
        placeholder={i18next.t('settings:text_compamny')}
      />
    );
  };

  const renderTitlePositionInput = () => {
    return (
      <TextInputBein
        value={positionValue}
        maxLength={50}
        testID="add_work.title_position"
        placeholder={i18next.t('settings:text_title_position')}
        onChangeText={onChangePosition}
        activeOutlineColor={colors.primary6}
        outlineColor={colors.borderCard}
      />
    );
  };

  const renderLocationInput = () => {
    return (
      <TextInputBein
        value={locationValue}
        maxLength={25}
        testID="add_work.location"
        placeholder={i18next.t('settings:text_location_optional')}
        onChangeText={onChangeLocation}
        activeOutlineColor={colors.primary6}
        outlineColor={colors.borderCard}
      />
    );
  };

  const renderDescriptionInput = () => {
    return (
      <View
        testID="add_work.description.view"
        style={[styles.textInputView, isFocus ? styles.textInputFocus : {}]}>
        <TextInput
          value={descriptionValue}
          maxLength={200}
          testID="add_work.description"
          placeholder={i18next.t('settings:text_description_optional')}
          onChangeText={onChangeDescription}
          style={styles.textInput}
          multiline={true}
          textAlignVertical="top"
          onFocus={onFocusDescription}
          onBlur={onBlurDescription}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
    );
  };

  const renderCurrentlyWorkHere = () => {
    return (
      <View style={styles.selectionLineView}>
        <Text.H6 useI18n>settings:text_currently_work_here</Text.H6>
        <Toggle
          isChecked={isWorkHere}
          testID="add_work.currently_work_here"
          onActionPress={onToggleCurrentlyWorkHere}
        />
      </View>
    );
  };

  const renderStartDate = () => {
    return (
      <View style={styles.selectionLineView}>
        <Text.H6 testID="add_work.start_date.title" useI18n>
          {isWorkHere ? 'settings:text_since' : 'common:text_start_date'}
        </Text.H6>
        <ButtonWrapper
          testID="add_work.start_date.button"
          style={styles.buttonDate}
          onPress={onStartDateEditOpen}>
          <Icon
            icon="CalendarAlt"
            tintColor={colors.textSecondary}
            style={styles.calendarIcon}
          />
          <Text.BodyS testID="add_work.start_date" color={colors.textSecondary}>
            {formatDate(startDateValue, 'MMMM DD, YYYY') ||
              i18next.t('common:text_not_set')}
          </Text.BodyS>
        </ButtonWrapper>
      </View>
    );
  };

  const renderEndDate = () => {
    if (isWorkHere) return null;
    return (
      <View testID="add_work.end_date_view" style={styles.selectionLineView}>
        <Text.H6 useI18n>common:text_end_date</Text.H6>
        <ButtonWrapper
          testID="add_work.end_date.button"
          style={styles.buttonDate}
          onPress={onEndDateEditOpen}>
          <Icon
            icon="CalendarAlt"
            tintColor={colors.textSecondary}
            style={styles.calendarIcon}
          />

          <Text.BodyS testID="add_work.end_date" color={colors.textSecondary}>
            {(endDateValue && formatDate(endDateValue, 'MMMM DD, YYYY')) ||
              i18next.t('common:text_not_set')}
          </Text.BodyS>
        </ButtonWrapper>
      </View>
    );
  };

  const renderDeleteButton = () => {
    return (
      selectedWorkItem && (
        <Button.Danger
          testID="add_work.delete"
          onPress={onDelete}
          useI18n
          style={styles.buttonDelete}>
          settings:text_delete_work
        </Button.Danger>
      )
    );
  };

  return (
    <ScreenWrapper testID="AddWork" isFullView>
      <Header
        title={
          selectedWorkItem
            ? 'settings:text_edit_work'
            : 'settings:text_add_work'
        }
        titleTextProps={{useI18n: true}}
        buttonText={selectedWorkItem ? 'common:text_save' : 'common:text_add'}
        buttonProps={{
          useI18n: true,
          color: theme.colors.primary6,
          textColor: theme.colors.background,
          disabled:
            companyValue?.trim?.() && positionValue?.trim?.() ? false : true,
          borderRadius: spacing.borderRadius.small,
          testID: 'add_work.save',
        }}
        onPressButton={onSave}
        onPressBack={navigateBack}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {renderCompanyInput()}
        {renderTitlePositionInput()}
        {renderLocationInput()}
        {renderDescriptionInput()}
        <View style={styles.selectionView}>
          {renderCurrentlyWorkHere()}
          {renderStartDate()}
          {renderEndDate()}
        </View>
        {renderDeleteButton()}
      </ScrollView>

      {selectingStartDate && (
        <View testID="add_work.start_date.bottom_sheet">
          <DateTimePicker
            isVisible={selectingStartDate}
            date={new Date()}
            mode={'date'}
            onConfirm={onSetStartDate}
            onCancel={onStartDateEditClose}
          />
        </View>
      )}

      {selectingEndDate && (
        <View testID="add_work.end_date.bottom_sheet">
          <DateTimePicker
            isVisible={selectingEndDate}
            date={new Date()}
            mode={'date'}
            onConfirm={onSetEndDate}
            onCancel={onEndDateEditClose}
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default AddWork;

const createStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      margin: spacing.margin.large,
    },
    textInputView: {
      borderRadius: spacing.borderRadius.small,
      borderColor: colors.borderCard,
      borderWidth: 1,
      padding: spacing.margin.base,
      marginTop: spacing.margin.small,
      height: 88,
    },
    textInput: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: dimension.sizes.body,
      color: colors.textPrimary,
      flex: 1,
    },
    textInputFocus: {
      borderColor: colors.primary6,
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
      backgroundColor: colors.bgSecondary,
    },
    calendarIcon: {
      marginRight: spacing.margin.small,
    },
    buttonDelete: {
      borderRadius: spacing.borderRadius.small,
    },
  });
};
