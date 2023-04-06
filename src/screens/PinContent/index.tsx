import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '~/baseComponents/Text';
import Header from '~/beinComponents/Header';
import usePinContentStore, {
  AudiencePermitPin,
  UpdatePinContentParams,
} from '~/components/PinContent/store';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import showAlert from '~/store/helper/showAlert';
import { spacing } from '~/theme';
import Checkbox from '~/baseComponents/Checkbox';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { isChangedPinAudiences, getGroupIdsBySelectedOrUnselected } from '~/components/PinContent/store/helper';
import showToastSuccess from '~/store/helper/showToastSuccess';

type PinContentProps = {
  route: {
    params: {
      postId: string;
    };
  };
};

const PinContent: FC<PinContentProps> = (props) => {
  const { params } = props.route || {};
  const { postId } = params || {};

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const isLoading = usePinContentStore((state) => state.isLoading);
  const isLoadingPinnableAudiences = usePinContentStore((state) => state.isLoadingPinnableAudiences);
  const pinAudiences = usePinContentStore((state) => state.pinAudiences);
  const prevAudiences = usePinContentStore((state) => state.prevAudiences);

  const actionsPinContentStore = usePinContentStore((state) => state.actions);

  const isChanged = isChangedPinAudiences(pinAudiences, prevAudiences);
  const isDisabledBtnSave = !isChanged;

  const onPinUnpinSuccess = (res) => {
    showToastSuccess(res);
    rootNavigation.goBack();
  };

  const onPinUnpinError = (error) => {
    const errorMessage = error?.meta?.message || '';
    const errorGroupIds: string[] = error?.meta?.errors?.groupsDenied || [];
    const newPinAudiences = { ...pinAudiences };

    errorGroupIds.forEach((errorGroupId) => {
      newPinAudiences[errorGroupId].error = errorMessage;
    });
    actionsPinContentStore.updatePinAudiences(newPinAudiences);
  };

  const onSave = () => {
    const params: UpdatePinContentParams = {
      postId,
      pinGroupIds: getGroupIdsBySelectedOrUnselected(pinAudiences, true),
      unpinGroupIds: getGroupIdsBySelectedOrUnselected(pinAudiences, false),
      onSuccess: onPinUnpinSuccess,
      onError: onPinUnpinError,
    };
    actionsPinContentStore.updatePinContent(params);
  };

  const handleBack = () => {
    if (isChanged) {
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      });
      return;
    }
    rootNavigation.goBack();
  };

  useBackPressListener(handleBack);

  useEffect(() => {
    actionsPinContentStore.getPinnableAudiences(postId);
    return actionsPinContentStore.resetPinAudiences;
  }, []);

  const onChangePin = (audience: AudiencePermitPin) => () => {
    actionsPinContentStore.togglePinAudience(audience.group.id);
  };

  const renderItem = (value: [string, AudiencePermitPin]) => {
    const [id, audience] = value;
    const { group, error } = audience;
    const { isPinned, name } = group;

    return (
      <View key={`pin-audience-item-${id}`} style={styles.itemContainer}>
        <View style={styles.row}>
          <Checkbox isChecked={isPinned} onPress={onChangePin(audience)} />
          <ViewSpacing width={spacing.margin.small} />
          <Text.LabelM style={styles.textGroupName} color={colors.neutral60}>
            {name}
          </Text.LabelM>
        </View>
        {!!error && (
          <Text.BodyS style={styles.textError} color={colors.red40}>
            {error}
          </Text.BodyS>
        )}
      </View>
    );
  };

  const renderLoadingPinnableAudiences = () => (
    <View style={styles.loading}>
      <ActivityIndicator size="small" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="pin:pin_unpin_content"
        buttonProps={{
          disabled: isDisabledBtnSave,
          loading: isLoading,
          style: styles.btnSave,
        }}
        buttonText="common:btn_save"
        onPressButton={onSave}
        onPressBack={handleBack}
      />
      <View style={styles.contentContainer}>
        <Text.BodyM useI18n color={colors.neutral80}>
          pin:pick_group_want_to_pin
        </Text.BodyM>
        <ScrollView style={styles.scrollView} alwaysBounceVertical={false}>
          {isLoadingPinnableAudiences && renderLoadingPinnableAudiences()}
          {Object.entries(pinAudiences).map((value) => renderItem(value))}
          <ViewSpacing height={spacing.padding.large + insets.bottom} />
        </ScrollView>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    contentContainer: {
      flex: 1,
      paddingTop: spacing.padding.large,
      paddingHorizontal: spacing.padding.large,
    },
    scrollView: {
      flex: 1,
    },
    loading: {
      marginTop: spacing.margin.base,
      alignItems: 'center',
    },
    itemContainer: {
      marginTop: spacing.margin.base,
    },
    row: {
      flexDirection: 'row',
    },
    textGroupName: {
      marginTop: spacing.margin.xTiny,
    },
    textError: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default PinContent;
