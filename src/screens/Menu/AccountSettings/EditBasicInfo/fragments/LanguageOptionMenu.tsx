import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import useMenu from '~/hooks/menu';
import speakingLanguages from '~/constants/speakingLanguages';
import SettingItem from './SettingItem';
import {ILanguageItem} from '~/interfaces/IEditUser';

import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

interface LanguageOptionMenuProps {
  title: string;
  onChangeLanguages: (languages: string[]) => void;
}

const LanguageOptionMenu = ({
  title,
  onChangeLanguages,
}: LanguageOptionMenuProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
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
        selected: userLanguages.includes(lang.code),
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

  return (
    <View>
      <SettingItem
        title={'settings:title_language'}
        subtitle={
          selectedLanguages
            // @ts-ignore
            .map(language => speakingLanguages[language]?.name)
            .join(', ') || i18next.t('settings:text_not_set')
        }
        leftIcon={'CommentsAlt'}
        rightIcon={'EditAlt'}
        onPress={() => languageSheetRef?.current?.open?.()}
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
            <ListView data={languages} renderItem={renderItem} />
          </View>
        }
      />
    </View>
  );
};

export default LanguageOptionMenu;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    contentComponent: {marginHorizontal: spacing.margin.base},
    chooseText: {
      margin: spacing.margin.base,
    },
  });
};
