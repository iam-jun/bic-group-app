import i18next from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Keyboard,
  ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEqual } from 'lodash';

import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import speakingLanguages from '~/constants/speakingLanguages';
import { ILanguageItem } from '~/interfaces/IEditUser';

import TitleComponent from '../../fragments/TitleComponent';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';

interface LanguageOptionMenuProps {
  title: string;
  onChangeLanguages: (languages: string[]) => void;
  selectedLanguages: string[];
}

const LanguageOptionMenu = ({
  title,
  onChangeLanguages,
  selectedLanguages,
}: LanguageOptionMenuProps) => {
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const styles = themeStyles(
    theme, screenHeight,
  );

  const speakingLanguagesList = Object.keys(speakingLanguages).map((code: string) => ({
    code,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...speakingLanguages[code],
  }));
  const [languages, setLanguages] = useState(speakingLanguagesList);

  const languageSheetRef = useRef<any>();

  useEffect(
    () => {
      setLanguages(languages.map((lang) => ({
        ...lang,
        selected: selectedLanguages?.includes(lang.code),
      })));
    }, [selectedLanguages],
  );

  const onConfirmLanguage = () => {
    const newSelectedLanguages = languages
      ?.filter((lang1) => lang1?.selected)
      ?.map((lang2) => lang2?.code || '');
    onChangeLanguages(newSelectedLanguages);
    languageSheetRef.current?.close();
  };

  const resetData = () => {
    const newSelectedLanguages = languages
      ?.filter((lang1) => lang1?.selected)
      ?.map((lang2) => lang2?.code || '');

    if (!isEqual(
      selectedLanguages, newSelectedLanguages,
    )) {
      setLanguages(languages.map((lang) => ({
        ...lang,
        selected: selectedLanguages?.includes(lang.code),
      })));
    }
  };

  const onSelectItem = (language: ILanguageItem) => {
    setLanguages(languages.map((item: ILanguageItem) => (item.code === language.code
      ? {
        ...item,
        selected: !item.selected,
      }
      : item)));
  };

  const renderItem = ({ item, index }: {item: ILanguageItem; index: number}) => (
    <PrimaryItem
      title={i18next.t(item.fullName)}
      height={36}
      isChecked={item.selected}
      checkboxProps={{
        testID: `language_option_menu.checkbox.item_${index}`,
      }}
      onPressCheckbox={() => onSelectItem(item)}
    />
  );

  const onLanguageEditOpen = (e: any) => {
    Keyboard.dismiss();
    languageSheetRef?.current?.open?.(
      e?.pageX, e?.pageY,
    );
  };

  return (
    <View>
      <TitleComponent icon="Comments" title="settings:title_language" />
      <Button
        testID="edit_basic_info.language"
        textProps={{
          color: colors.neutral80,
          variant: 'bodyM',
          numberOfLines: 1,
          style: { flex: 1 },
        }}
        style={styles.buttonDropDown}
        contentStyle={styles.buttonDropDownContent}
        rightIcon="AngleDown"
        onPress={(e) => onLanguageEditOpen(e)}
      >
        {selectedLanguages
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ?.map((language) => speakingLanguages[language]?.name)
          .join(', ') || i18next.t('common:text_not_set')}
      </Button>

      <BottomSheet
        modalizeRef={languageSheetRef}
        onClose={resetData}
        ContentComponent={(
          <View style={styles.contentComponent}>
            <Text.ButtonS
              color={theme.colors.gray50}
              style={styles.chooseText}
              useI18n
            >
              {title}
            </Text.ButtonS>
            <Divider />
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              {languages.map((
                item: ILanguageItem, index: number,
              ) => (
                <View key={`${item?.code} ${item?.fullName}`}>
                  {renderItem({ item, index })}
                </View>
              ))}
            </ScrollView>
            <View style={styles.btnConfirmLanguage}>
              <Button.Primary
                testID="edit_basic_info.save_language"
                onPress={onConfirmLanguage}
              >
                {i18next.t('btn_save')}
              </Button.Primary>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default LanguageOptionMenu;

const themeStyles = (
  theme: ExtendedTheme, screenHeight: number,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    contentComponent: {
      maxHeight: 0.8 * screenHeight,
    },
    chooseText: {
      margin: spacing.margin.base,
    },
    buttonDropDown: {
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.gray40,
      minHeight: 44,
      alignItems: 'stretch',
      justifyContent: 'center',
      marginVertical: spacing.margin.small,
      paddingLeft: spacing.padding.base,
    },
    buttonDropDownContent: {
      justifyContent: 'space-between',
    },
    btnConfirmLanguage: {
      paddingHorizontal: spacing.margin.large,
      paddingTop: spacing.margin.large,
    },
  });
};
