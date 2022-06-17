import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import TextBadge from '~/beinComponents/Badge/TextBadge';
import Icon from '~/beinComponents/Icon';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';
import {useBaseHook} from '~/hooks';
import groupsActions from '~/screens/Groups/redux/actions';

export interface CommunitySchemeProps {
  style?: StyleProp<ViewStyle>;
}

const CommunityScheme: FC<CommunitySchemeProps> = ({
  style,
}: CommunitySchemeProps) => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const {colors} = theme || {};

  const {
    loading,
    deleting,
    data: communityScheme,
  } = useKeySelector(groupsKeySelector.permission.communityScheme) || {};

  const {name = '', description = ''} = communityScheme || {};
  const {id: communityId} =
    useKeySelector(groupsKeySelector.communityDetail) || {};

  const onPressCreate = () => {
    rootNavigation.navigate(groupStack.createPermissionScheme);
  };

  const onPressEdit = () => {
    console.log(`\x1b[36m🐣️ CommunityScheme onPressEdit\x1b[0m`);
  };

  const onPressDelete = () => {
    dispatch(
      modalActions.showAlert({
        title: t('communities:permission:text_title_delete_community_scheme'),
        content: t('communities:permission:text_desc_delete_community_scheme'),
        showCloseButton: true,
        cancelBtn: true,
        cancelLabel: t('common:btn_cancel'),
        confirmLabel: t('common:btn_delete'),
        onConfirm: () =>
          dispatch(groupsActions.deleteCommunityScheme({communityId})),
      }),
    );
  };

  const renderButtons = () => {
    if (loading) {
      return null;
    }
    if (communityScheme) {
      return (
        <View style={styles.row}>
          <Button style={styles.buttonEdit} onPress={onPressEdit}>
            <Icon size={16} icon={'EditAlt'} />
          </Button>
          <Button style={styles.buttonDelete} onPress={onPressDelete}>
            {deleting ? (
              <LoadingIndicator size={16} />
            ) : (
              <Icon size={16} tintColor={colors.badgeError} icon={'TrashAlt'} />
            )}
          </Button>
        </View>
      );
    }
    return (
      <Button.Primary
        onPress={onPressCreate}
        useI18n
        style={styles.buttonCreate}
        leftIcon={'Plus'}>
        common:btn_create
      </Button.Primary>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.H5 useI18n>communities:permission:title_system_scheme</Text.H5>
          {!loading && communityScheme && (
            <TextBadge useI18n value={'common:text_activated'} />
          )}
        </View>
        <View style={styles.buttonContainer}>{renderButtons()}</View>
      </View>
      <Text.Subtitle useI18n>
        communities:permission:text_desc_system_scheme
      </Text.Subtitle>
      {!!name && (
        <Text.HeadingSB style={styles.textName}>{name}</Text.HeadingSB>
      )}
      {!!description && <Text.Heading>{description}</Text.Heading>}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.background,
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
      backgroundColor: colors.bgHover,
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.tiny,
    },
    buttonDelete: {
      backgroundColor: colors.bgError,
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.tiny,
      marginLeft: spacing.margin.small,
    },
    buttonContainer: {minHeight: 30, justifyContent: 'center'},
  });
};

export default CommunityScheme;
