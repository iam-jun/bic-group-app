import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TabMenu from '~/beinComponents/Tab';

import {ITheme} from '~/theme/interfaces';
import GroupInfoHeader from './components/GroupInfoHeader';
import GroupTopBar from './components/GroupTopBar';
import groupProfileTabs from './GroupProfileTabs';

const GroupDetail = (props: any) => {
  const params = props.route.params;

  const theme: ITheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.screenContainer}>
      <GroupTopBar />
      <ScrollView>
        <GroupInfoHeader {...params} />
        <TabMenu
          data={groupProfileTabs}
          menuInactiveTintColor={theme.colors.textSecondary}
        />
      </ScrollView>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;
  return StyleSheet.create({
    screenContainer: {
      paddingTop: insets.top,
      flex: 1,
      backgroundColor: colors.background,
    },
  });
};

export default GroupDetail;
