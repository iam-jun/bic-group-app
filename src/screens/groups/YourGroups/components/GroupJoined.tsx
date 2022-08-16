import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { useDispatch } from 'react-redux';
import Divider from '~/beinComponents/Divider';
import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import GroupJoinedList from '~/screens/groups/YourGroups/components/GroupJoinedList';
import GroupJoinedTree from '~/screens/groups/YourGroups/components/GroupJoinedTree';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';

export interface GroupJoinedProps {
  style?: StyleProp<ViewStyle>;
  communityId: string;
  initModeIndex?: number;
}

const menuType = [
  {
    title: 'communities:group_types:text_tree_view',
    icon: 'Sitemap',
    type: 'tree',
  },
  {
    title: 'communities:group_types:text_flat_list',
    icon: 'ListUl',
    type: 'flat',
  },
];

const GroupJoined: FC<GroupJoinedProps> = ({
  communityId,
  initModeIndex = 0,
}: GroupJoinedProps) => {
  const [selectingMode, setSelectingMode] = useState(menuType[initModeIndex]);

  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const onChangeType = (item: any) => {
    setSelectingMode(item);
    dispatch(modalActions.hideModal());
  };

  const renderItem = (
    item: any, index: number,
  ) => (
    <PrimaryItem
      key={`view_mode_${index}`}
      height={48}
      leftIcon={item.icon as any}
      leftIconProps={{
        icon: item.icon as any,
        size: 20,
        style: {
          marginLeft: spacing.margin.tiny,
          marginRight: spacing.margin.large,
        },
      }}
      titleProps={{ variant: 'h5' }}
      onPress={() => onChangeType(item)}
      title={t(item.title)}
    />
  );

  const onPressShowMenu = () => {
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <Text.H5 style={styles.textHeader}>
            {t('communities:text_choose_view_mode')}
          </Text.H5>
          <Divider />
          {menuType?.map?.(renderItem)}
        </TouchableOpacity>
      ),
    }));
  };

  const renderMenuButton = () => {
    const { icon, title } = selectingMode || {};
    return (
      <TouchableOpacity
        testID="group_joined.btn_mode_view"
        onPress={onPressShowMenu}
        style={styles.menuButton}
      >
        {!!icon && (
          <Icon icon={icon as any} style={{ marginRight: spacing.margin.tiny }} />
        )}
        <Text useI18n>{title}</Text>
        <Icon icon="AngleDown" style={{ marginLeft: spacing.margin.tiny }} />
      </TouchableOpacity>
    );
  };

  return (
    <View testID="group_joined" style={styles.container}>
      <View
        style={{
          zIndex: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: spacing.padding.small,
          paddingHorizontal: spacing.padding.small,
        }}
      >
        <Text.H5
          useI18n
          color={colors.gray50}
          style={{ marginLeft: spacing.margin.small }}
        >
          communities:text_view_mode
        </Text.H5>
        {renderMenuButton()}
      </View>
      {selectingMode?.type === 'tree' ? (
        <GroupJoinedTree communityId={communityId} />
      ) : (
        <GroupJoinedList communityId={communityId} />
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    dataList: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.large,
    },
    textHeader: {
      marginBottom: spacing.margin.base,
      marginLeft: spacing.margin.large,
    },
    menuButton: {
      borderRadius: spacing.borderRadius.small,
      borderColor: colors.neutral5,
      borderWidth: 1,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.tiny,
    },
  });
};

export default GroupJoined;
