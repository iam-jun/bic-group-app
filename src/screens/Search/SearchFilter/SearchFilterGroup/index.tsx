import React, { FC, useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Keyboard, StyleSheet, View } from 'react-native';
import Header from '~/beinComponents/Header';
import { SelectSingleAudience } from '~/components/SelectAudience';
import useSearchStore from '../../store';
import useSelectAudienceStore from '~/components/SelectAudience/store';
import { spacing } from '~/theme';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import showAlert from '~/store/helper/showAlert';

type SearchFilterGroupProps = {
     route: {
    params: {
     searchScreenKey: string;
    };
}
};

const SearchFilterGroup: FC<SearchFilterGroupProps> = ({ route }) => {
  const { searchScreenKey } = route?.params || {};

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme = useTheme();
  const styles = createStyle(theme);

  const selectAudienceActions = useSelectAudienceStore((state) => state.actions);
  const selectedAudienceIds = useSelectAudienceStore((state) => state.selectedIds?.groupIds || []);
  const selectedAudiences = useSelectAudienceStore((state) => state.selectedAudiences.groups || {});

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterGroup = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.group,
  );

  const disabled = currentFilterGroup?.id === selectedAudienceIds[0];

  const onPressSave = () => {
    const groupSelected = selectedAudiences[selectedAudienceIds[0]];
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      group: groupSelected,
      isSelectAllInnerGroups: !!groupSelected,
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
    if (currentFilterGroup) {
      const selectedGroup = {
        [currentFilterGroup.id]: currentFilterGroup,
      };
      selectAudienceActions.setSelectedAudiences(selectedGroup);
    }
  }, [currentFilterGroup]);

  return (
    <View style={styles.container}>
      <Header
        title={t('search:select_community_group')}
        buttonProps={{ disabled, loading: false, style: styles.btnSave }}
        buttonText={t('search:apply')}
        onPressButton={onPressSave}
        onPressBack={onBack}
      />
      <SelectSingleAudience />
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

export default SearchFilterGroup;
