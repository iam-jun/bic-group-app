import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useContext, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useDispatch } from 'react-redux';
import Button from '~/beinComponents/Button';
import { formatDateTime } from '~/beinComponents/TimeView/helper';
import { AppContext } from '~/contexts/AppContext';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useKeySelector } from '~/hooks/selector';
import { ISelectedFilterUser } from '~/interfaces/IHome';
import NFSFilterCreatedBy from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterCreatedBy';
import NFSFilterDate from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterDate';
import NFSFilterOptionMenu from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterOptionMenu';
import homeActions from '~/screens/Home/redux/actions';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import * as modalActions from '~/store/modal/actions';
import spacing from '~/theme/spacing';

const NFSFilterToolbar = () => {
  const scrollRef = useRef<any>();
  const dispatch = useDispatch();
  const { language } = useContext(AppContext);
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const { colors } = theme;
  const styles = createStyle(theme);
  const userId = useUserIdAuth();

  const filterCreatedBy = useKeySelector(homeKeySelector.newsfeedSearchFilterCreatedBy);
  const filterDate = useKeySelector(homeKeySelector.newsfeedSearchFilterDate);
  const { startDate, endDate } = filterDate || {};

  let countFilter = 0;
  if (filterCreatedBy) {
    countFilter += 1;
  }
  if (filterDate) {
    countFilter += 1;
  }

  const textCreatedBy = filterCreatedBy
    ? filterCreatedBy?.id === userId
      ? t('home:newsfeed_search:filter_created_by_me')
      : `${filterCreatedBy?.name}`
    : t('home:newsfeed_search:filter_created_by');
  const textDate = filterDate
    ? `${formatDateTime(
      startDate, language,
    )} - ${formatDateTime(
      endDate,
      language,
    )}`
    : t('home:newsfeed_search:filter_date');

  const showModal = (
    ContentComponent: any, event?: any,
  ) => {
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent,
      props: {
        isContextMenu: true,
        side: 'right',
        position: { x: event?.pageX, y: event?.pageY },
      },
    }));
  };

  const onPressFilterCreatedBy = (event?: any) => {
    showModal(
      <NFSFilterCreatedBy
        selectedCreatedBy={filterCreatedBy}
        onSelect={onSelectCreatedBy}
        dismissModalOnPress
      />,
      event,
    );
  };

  const onSelectDate = (
    startDate?: string, endDate?: string,
  ) => {
    if (startDate && endDate) {
      dispatch(homeActions.setNewsfeedSearchFilter({ date: { startDate, endDate } }));
    }
  };

  const onPressFilterDate = (event?: any) => {
    showModal(
      <NFSFilterDate
        startDate={startDate}
        endDate={endDate}
        onSelect={onSelectDate}
        dismissModalOnPress
      />,
      event,
    );
  };

  const onPressFilterOptions = (event?: any) => {
    showModal(
      <NFSFilterOptionMenu
        filterCreatedBy={filterCreatedBy}
        filterDate={filterDate}
      />,
      event,
    );
  };

  const onSelectCreatedBy = (selected?: ISelectedFilterUser) => {
    dispatch(homeActions.setNewsfeedSearchFilter({ createdBy: selected }));
  };

  const onPressClear = () => {
    dispatch(homeActions.clearNewsfeedSearchFilter());
    scrollRef?.current?.scrollTo?.({ y: 0, animated: true });
  };

  return (
    <View>
      <ScrollView ref={scrollRef} style={styles.scrollContainer} horizontal>
        <View style={styles.container}>
          <Button.Secondary
            onPress={onPressFilterOptions}
            leftIcon="SlidersUp"
            leftIconProps={{
              icon: 'SlidersUp',
              style: {
                marginRight: spacing.margin.small,
                marginLeft: spacing.margin.tiny,
              },
            }}
            color={countFilter > 0 ? colors.purple50 : colors.violet1}
            textColor={countFilter > 0 ? colors.white : colors.purple50}
          >
            {countFilter > 0
              ? `${countFilter}`
              : t('home:newsfeed_search:filter')}
          </Button.Secondary>
          <Button.Secondary
            onPress={onPressFilterCreatedBy}
            style={styles.button}
            color={filterCreatedBy ? colors.purple10 : colors.violet1}
            textColor={colors.purple50}
          >
            {textCreatedBy}
          </Button.Secondary>
          <Button.Secondary
            onPress={onPressFilterDate}
            style={styles.button}
            color={filterDate ? colors.purple10 : colors.violet1}
            textColor={colors.purple50}
          >
            {textDate}
          </Button.Secondary>
          {countFilter > 0 && (
            <Button.Secondary
              style={styles.button}
              textColor={colors.purple50}
              onPress={onPressClear}
              rightIcon="iconCloseSmall"
              rightIconProps={{
                icon: 'iconCloseSmall',
                style: { marginRight: 0, marginLeft: spacing.margin.base },
              }}
            >
              {t('home:newsfeed_search:clear')}
            </Button.Secondary>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    scrollContainer: {
      backgroundColor: colors.white,
    },
    container: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.base,
      borderBottomWidth: 1,
      borderColor: colors.neutral1,
    },
    button: {
      marginLeft: spacing.margin.tiny,
    },
  });
};

export default NFSFilterToolbar;
