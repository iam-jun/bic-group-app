import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import useMenu from '~/hooks/menu';
import speakingLanguages from '~/constants/speakingLanguages';

import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import SettingItem from './SettingItem';

interface LanguageOptionMenuProps {
  title: string;
  onChangeLanguages: (languages: any[]) => void;
}

const LanguageOptionMenu = ({
  title,
  onChangeLanguages,
}: LanguageOptionMenuProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {myProfile} = useMenu();
  const {language: userLanguages} = myProfile;

  const [languages, setLanguages] = useState(speakingLanguages);
  const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);

  const languageSheetRef = useRef<any>();

  useEffect(() => {
    setSelectedLanguages(userLanguages);
  }, [userLanguages]);

  useEffect(() => {
    onChangeLanguages(selectedLanguages);
  }, [selectedLanguages]);

  const onSelectItem = (language: any) => {
    setSelectedLanguages(
      !language.selected
        ? [...selectedLanguages, {...language, selected: true}]
        : selectedLanguages.filter(item => item.type !== language.type),
    );
    setLanguages(
      languages.map((item: any) =>
        item.type === language.type
          ? {
              ...item,
              selected: !item.selected,
            }
          : item,
      ),
    );
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <PrimaryItem
        title={i18next.t(item.title)}
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
          selectedLanguages.map(language => language.title).join(', ') ||
          i18next.t('settings:text_not_set')
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
