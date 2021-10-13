import i18next from 'i18next';
import React, {useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';

import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import speakingLanguages from '~/constants/speakingLanguages';
import useMenu from '~/hooks/menu';
import {ILanguageItem} from '~/interfaces/IEditUser';

import {ITheme} from '~/theme/interfaces';
import SettingItem from './SettingItem';

interface LanguageOptionMenuProps {
  title: string;
  onChangeLanguages: (languages: string[]) => void;
}

const LanguageOptionMenu = ({
  title,
  onChangeLanguages,
}: LanguageOptionMenuProps) => {
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme, screenHeight);
  const {myProfile} = useMenu();
  const {language: userLanguages} = myProfile;

  const speakingLanguagesList = Object.keys(speakingLanguages).map(
    (code: string) => ({
      code,
      // @ts-ignore
      ...speakingLanguages[code],
    }),
  );
  const [languages, setLanguages] = useState(speakingLanguagesList);
  const [selectedLanguages, setSelectedLanguages] =
    useState<string[]>(userLanguages);

  const languageSheetRef = useRef<any>();

  useEffect(() => {
    setLanguages(
      languages.map(lang => ({
        ...lang,
        selected: userLanguages?.includes(lang.code),
      })),
    );
  }, [userLanguages]);

  useEffect(() => {
    onChangeLanguages(selectedLanguages);
  }, [selectedLanguages]);

  const onSelectItem = (language: ILanguageItem) => {
    setSelectedLanguages(
      !language.selected
        ? [...selectedLanguages, language.code]
        : selectedLanguages.filter((item: string) => item !== language.code),
    );

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
        title={i18next.t(item.fullName)}
        height={36}
        isChecked={item.selected}
        onPressCheckbox={() => onSelectItem(item)}
      />
    );
  };

  const onLanguageEditOpen = (e: any) =>
    languageSheetRef?.current?.open?.(e?.pageX, e?.pageY);

  return (
    <View>
      <SettingItem
        title={'settings:title_language'}
        subtitle={
          selectedLanguages
            // @ts-ignore
            ?.map(language => speakingLanguages[language]?.name)
            .join(', ') || i18next.t('settings:text_not_set')
        }
        leftIcon={'CommentsAlt'}
        rightIcon={'EditAlt'}
        onPress={e => onLanguageEditOpen(e)}
      />

      <BottomSheet
        modalizeRef={languageSheetRef}
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
              <ListView data={languages} renderItem={renderItem} />
            </ScrollView>
          </View>
        }
      />
    </View>
  );
};

export default LanguageOptionMenu;

const themeStyles = (theme: ITheme, screenHeight: number) => {
  const {spacing} = theme;

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
  });
};
