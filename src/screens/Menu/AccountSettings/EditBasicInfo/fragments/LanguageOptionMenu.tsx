import i18next from 'i18next';
import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  Keyboard,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';

import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import speakingLanguages from '~/constants/speakingLanguages';
import {ILanguageItem} from '~/interfaces/IEditUser';

import {ITheme} from '~/theme/interfaces';
import TitleComponent from '../../fragments/TitleComponent';
import Button from '~/beinComponents/Button';
import {isEqual} from 'lodash';

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
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const styles = themeStyles(theme, screenHeight);

  const speakingLanguagesList = Object.keys(speakingLanguages).map(
    (code: string) => ({
      code,
      // @ts-ignore
      ...speakingLanguages[code],
    }),
  );
  const [languages, setLanguages] = useState(speakingLanguagesList);

  const languageSheetRef = useRef<any>();

  useEffect(() => {
    setLanguages(
      languages.map(lang => ({
        ...lang,
        selected: selectedLanguages?.includes(lang.code),
      })),
    );
  }, [selectedLanguages]);

  const onConfirmLanguage = () => {
    const newSelectedLanguages = languages
      ?.filter(lang1 => lang1?.selected)
      ?.map(lang2 => lang2?.code || '');
    onChangeLanguages(newSelectedLanguages);
    languageSheetRef.current?.close();
  };

  const resetData = () => {
    const newSelectedLanguages = languages
      ?.filter(lang1 => lang1?.selected)
      ?.map(lang2 => lang2?.code || '');

    if (!isEqual(selectedLanguages, newSelectedLanguages)) {
      setLanguages(
        languages.map(lang => ({
          ...lang,
          selected: selectedLanguages?.includes(lang.code),
        })),
      );
    }
  };

  const onSelectItem = (language: ILanguageItem) => {
    setLanguages(
      languages.map((item: ILanguageItem) =>
        item.code === language.code
          ? {
              ...item,
              selected: !item.selected,
            }
          : item,
      ),
    );
  };

  const renderItem = ({item}: {item: ILanguageItem}) => {
    return (
      <PrimaryItem
        testID="language_option_menu.checkbox"
        title={i18next.t(item.fullName)}
        height={36}
        isChecked={item.selected}
        checkboxProps={{testID: 'language_option_menu.checkbox'}}
        onPressCheckbox={() => onSelectItem(item)}
      />
    );
  };

  const onLanguageEditOpen = (e: any) => {
    Keyboard.dismiss();
    languageSheetRef?.current?.open?.(e?.pageX, e?.pageY);
  };

  return (
    <View>
      <TitleComponent icon="CommentsAlt" title="settings:title_language" />
      <Button
        testID="edit_basic_info.language"
        textProps={{
          color: colors.textInput,
          variant: 'body',
          numberOfLines: 1,
          style: {flex: 1},
        }}
        style={styles.buttonDropDown}
        contentStyle={styles.buttonDropDownContent}
        rightIcon={'AngleDown'}
        onPress={e => onLanguageEditOpen(e)}>
        {selectedLanguages
          // @ts-ignore
          ?.map(language => speakingLanguages[language]?.name)
          .join(', ') || i18next.t('common:text_not_set')}
      </Button>

      <BottomSheet
        modalizeRef={languageSheetRef}
        onClose={resetData}
        ContentComponent={
          <View style={styles.contentComponent}>
            <Text.ButtonSmall
              color={theme.colors.textSecondary}
              style={styles.chooseText}
              useI18n>
              {title}
            </Text.ButtonSmall>
            <Divider />
            <ScrollView>
              {(languages || []).map((item: ILanguageItem) =>
                renderItem({item}),
              )}
            </ScrollView>
            <Button.Primary
              testID="edit_basic_info.save_language"
              onPress={onConfirmLanguage}
              style={styles.btnConfirmLanguage}>
              {i18next.t('btn_save')}
            </Button.Primary>
          </View>
        }
      />
    </View>
  );
};

export default LanguageOptionMenu;

const themeStyles = (theme: ITheme, screenHeight: number) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    contentComponent: {
      maxHeight: 0.9 * screenHeight,
      ...Platform.select({
        web: {
          maxHeight: 0.55 * screenHeight,
        },
      }),
    },
    chooseText: {
      margin: spacing.margin.base,
    },
    buttonDropDown: {
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.borderCard,
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
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.large,
    },
  });
};
