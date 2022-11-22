import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import Button from '~/beinComponents/Button';
import SchemeItem from './SchemeItem';
import { IGroupScheme } from '~/interfaces/IGroup';
import Divider from '~/beinComponents/Divider';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';
import usePermissionSchemeStore from '../store';

export interface GroupSchemeProps {
  style?: StyleProp<ViewStyle>;
  communityId: string;
}

const GroupScheme: FC<GroupSchemeProps> = ({ communityId }) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { data } = usePermissionSchemeStore((state) => state.schemes) || {};
  const { groupSchemes } = data || {};

  const onPressAssign = () => {
    rootNavigation.navigate(groupStack.groupSchemeAssignment, { communityId });
  };

  const renderItem = (
    { item }: {item: IGroupScheme},
  ) => <SchemeItem communityId={communityId} item={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.H5 useI18n>communities:permission:title_group_scheme</Text.H5>
          {groupSchemes?.length > 0 && (
            <Text.H5>{` (${groupSchemes.length})`}</Text.H5>
          )}
        </View>
        {groupSchemes?.length > 0 && (
          <View style={styles.buttonContainer}>
            <Button.Primary
              onPress={onPressAssign}
              useI18n
              style={styles.buttonAssign}
            >
              communities:permission:btn_assign
            </Button.Primary>
          </View>
        )}
      </View>

      <View style={styles.descScheme}>
        <Text.BodyS useI18n>
          communities:permission:text_desc_group_scheme
        </Text.BodyS>
      </View>

      {groupSchemes?.length > 0 && (
        <FlatList
          data={groupSchemes}
          renderItem={renderItem}
          style={styles.groupSchemeList}
          scrollEnabled={false}
          keyExtractor={(
            item, index,
          ) => `group_scheme_item_${item.id}_${index}`}
          ItemSeparatorComponent={() => (
            <>
              <Divider />
              <ViewSpacing height={8} />
            </>
          )}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.white,
      marginTop: spacing.margin.base,
      borderRadius: spacing.borderRadius.small,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.small,
    },
    buttonAssign: {
      paddingRight: spacing.padding.base,
      paddingVertical: spacing.padding.tiny,
    },
    buttonContainer: {
      minHeight: 30,
      justifyContent: 'center',
      flexDirection: 'row',
    },
    groupSchemeList: {
      marginTop: spacing.margin.large,
    },
    descScheme: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default GroupScheme;
