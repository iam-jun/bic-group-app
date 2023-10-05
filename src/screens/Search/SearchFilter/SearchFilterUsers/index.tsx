import React, { FC, useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Keyboard, StyleSheet, View } from 'react-native';
import Header from '~/beinComponents/Header';
import useSearchStore from '../../store';
import { spacing } from '~/theme';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { isDiffBetweenTwoArraysByProperty } from '~/helpers/common';
import useSearchFilterUsersStore from './store';
import { ISearchUser } from '~/interfaces/ISearch';
import SelectUsers from './components/SelectUsers';
import showAlert from '~/store/helper/showAlert';

type SearchFilterUsersProps = {
  route: {
    params: {
      searchScreenKey: string;
    };
  };
};

const SearchFilterUsers: FC<SearchFilterUsersProps> = ({ route }) => {
  const { searchScreenKey } = route?.params || {};

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme = useTheme();
  const styles = createStyle(theme);

  const searchFilterUsersActions = useSearchFilterUsersStore((state) => state.actions);
  const selectedUsers = useSearchFilterUsersStore(
    (state) => state.selected,
  );

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterUsers = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.createdBy,
  );

  const disabled = !isDiffBetweenTwoArraysByProperty<ISearchUser>('id', selectedUsers, currentFilterUsers);

  const onPressSave = () => {
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      createdBy: selectedUsers,
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
    if (currentFilterUsers) {
      searchFilterUsersActions.updateSelectedUsers(currentFilterUsers);
    }
  }, [currentFilterUsers]);

  return (
    <View style={styles.container}>
      <Header
        title={t('search:select_creator')}
        buttonProps={{ disabled, loading: false, style: styles.btnSave }}
        buttonText={t('search:apply')}
        onPressButton={onPressSave}
        onPressBack={onBack}
      />
      <SelectUsers />
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

export default SearchFilterUsers;
