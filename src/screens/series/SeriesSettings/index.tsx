import React, { useRef } from 'react';
import {
  View, StyleSheet, ScrollView, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import spacing from '~/theme/spacing';
import MarkImportant from '~/components/ImportantSettings/MarkImportant';
import BottomSheet from '~/baseComponents/BottomSheet';
import { timeSuggest } from '~/constants/importantTimeSuggest';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import images from '~/resources/images';
import { ISeriesSettingsParams } from '~/interfaces/ISeries';
import useSeriesSettings from './useSeriesSettings';
import { useRootNavigation } from '~/hooks/navigation';
import useModalStore from '~/store/modal';
import { useBaseHook } from '~/hooks';

interface SeriesSettingsProps {
    route?: {
        params?: ISeriesSettingsParams;
    };
}

const SeriesSettings = ({ route }: SeriesSettingsProps) => {
  const { seriesId, listAudiencesWithoutPermission } = route.params || {};
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const audienceSheetRef = useRef<any>();
  const expireTimeSheetRef = useRef<any>();

  const { showAlert } = useModalStore((state) => state.actions);

  const {
    sImportant,
    showWarning,
    showCustomExpire,
    disableButtonSave,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handleChangeSuggestDate,
    handleSaveSettings,
    getMinDate,
    getMaxDate,
  } = useSeriesSettings({ seriesId, listAudiencesWithoutPermission });

  const handleBack = () => {
    if (disableButtonSave) {
      rootNavigation.goBack();
    } else {
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      });
    }
  };

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

  return (
    <ScreenWrapper isFullView backgroundColor={colors.neutral1}>
      <Header
        useI18n
        title="series:series_settings"
        buttonProps={{ disabled: disableButtonSave, style: styles.btnSave }}
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
