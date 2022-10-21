import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Keyboard,
  ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import BottomSheet from '~/baseComponents/BottomSheet';
import speakingLanguages from '~/constants/speakingLanguages';
import { ILanguageItem } from '~/interfaces/IEditUser';

import TitleComponent from '../../fragments/TitleComponent';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import LanguageOptionMenuItem from './LanguageOptionMenuItem';
import LanguageOptionMenuSelected from './LanguageOptionMenuSelected';
import Tag from '~/baseComponents/Tag';
import { useBaseHook } from '~/hooks';

interface LanguageOptionMenuProps {
  onChangeLanguages: (languages: string[]) => void;
  selectedLanguages: string[];
}

const speakingLanguagesList = Object.keys(speakingLanguages).map(
  (code: string) => ({
    code,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...speakingLanguages[code],
  }),
);

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

  const [languages, setLanguages] = useState(speakingLanguagesList);

  const languageSheetRef = useRef<any>();

  useEffect(() => {
    setLanguages(
      languages.map((lang) => ({
        ...lang,
        selected: selectedLanguages?.includes(lang.code),
      })),
    );
  }, [selectedLanguages]);

  const onSelectItem = (language: ILanguageItem) => {
    const newSelectedItems = languages.reduce(
      (acc: string[], cur: ILanguageItem) => {
        if (
          (cur.code === language.code && !cur.selected)
          || (cur.code !== language.code && cur.selected)
        ) {
          acc.push(cur.code);
        }
        return acc;
      },
      [],
    );
    onChangeLanguages(newSelectedItems);
  };

  const onRemoveItem = (language?: ILanguageItem) => {
    // remove all
    if (!language) {
      onChangeLanguages([]);
      return;
    }

    // remove specific item
    const newSelectedItems = languages.reduce(
      (acc: string[], cur: ILanguageItem) => {
        if (cur.code !== language.code && cur.selected) {
          acc.push(cur.code);
        }
        return acc;
      },
      [],
    );
    onChangeLanguages(newSelectedItems);
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
      <TitleComponent title="settings:title_language" />
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
        rightIconProps={{ tintColor: colors.neutral40, size: 14 }}
        onPress={(e) => onLanguageEditOpen(e)}
      >
        {selectedLanguageItems && selectedLanguageItems.length !== 0 ? (
          <View style={styles.tagContainer}>
            {selectedLanguageItems.map((item) => (
              <View key={`sllg-${item.code}`}>
                <Tag
                  type="neutral"
                  size="medium"
                  style={styles.tag}
                  label={item.name}
                  icon="Xmark"
                  onPressIcon={() => onRemoveItem(item)}
                />
              </View>
            ))}
          </View>
        ) : (
          t('common:text_not_set')
        )}
      </Button>

      <BottomSheet
        modalizeRef={languageSheetRef}
        ContentComponent={(
          <View style={styles.contentComponent}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <LanguageOptionMenuSelected
                languages={selectedLanguageItems}
                onRemove={onRemoveItem}
              />
              {languages.map((item: ILanguageItem) => (
                <View key={`${item?.code} ${item?.fullName}`}>
                  {renderItem({ item })}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
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
