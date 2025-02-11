import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isEmpty } from 'lodash';
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
import {
  isChangedPinAudiences,
  getGroupIdsBySelectedOrUnselected,
} from '~/components/PinContent/store/helper';
import showToastSuccess from '~/store/helper/showToastSuccess';
import Image from '~/components/Image';
import images from '~/resources/images';

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
  const isLoadingPinnableAudiences = usePinContentStore(
    (state) => state.isLoadingPinnableAudiences,
  );
  const canLoadMorePinnableAudiences = usePinContentStore(
    (state) => state.canLoadMorePinnableAudiences,
  );
  const pinAudiences = usePinContentStore((state) => state.pinAudiences);
  const prevAudiences = usePinContentStore((state) => state.prevAudiences);

  const actionsPinContentStore = usePinContentStore((state) => state.actions);

  const isChanged = isChangedPinAudiences(pinAudiences, prevAudiences);
  const isDisabledBtnSave = !isChanged;

  const isEmptyPinnableAudiences
    = !isLoadingPinnableAudiences
    && !canLoadMorePinnableAudiences
    && isEmpty(pinAudiences);

  const canPin = !isLoadingPinnableAudiences && !isEmpty(pinAudiences);

  const isPinnedAll = Object.values(pinAudiences).every(({ group }) => group.isPinned);

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

  const onPinOrUnpinAll = (isPinned: boolean) => () => {
    actionsPinContentStore.pinOrUnpinAllPinAudience(isPinned);
  };

  const renderPinOrUnpinAll = () => (
    <View
      testID="pin_content.pin_or_unpin_all_audience_container"
      style={styles.pinUnpinAllContainer}
    >
      <View style={styles.row}>
        <Checkbox
          testID="pin_content.pin_or_unpin_all_audience_checkbox"
          isChecked={isPinnedAll}
          onPress={onPinOrUnpinAll(!isPinnedAll)}
        />
        <ViewSpacing width={spacing.margin.small} />
        <Text.LabelM style={styles.textGroupName} color={colors.neutral60} useI18n>
          pin:check_all
        </Text.LabelM>
      </View>
    </View>
  );

  const renderItem = (value: [string, AudiencePermitPin]) => {
    const [id, audience] = value;
    const { group, error } = audience;
    const { isPinned, name } = group;

    return (
      <View
        testID="pin_content.pin_audience_item"
        key={`pin-audience-item-${id}`}
        style={styles.itemContainer}
      >
        <View style={styles.row}>
          <Checkbox
            testID={`pin_content.pin_audience_item_${id}`}
            isChecked={isPinned}
            onPress={onChangePin(audience)}
          />
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
    <View testID="pin_content.loading" style={styles.loading}>
      <ActivityIndicator size="small" />
    </View>
  );

  const renderEmptyPinnableAudiences = () => (
    <View testID="pin_content.empty" style={styles.boxEmpty}>
      <Image
        resizeMode="contain"
        source={images.img_empty_box}
        style={styles.imgEmpty}
      />
      <Text.BodyS color={colors.neutral40} useI18n>
        pin:there_is_no_groups
      </Text.BodyS>
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
        onPressButton={canPin && onSave}
        onPressBack={handleBack}
      />
      <View style={styles.contentContainer}>
        {canPin && (
          <Text.BodyM useI18n color={colors.neutral80}>
            pin:pick_group_want_to_pin
          </Text.BodyM>
        )}
        <ScrollView style={styles.scrollView} alwaysBounceVertical={false}>
          {isLoadingPinnableAudiences && renderLoadingPinnableAudiences()}
          {isEmptyPinnableAudiences && renderEmptyPinnableAudiences()}
          {Object.keys(pinAudiences).length > 1 && renderPinOrUnpinAll()}
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
    pinUnpinAllContainer: {
      marginTop: spacing.margin.base,
      paddingBottom: spacing.margin.base,
      borderBottomColor: colors.neutral5,
      borderBottomWidth: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textGroupName: {
      marginTop: spacing.margin.xTiny,
    },
    textError: {
      marginTop: spacing.margin.tiny,
    },
    boxEmpty: {
      alignItems: 'center',
      marginTop: spacing.margin.base,
      paddingVertical: 32,
    },
    imgEmpty: {
      width: 100,
      aspectRatio: 1,
      marginBottom: spacing.margin.large,
    },
  });
};

export default PinContent;
