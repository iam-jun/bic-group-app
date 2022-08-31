import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';

import TextBadge from '~/beinComponents/Badge/TextBadge';
import Button from '~/beinComponents/Button';
import Icon from '~/baseComponents/Icon';
import modalActions from '~/storeRedux/modal/actions';
import { IApplyingGroups, IGroupScheme } from '~/interfaces/IGroup';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';

interface SchemeItemProps {
  item: IGroupScheme;
}

const SchemeItem = ({ item }: SchemeItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const { name, description, applyingGroups } = item;
  const isActivated = applyingGroups?.length > 0;

  const onPressEdit = () => {
    rootNavigation.navigate(
      groupStack.createPermissionScheme, {
        isEdit: true,
        initScheme: item,
        schemeId: item.id,
      },
    );
  };

  const onPressDelete = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const renderButtons = () => (
    <View style={styles.row}>
      <Button
        style={styles.buttonEdit}
        onPress={onPressEdit}
        testID="scheme_item.btn_edit"
      >
        <Icon size={16} icon="PenLine" />
      </Button>
      <Button
        style={styles.buttonDelete}
        onPress={onPressDelete}
        testID="scheme_item.btn_delete"
      >
        <Icon size={16} tintColor={colors.red40} icon="TrashCan" />
      </Button>
    </View>
  );

  const renderItem = (item: IApplyingGroups) => (
    <View key={item.id} style={styles.nameTag} testID="scheme_item.group_tag">
      <Text.BodyS>{item.name}</Text.BodyS>
    </View>
  );

  return (
    <View>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.BodySMedium
            numberOfLines={3}
            style={styles.flex1}
            testID="scheme_item.name"
          >
            {name}
          </Text.BodySMedium>
          {isActivated && (
            <TextBadge
              useI18n
              value="common:text_activated"
              style={styles.activatedText}
            />
          )}
        </View>
        {renderButtons()}
      </View>
      {!!description && (
        <Text.BodyS style={styles.textDesc}>{description}</Text.BodyS>
      )}
      {applyingGroups?.length > 0 && (
        <View testID="scheme_item.group_list" style={styles.groupListView}>
          {applyingGroups?.map?.(renderItem)}
        </View>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    titleContainer: {
      flexDirection: 'row',
      marginBottom: spacing.margin.small,
      // alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    buttonEdit: {
      backgroundColor: colors.gray5,
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.small,
    },
    buttonDelete: {
      backgroundColor: colors.red1,
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.small,
      marginLeft: spacing.margin.small,
    },
    activatedText: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.small,
    },
    nameTag: {
      backgroundColor: colors.gray5,
      borderRadius: 50,
      alignItems: 'center',
      paddingVertical: 2,
      paddingHorizontal: spacing.padding.tiny,
      alignSelf: 'baseline',
      marginRight: spacing.margin.tiny,
      marginBottom: spacing.margin.small,
    },
    groupListView: {
      marginBottom: spacing.margin.tiny,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    textDesc: {
      marginBottom: spacing.margin.small,
    },
  });
};

export default SchemeItem;
