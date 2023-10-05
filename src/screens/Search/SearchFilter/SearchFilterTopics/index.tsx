import React, { FC, useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Keyboard, StyleSheet, View } from 'react-native';
import Header from '~/beinComponents/Header';
import useSearchStore from '../../store';
import { spacing } from '~/theme';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import useSelectCategoriesStore from '~/components/SelectCategories/store';
import { isDiffBetweenTwoArraysByProperty } from '~/helpers/common';
import { ICategory } from '~/interfaces/IArticle';
import SelectTopics from './components/SelectTopics';
import showAlert from '~/store/helper/showAlert';

type SearchFilterTopicsProps = {
  route: {
    params: {
      searchScreenKey: string;
    };
  };
};

const SearchFilterTopics: FC<SearchFilterTopicsProps> = ({ route }) => {
  const { searchScreenKey } = route?.params || {};

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme = useTheme();
  const styles = createStyle(theme);

  const selectCategoriesActions = useSelectCategoriesStore((state) => state.actions);
  const selectedCategories = useSelectCategoriesStore(
    (state) => state.selected,
  );

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterTopics = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.topics,
  );

  const disabled = !isDiffBetweenTwoArraysByProperty<ICategory>('id', selectedCategories, currentFilterTopics);

  const onPressSave = () => {
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      topics: selectedCategories,
    });
    rootNavigation.goBack();
  };

  const onBack = () => {
    if (!disabled) {
      Keyboard.dismiss();
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => {
          rootNavigation.goBack();
        },
      });
      return;
    }
    rootNavigation.goBack();
  };

  useBackPressListener(onBack);

  useEffect(() => {
    if (currentFilterTopics) {
      selectCategoriesActions.updateSelectedCategories(currentFilterTopics);
    }
  }, [currentFilterTopics]);

  return (
    <View style={styles.container}>
      <Header
        title={t('search:topics')}
        buttonProps={{ disabled, loading: false, style: styles.btnSave }}
        buttonText={t('search:apply')}
        onPressButton={onPressSave}
        onPressBack={onBack}
      />
      <SelectTopics />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
  });
};

export default SearchFilterTopics;
