import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import useSearchStore from '~/screens/Search/store';
import { useRootNavigation } from '~/hooks/navigation';

type FooterProps = {
    searchScreenKey: string;
};

const Footer: FC<FooterProps> = ({ searchScreenKey }) => {
  const { rootNavigation } = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createStyle(theme, insets);

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const tempFilter = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter,
  );

  const onPressResetAll = () => {
    actionsSearchStore.removeTempFilterByScreenKey(searchScreenKey);
  };

  const onPressConfirm = () => {
    actionsSearchStore.updateSearchDataByScreenKey(searchScreenKey, {
      filter: tempFilter,
    });
    rootNavigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Button.Neutral testID="footer.btn_reset" type="ghost" useI18n onPress={onPressResetAll} style={styles.btn} isEffect>
        search:reset_all
      </Button.Neutral>
      <Button.Primary testID="footer.btn_confirm" type="solid" useI18n onPress={onPressConfirm} style={styles.btn}>
        search:confirm
      </Button.Primary>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.base + insets.bottom,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: colors.white,
    },
    btn: {
      width: 163,
    },
  });
};

export default Footer;
