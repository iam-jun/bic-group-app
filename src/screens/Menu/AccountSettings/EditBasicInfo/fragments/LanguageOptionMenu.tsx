import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Keyboard,
  ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import BottomSheet from '~/baseComponents/BottomSheet';
import { ILanguageItem } from '~/interfaces/IEditUser';

import TitleComponent from '../../fragments/TitleComponent';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import LanguageOptionMenuItem from './LanguageOptionMenuItem';
import LanguageOptionMenuSelected from './LanguageOptionMenuSelected';
import Tag from '~/baseComponents/Tag';
import { useBaseHook } from '~/hooks';
import { ILanguageResponseItem } from '~/interfaces/IAuth';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';

interface LanguageOptionMenuProps {
  onChangeLanguages: (languages: string[]) => void;
  selectedLanguages: string[];
}

const initLstLanguageState = (
  languages: ILanguageResponseItem[],
  selectedLanguages: string[] = [],
): ILanguageItem[] => languages.map((item) => ({
  ...item,
  selected: selectedLanguages?.includes(item.code),
}));

const getSelectedLanguages = (languages: ILanguageItem[]) => languages.filter((item) => item.selected);

const LanguageOptionMenu = ({
  onChangeLanguages,
  selectedLanguages,
}: LanguageOptionMenuProps) => {
  const { t } = useBaseHook();
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const styles = themeStyles(theme, screenHeight);

  const languagesResponse = useUserProfileStore((state) => state.languages);

  const [languages, setLanguages] = useState(
    initLstLanguageState(languagesResponse, selectedLanguages),
  );

  const languageSheetRef = useRef<any>();

  const updateSelectedLanguages = (lstCurrentLanguage: ILanguageItem[]) => {
    const newSelectedItems = lstCurrentLanguage.reduce(
      (acc: string[], cur: ILanguageItem) => {
        if (cur.selected) {
          acc.push(cur.code);
        }
        return acc;
      },
      [],
    );
    onChangeLanguages(newSelectedItems);
  };

  const onSelectItem = (language: ILanguageItem) => {
    setLanguages(
      languages.map((lang) => {
        if (lang.code === language.code) {
          return {
            ...lang,
            selected: !lang.selected,
          };
        }
        return lang;
      }),
    );
  };

  const onRemoveItem = (
    language?: ILanguageItem,
    isUpdateSelectedLanguages?: boolean,
  ) => {
    // remove all
    if (!language) {
      setLanguages(
        languages.map((lang) => ({
          ...lang,
          selected: false,
        })),
      );
      return;
    }

    // remove specific item
    const newLanguagesState = languages.map((lang) => {
      if (lang.code === language.code) {
        return {
          ...lang,
          selected: false,
        };
      }
      return lang;
    });
    setLanguages(newLanguagesState);
    if (isUpdateSelectedLanguages) {
      updateSelectedLanguages(newLanguagesState);
    }
  };

  const onCloseModal = () => {
    updateSelectedLanguages(languages);
  };

  const renderItem = ({ item }: { item: ILanguageItem }) => (
    <LanguageOptionMenuItem language={item} onChoose={onSelectItem} />
  );

  const onLanguageEditOpen = (e: any) => {
    Keyboard.dismiss();
    languageSheetRef?.current?.open?.(e?.pageX, e?.pageY);
  };

  const selectedLanguageItems = getSelectedLanguages(languages);

  return (
    <View>
      <TitleComponent title="settings:title_language" isOptional />
      <Button
        testID="edit_basic_info.language"
        textProps={{
          color:
            selectedLanguageItems && selectedLanguageItems.length !== 0
              ? colors.neutral80
              : colors.neutral20,
          variant: 'bodyM',
          numberOfLines: 1,
          style: { flex: 1 },
          testID: 'edit_basic_info.language.title',
        }}
        style={styles.buttonDropDown}
        contentStyle={styles.buttonDropDownContent}
        rightIcon="AngleDown"
        rightIconProps={{ tintColor: colors.neutral40, size: 14 }}
        onPress={(e) => onLanguageEditOpen(e)}
      >
        {selectedLanguageItems && selectedLanguageItems.length !== 0 ? (
          <View style={styles.tagContainer}>
            {selectedLanguageItems.map((item) => (
              <View
                key={`sllg-${item.code}`}
                testID="edit_basic_info.language.selected_item"
              >
                <Tag
                  type="neutral"
                  size="medium"
                  style={styles.tag}
                  label={item.local}
                  icon="Xmark"
                  onPressIcon={() => onRemoveItem(item, true)}
                />
              </View>
            ))}
          </View>
        ) : (
          t('settings:select_language')
        )}
      </Button>

      <BottomSheet
        modalizeRef={languageSheetRef}
        ContentComponent={(
          <View style={styles.contentComponent} testID="language.bottom_sheet">
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <LanguageOptionMenuSelected
                languages={selectedLanguageItems}
                onRemove={onRemoveItem}
              />
              {languages.map((item: ILanguageItem) => (
                <View key={`${item?.code} ${item?.local}`}>
                  {renderItem({ item })}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        onClose={onCloseModal}
      />
    </View>
  );
};

export default LanguageOptionMenu;

const themeStyles = (theme: ExtendedTheme, screenHeight: number) => {
  const { colors } = theme;

  return StyleSheet.create({
    contentComponent: {
      maxHeight: 0.8 * screenHeight,
    },
    chooseText: {
      margin: spacing.margin.base,
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
    btnConfirmLanguage: {
      paddingHorizontal: spacing.margin.large,
      paddingTop: spacing.margin.large,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      flex: 1,
      marginVertical: spacing.margin.xSmall,
    },
    tag: {
      marginVertical: 2,
    },
  });
};
