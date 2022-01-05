import React, {useState, useEffect} from 'react';
import i18next from 'i18next';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {useTheme, TextInput as TextInputPaper} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import TextInputBein from '~/beinComponents/inputs/TextInput';
import Icon from '~/beinComponents/Icon';
import Divider from '~/beinComponents/Divider';
import Toggle from '~/beinComponents/SelectionControl/Toggle';
import Text from '~/beinComponents/Text';
import DateTimePicker from '~/beinComponents/DateTimePicker';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Div from '~/beinComponents/Div';

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

const AddWork = () => {
  const theme = useTheme() as ITheme;
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
    currentlyWorkHere || false,
  );

  const [startDateValue, setStartDateValue] = useState<string>(
    startDate || new Date().toISOString(),
  );
  const [selectingStartDate, setSelectingStartDate] = useState<boolean>(false);

  const [endDateValue, setEndDateValue] = useState<string | null>(
    endDate || null,
  );
  const [selectingEndDate, setSelectingEndDate] = useState<boolean>(false);

  useEffect(() => {
    isWorkHere && setEndDateValue(null);
  }, [isWorkHere]);

  const navigateBack = () => {
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
      : dispatch(menuActions.addWorkExperience(data, navigateBack));
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

  const renderCompanyInput = () => {
    return (
      <TextInputBein
        label={i18next.t('settings:text_compamny')}
        value={companyValue}
        maxLength={50}
        testID="add_work.company"
        left={
          // @ts-ignore
          <TextInputPaper.Icon
            name={() => (
              <Icon
                icon={'iconSuitcase'}
                tintColor={theme.colors.textDisabled}
              />
            )}
          />
        }
        onChangeText={onChangeCompany}
      />
    );
  };

  const renderTitlePositionInput = () => {
    return (
      <TextInput
        style={styles.textInput}
        value={positionValue}
        maxLength={50}
        testID="add_work.title_position"
        placeholder={i18next.t('settings:text_title_position')}
        placeholderTextColor={theme.colors.textSecondary}
        onChangeText={onChangePosition}
      />
    );
  };

  const renderLocationInput = () => {
    return (
      <TextInput
        style={styles.textInput}
        value={locationValue}
        maxLength={25}
        testID="add_work.location"
        placeholder={i18next.t('settings:text_location_optional')}
        placeholderTextColor={theme.colors.textSecondary}
        onChangeText={onChangeLocation}
      />
    );
  };

  const renderDescriptionInput = () => {
    return (
      <TextInput
        style={styles.textInput}
        value={descriptionValue}
        maxLength={200}
        testID="add_work.description"
        placeholder={i18next.t('settings:text_description_optional')}
        placeholderTextColor={theme.colors.textSecondary}
        onChangeText={onChangeDescription}
      />
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
        <Text.H6 useI18n>
          {isWorkHere ? 'settings:text_since' : 'common:text_start_date'}
        </Text.H6>
        <ButtonWrapper onPress={onStartDateEditOpen}>
          <Text.ButtonSmall
            testID="add_work.start_date"
            color={theme.colors.primary7}>
            {formatDate(startDateValue, 'MMM Do, YYYY') ||
              i18next.t('common:text_not_set')}
          </Text.ButtonSmall>
        </ButtonWrapper>
      </View>
    );
  };

  const renderEndDate = () => {
    return (
      !isWorkHere && (
        <View style={styles.selectionLineView}>
          <Text.H6 useI18n>common:text_end_date</Text.H6>
          <ButtonWrapper onPress={onEndDateEditOpen}>
            <Text.ButtonSmall
              testID="add_work.end_date"
              color={theme.colors.primary7}>
              {(endDateValue && formatDate(endDateValue, 'MMM Do, YYYY')) ||
                i18next.t('common:text_not_set')}
            </Text.ButtonSmall>
          </ButtonWrapper>
        </View>
      )
    );
  };

  const renderDeleteButton = () => {
    return (
      selectedWorkItem && (
        <View>
          <Divider />
          <View style={styles.deleteWork}>
            <TouchableOpacity onPress={onDelete}>
              <Text.H6
                testID="add_work.delete"
                color={theme.colors.error}
                useI18n>
                settings:text_delete_work
              </Text.H6>
            </TouchableOpacity>
          </View>
        </View>
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
        buttonText={'common:text_save'}
        buttonProps={{
          useI18n: true,
          disabled: companyValue.trim() && positionValue.trim() ? false : true,
        }}
        onPressButton={onSave}
        onPressBack={navigateBack}
      />

      <View style={styles.container}>
        {renderCompanyInput()}
        {renderTitlePositionInput()}
        <Divider />
        {renderLocationInput()}
        <Divider />
        {renderDescriptionInput()}
        <Divider />
        <View style={styles.selectionView}>
          {renderCurrentlyWorkHere()}
          {renderStartDate()}
          {renderEndDate()}
        </View>
        {renderDeleteButton()}
      </View>

      {selectingStartDate && (
        <Div className="react-datepicker-container">
          <DateTimePicker
            isVisible={selectingStartDate}
            date={new Date()}
            mode={'date'}
            onConfirm={onSetStartDate}
            onCancel={onStartDateEditClose}
          />
        </Div>
      )}

      {selectingEndDate && (
        <Div className="react-datepicker-container">
          <DateTimePicker
            isVisible={selectingEndDate}
            date={new Date()}
            mode={'date'}
            onConfirm={onSetEndDate}
            onCancel={onEndDateEditClose}
          />
        </Div>
      )}
    </ScreenWrapper>
  );
};

export default AddWork;

const createStyles = (theme: ITheme) => {
  const {spacing, colors, dimension} = theme;

  return StyleSheet.create({
    container: {
      margin: spacing.margin.large,
    },
    textInput: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: dimension.sizes.h6,
      color: colors.textPrimary,
      margin: spacing.margin.large,
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
  });
};
