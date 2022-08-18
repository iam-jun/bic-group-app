import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import TextBadge from '~/beinComponents/Badge/TextBadge';
import Icon from '~/beinComponents/Icon';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import groupsActions from '~/storeRedux/groups/actions';
import spacing from '~/theme/spacing';

export interface CommunitySchemeProps {
  style?: StyleProp<ViewStyle>;
}

const CommunityScheme: FC<CommunitySchemeProps> = ({
  style,
}: CommunitySchemeProps) => {
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme || {};

  const {
    loading,
    deleting,
    data: communityScheme,
  } = useKeySelector(groupsKeySelector.permission.communityScheme) || {};

  const { name = '', description = '' } = communityScheme || {};
  const { id: communityId } = useKeySelector(groupsKeySelector.communityDetail) || {};

  const onPressEdit = () => {
    rootNavigation.navigate(
      groupStack.createPermissionScheme, {
        isEdit: true,
        initScheme: communityScheme,
      },
    );
  };

  const onPressDelete = () => {
    dispatch(modalActions.showAlert({
      title: t('communities:permission:text_title_delete_community_scheme'),
      content: t('communities:permission:text_desc_delete_community_scheme'),
      cancelBtn: true,
      cancelLabel: t('common:btn_cancel'),
      confirmLabel: t('common:btn_delete'),
      onConfirm: () => dispatch(groupsActions.deleteCommunityScheme({ communityId })),
    }));
  };

  const renderButtons = () => {
    if (loading) {
      return null;
    }
    if (communityScheme) {
      return (
        <View style={styles.row}>
          <Button style={styles.buttonEdit} onPress={onPressEdit}>
            <Icon size={16} icon="PenLine" />
          </Button>
          <Button style={styles.buttonDelete} onPress={onPressDelete}>
            {deleting ? (
              <LoadingIndicator size={16} />
            ) : (
              <Icon size={16} tintColor={colors.red40} icon="TrashCan" />
            )}
          </Button>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.H5 style={styles.flex1} useI18n>
            communities:permission:title_community_scheme
          </Text.H5>
          {!loading && communityScheme && (
            <TextBadge
              useI18n
              value="common:text_activated"
              style={styles.activatedText}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>{renderButtons()}</View>
      </View>
      <View style={styles.descScheme}>
        <Text.BodyS useI18n>
          communities:permission:text_desc_community_scheme
        </Text.BodyS>
      </View>
      {!!name && (
        <Text.BodySMedium style={styles.textName}>{name}</Text.BodySMedium>
      )}
      {!!description && <Text.BodyS>{description}</Text.BodyS>}
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
      alignItems: 'flex-start',
    },
    titleContainer: {
      flexDirection: 'row',
      marginBottom: spacing.margin.small,
    },
    buttonCreate: {
      paddingLeft: 0,
      paddingRight: spacing.padding.base,
      paddingVertical: spacing.padding.tiny,
    },
    textName: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.tiny,
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
    buttonContainer: { minHeight: 30, justifyContent: 'center' },
    activatedText: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.small,
    },
    descScheme: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default CommunityScheme;
