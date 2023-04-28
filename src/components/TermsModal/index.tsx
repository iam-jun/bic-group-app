import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Keyboard, NativeScrollEvent, LayoutChangeEvent, Platform,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  FadeInDown, FadeOutUp,
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import useTermStore from './store';
import { Button } from '~/baseComponents';
import Markdown from '~/beinComponents/Markdown';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import useCommunityController from '~/screens/communities/store';
import IDiscoverGroupsState from '~/screens/groups/DiscoverGroups/store/Interface';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import Divider from '~/beinComponents/Divider';
import useModalStore from '~/store/modal';
import useBaseHook from '~/hooks/baseHook';
import useMemberQuestionsStore from '../MemberQuestionsModal/store';

const TermsView = () => {
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  const { t } = useBaseHook();

  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [layoutHeight, setLayoutHeight] = useState<number>(0);

  const actions = useTermStore((state) => state.actions);
  const content = useTermStore((state) => state.termContent);
  const loading = useTermStore((state) => state.loading);
  const errorText = useTermStore((state) => state.errorText);
  const type = useTermStore((state) => state.type);
  const groupId = useTermStore((state) => state.groupId);
  const rootGroupId = useTermStore((state) => state.rootGroupId);
  const name = useTermStore((state) => state.name);
  const isActiveGroupTerms = useTermStore((state) => state.isActiveGroupTerms);
  const isOpen = useTermStore((state) => state.isOpen);
  const answers = useTermStore((state) => state.answers);

  const resetTerms = useTermStore((state) => state.reset);

  const modalActions = useModalStore((state) => state.actions);

  const comActions = useCommunityController((state) => state.actions);
  const groupActions = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.actions);

  const memberQuestionsActions = useMemberQuestionsStore((state) => state.actions);

  const [isAgree, setIsAgree] = useState(false);

  useEffect(() => {
    if (isActiveGroupTerms && rootGroupId) {
      actions.getTerms(rootGroupId, handleError);
    }
  }, [isActiveGroupTerms, rootGroupId]);

  const handleError = () => {
    modalActions.showAlert({
      cancelBtn: false,
      confirmLabel: t('common:text_ok'),
      title: t('common:text_sorry_something_went_wrong'),
      content: t('common:text_pull_to_refresh'),
    });
  };

  useEffect(() => {
    if (!isOpen) {
      resetTerms();
      setIsAgree(false);
      setContainerHeight(0);
      setLayoutHeight(0);
    } else {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  useEffect(() => {
    if (containerHeight > 0 && layoutHeight > containerHeight
      && !isAgree && !loading && !errorText) {
      setIsAgree(true);
    }
  }, [containerHeight, layoutHeight, isAgree, loading, errorText]);

  const onClose = () => {
    actions.setIsOpen(false);
  };

  const onSubmit = () => {
    if (type === 'community') {
      comActions.joinCommunity({
        communityId: groupId,
        communityName: name,
        membershipAnswers: answers,
      });
    } else {
      groupActions.joinNewGroup(groupId, answers);
    }
    actions.setIsOpen(false);
    memberQuestionsActions.setIsOpen(false);
  };

  const handleLayout = (e:LayoutChangeEvent) => {
    const height = e?.nativeEvent?.layout?.height || 0;
    if (layoutHeight < height) {
      setLayoutHeight(height);
    }
  };

  const handleContentSizeChange = (_width: number, height: number) => {
    if (containerHeight < height) {
      setContainerHeight(height);
    }
  };

  const onScroll = (event: {nativeEvent: NativeScrollEvent}) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingBottom = Platform.OS === 'ios' ? 0 : spacing.padding.large * 2;
    const isScrollEnd = (layoutMeasurement.height + contentOffset.y + paddingBottom) >= contentSize.height;
    if (isScrollEnd && !isAgree && !loading && !errorText) {
      setIsAgree(true);
    }
  };

  if (!isOpen) return null;

  return (
    <Animated.View
      testID="terms_view"
      style={styles.screenContainer}
      entering={FadeInDown}
      exiting={FadeOutUp}
    >
      <View style={styles.screenContainer}>
        <Header
          title={`common:text_${type}_terms`}
          titleTextProps={{ useI18n: true }}
          onPressBack={onClose}
        />
        <Divider size={spacing.margin.small} />
        <View style={styles.body}>
          {!!content && !loading
            ? (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.contentContainerStyle}
                  scrollEventThrottle={16}
                  onContentSizeChange={handleContentSizeChange}
                  onScroll={onScroll}
                  onLayout={handleLayout}
                >
                  <Markdown
                    value={content}
                  />
                </ScrollView>
                <View
                  style={[styles.buttonView, styles.shadow]}
                  testID="join_cancel_button"
                >
                  <Button.Primary
                    testID="terms_view.sumbit"
                    useI18n
                    disabled={!isAgree}
                    onPress={onSubmit}
                  >
                    common:text_i_agree
                  </Button.Primary>
                </View>
              </>
            )
            : (
              <View style={styles.center}>
                <LoadingIndicator />
              </View>
            )}
        </View>
      </View>
    </Animated.View>
  );
};

const createStyles = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;

  return StyleSheet.create({
    screenContainer: {
      zIndex: 100,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
    },
    body: {
      flex: 1,
    },
    buttonsContainer: {
      flex: 1,
      width: '100%',
      maxWidth: 271,
      marginTop: spacing.margin.extraLarge,
    },
    button: {
      marginVertical: spacing.margin.tiny,
    },
    buttonView: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.large + insets.bottom,
      paddingTop: spacing.padding.large,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 12,
      },
      shadowOpacity: 0.5,
      shadowRadius: 10.32,
      elevation: 12,
    },
    checkbox: {
      marginTop: spacing.margin.large,
    },
    contentContainerStyle: {
      padding: spacing.padding.large,
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  });
};

export default TermsView;
