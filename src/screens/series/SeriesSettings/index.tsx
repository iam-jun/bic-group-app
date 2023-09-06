import React, { useEffect, useRef } from 'react';
import {
  View, StyleSheet, ScrollView, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import spacing from '~/theme/spacing';
import MarkImportant from '~/components/ContentSettings/MarkImportant';
import BottomSheet from '~/baseComponents/BottomSheet';
import { timeSuggest } from '~/constants/importantTimeSuggest';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import images from '~/resources/images';
import { ISeriesSettingsScreenParams } from '~/interfaces/ISeries';
import useSeriesSettings from './useSeriesSettings';
import useSeriesCreation from '../hooks/useSeriesCreation';
import useSeriesStore, { ISeriesState } from '../store';
import { useBackPressListener } from '~/hooks/navigation';

interface SeriesSettingsProps {
    route?: {
        params?: ISeriesSettingsScreenParams;
    };
}

const SeriesSettings = ({ route }: SeriesSettingsProps) => {
  const { seriesId, isFromSeriesMenuSettings } = route.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const audienceSheetRef = useRef<any>();
  const expireTimeSheetRef = useRef<any>();

  const resetStore = useSeriesStore((state:ISeriesState) => state.reset);
  const {
    audiencesWithNoPermission: listAudiencesWithoutPermission,
  } = useSeriesCreation({ seriesId });

  const {
    sImportant,
    showWarning,
    showCustomExpire,
    disableButtonSave,
    loading,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handleChangeSuggestDate,
    handleSaveSettings,
    getMinDate,
    getMaxDate,
    handleBack,
  } = useSeriesSettings({ seriesId });

  const disabled = disableButtonSave || loading;

  useBackPressListener(handleBack);

  const onPressAudiences = () => {
    audienceSheetRef.current?.open?.();
  };

  const handleDropDown = () => {
    expireTimeSheetRef.current?.open?.();
  };

  const handlePressSuggestDate = (item: any) => {
    expireTimeSheetRef?.current?.close?.();
    handleChangeSuggestDate(item);
  };

  const renderItem = ({
    item, titleProps, onPress = undefined, showAvatar = true,
  }: {item: any, titleProps?: any, showAvatar?:boolean, onPress?: any}) => (
    <PrimaryItem
      title={item?.name || item.title}
      showAvatar={showAvatar}
      avatar={showAvatar ? (item?.icon || images.img_user_avatar_default) : null}
      titleProps={titleProps}
      onPress={onPress}
    />
  );

  const renderAudienceItem = ({ item }: {item:any}) => renderItem({ item, titleProps: { variant: 'subtitleM' } });

  const renderExpireTimeItem = ({ item }: {item:any}) => renderItem({
    item,
    showAvatar: false,
    titleProps: { variant: 'bodyM', color: colors.neutral60 },
    onPress: () => handlePressSuggestDate(item),
  });

  const keyExtractor = (item: any) => JSON.stringify(item);

  const renderAudiencesSheet = () => (
    <FlatList
      style={[styles.expireTimeSheet, styles.audiencesSheet]}
      data={listAudiencesWithoutPermission.slice(2)}
      keyExtractor={keyExtractor}
      renderItem={renderAudienceItem}
    />
  );

  const renderExpireTimeSheet = () => (
    <FlatList
      style={styles.expireTimeSheet}
      data={timeSuggest}
      keyExtractor={keyExtractor}
      renderItem={renderExpireTimeItem}
    />
  );

  useEffect(() => () => {
    if (isFromSeriesMenuSettings) {
      resetStore();
    }
  }, []);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.neutral1}>
      <Header
        useI18n
        title="common:settings"
        buttonProps={{ disabled, loading, style: styles.btnSave }}
        buttonText="common:btn_save"
        onPressButton={handleSaveSettings}
        onPressBack={handleBack}
        removeBorderAndShadow
        style={styles.header}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <MarkImportant
            type="series"
            dataImportant={sImportant}
            showWarning={showWarning}
            handleToggleImportant={handleToggleImportant}
            handleDropDown={handleDropDown}
            showCustomExpire={showCustomExpire}
            getMinDate={getMinDate}
            getMaxDate={getMaxDate}
            handleChangeDatePicker={handleChangeDatePicker}
            handleChangeTimePicker={handleChangeTimePicker}
            listAudiencesWithoutPermission={listAudiencesWithoutPermission}
            onPressAudiences={onPressAudiences}
          />
        </ScrollView>
      </View>
      <BottomSheet
        modalizeRef={audienceSheetRef}
        ContentComponent={renderAudiencesSheet()}
      />
      <BottomSheet
        modalizeRef={expireTimeSheetRef}
        ContentComponent={renderExpireTimeSheet()}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    header: {
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral5,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    content: {
      flex: 1,
      backgroundColor: colors.white,
      paddingTop: spacing.margin.small,
    },
    expireTimeSheet: {
      flex: 1,
      paddingVertical: spacing.padding.tiny,
    },
    audiencesSheet: {
      height: 400,
    },
  });
};

export default SeriesSettings;
