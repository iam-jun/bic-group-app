import React, { FC, useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Keyboard, StyleSheet, View } from 'react-native';
import Header from '~/beinComponents/Header';
import useSearchStore from '../../store';
import { spacing } from '~/theme';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import useSearchFilterTagsStore from './store';
import SelectTags from './components/SelectTags';
import { isDiffBetweenTwoArraysByProperty } from '~/helpers/common';
import { ITagSearch } from '~/interfaces/ISearch';
import showAlert from '~/store/helper/showAlert';

type SearchFilterTagsProps = {
  route: {
    params: {
      searchScreenKey: string;
    };
  };
};

const SearchFilterTags: FC<SearchFilterTagsProps> = ({ route }) => {
  const { searchScreenKey } = route?.params || {};

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme = useTheme();
  const styles = createStyle(theme);

  const searchFilterTagsActions = useSearchFilterTagsStore(
    (state) => state.actions,
  );
  const selectedTags = useSearchFilterTagsStore(
    (state) => state.selected,
  );

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterTags = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.tags,
  );

  const disabled = !isDiffBetweenTwoArraysByProperty<ITagSearch>('name', currentFilterTags, selectedTags);

  const onPressSave = () => {
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      tags: selectedTags,
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
    if (currentFilterTags) {
      searchFilterTagsActions.updateSelectedTags(currentFilterTags);
    }
  }, [currentFilterTags]);

  return (
    <View style={styles.container}>
      <Header
        title={t('search:tags')}
        buttonProps={{ disabled, loading: false, style: styles.btnSave }}
        buttonText={t('search:apply')}
        onPressButton={onPressSave}
        onPressBack={onBack}
      />
      <SelectTags />
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

export default SearchFilterTags;
