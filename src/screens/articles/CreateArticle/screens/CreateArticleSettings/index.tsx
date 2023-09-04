import React, { useEffect, useRef } from 'react';
import {
  View, StyleSheet, FlatList, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import { IArticleSettingsScreenParams } from '~/interfaces/IArticle';
import Header from '~/beinComponents/Header';
import useArticleSettings from '~/screens/articles/CreateArticle/screens/CreateArticleSettings/useArticleSettings';
import spacing from '~/theme/spacing';
import { useBackPressListener } from '~/hooks/navigation';
import BottomSheet from '~/baseComponents/BottomSheet';
import { timeSuggest } from '~/constants/importantTimeSuggest';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import MarkImportant from '~/components/ContentSettings/MarkImportant';
import images from '~/resources/images';
import useCreateArticleStore from '../../store';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import useCreateArticle from '../../hooks/useCreateArticle';

interface CreateArticleSettingsProps {
  route?: {
    params?: IArticleSettingsScreenParams;
  };
}

const CreateArticleSettings = ({ route }: CreateArticleSettingsProps) => {
  const { articleId, isFromArticleMenuSettings } = route?.params || {};
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const audienceSheetRef = useRef<any>();
  const expireTimeSheetRef = useRef<any>();

  const resetEditArticleStore = useCreateArticleStore((state) => state.reset);
  const resetMentionInputStore = useMentionInputStore((state) => state.reset);

  const { audiencesWithNoPermission: listAudiencesWithoutPermission }
    = useCreateArticle({ articleId });

  const {
    sImportant,
    showWarning,
    showCustomExpire,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handleChangeSuggestDate,
    getMinDate,
    getMaxDate,
    disableButtonSave,
    loading,
    handleSaveSettings,
    handleBack,
  } = useArticleSettings({ articleId });

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
    item,
    titleProps,
    onPress = undefined,
    showAvatar = true,
  }: {
    item: any;
    titleProps?: any;
    showAvatar?: boolean;
    onPress?: any;
  }) => (
    <PrimaryItem
      title={item?.name || item.title}
      showAvatar={showAvatar}
      avatar={showAvatar ? item?.icon || images.img_user_avatar_default : null}
      titleProps={titleProps}
      onPress={onPress}
    />
  );

  const renderAudienceItem = ({ item }: { item: any }) => renderItem({ item, titleProps: { variant: 'subtitleM' } });

  const renderExpireTimeItem = ({ item }: { item: any }) => renderItem({
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

  useEffect(
    () => () => {
      if (isFromArticleMenuSettings) {
        resetEditArticleStore();
        resetMentionInputStore();
      }
    },
    [],
  );

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
            type="article"
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

export default CreateArticleSettings;
