import React, {FC, useContext, useRef} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Button from '~/beinComponents/Button';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import {useDispatch} from 'react-redux';
import homeActions from '~/screens/Home/redux/actions';
import * as modalActions from '~/store/modal/actions';
import NFSFilterCreatedBy from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterCreatedBy';
import {useUserIdAuth} from '~/hooks/auth';
import NFSFilterDate from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterDate';
import {AppContext} from '~/contexts/AppContext';
import {formatDateTime} from '~/beinComponents/TimeView';
import {ISelectedFilterUser} from '~/interfaces/IHome';
import NFSFilterOptionMenu from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterOptionMenu';

const NFSFilterToolbar = () => {
  const scrollRef = useRef<any>();
  const dispatch = useDispatch();
  const {language} = useContext(AppContext);
  const theme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const {colors, spacing} = theme;
  const styles = createStyle(theme);
  const userId = useUserIdAuth();

  const filterCreatedBy = useKeySelector(
    homeKeySelector.newsfeedSearchFilterCreatedBy,
  );
  const filterDate = useKeySelector(homeKeySelector.newsfeedSearchFilterDate);
  const {startDate, endDate} = filterDate || {};

  let countFilter = 0;
  if (filterCreatedBy) {
    countFilter++;
  }
  if (filterDate) {
    countFilter++;
  }

  const textCreatedBy = filterCreatedBy
    ? filterCreatedBy?.id === userId
      ? t('home:newsfeed_search:filter_created_by_me')
      : `${filterCreatedBy?.name}`
    : t('home:newsfeed_search:filter_created_by');
  const textDate = filterDate
    ? `${formatDateTime(startDate, language)} - ${formatDateTime(
        endDate,
        language,
      )}`
    : t('home:newsfeed_search:filter_date');

  const showModal = (ContentComponent: any, event?: any) => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: ContentComponent,
        props: {
          isContextMenu: true,
          side: 'right',
          position: {x: event?.pageX, y: event?.pageY},
        },
      }),
    );
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

  const onSelectDate = (startDate?: string, endDate?: string) => {
    if (startDate && endDate) {
      dispatch(
        homeActions.setNewsfeedSearchFilter({date: {startDate, endDate}}),
      );
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
    dispatch(homeActions.setNewsfeedSearchFilter({createdBy: selected}));
  };

  const onPressClear = () => {
    dispatch(homeActions.clearNewsfeedSearchFilter());
    scrollRef?.current?.scrollTo?.({y: 0, animated: true});
  };

  return (
    <View>
      <ScrollView ref={scrollRef} style={styles.scrollContainer} horizontal>
        <View style={styles.container}>
          <Button.Secondary
            onPress={onPressFilterOptions}
            leftIcon={'SlidersUp'}
            leftIconProps={{
              icon: 'SlidersUp',
              style: {
                marginRight: spacing.margin.small,
                marginLeft: spacing.margin.tiny,
              },
            }}
            color={countFilter > 0 ? colors.primary6 : colors.primary1}
            textColor={countFilter > 0 ? colors.background : colors.primary6}>
            {countFilter > 0
              ? `${countFilter}`
              : t('home:newsfeed_search:filter')}
          </Button.Secondary>
          <Button.Secondary
            onPress={onPressFilterCreatedBy}
            style={styles.button}
            color={filterCreatedBy ? colors.primary3 : colors.primary1}
            textColor={colors.primary6}>
            {textCreatedBy}
          </Button.Secondary>
          <Button.Secondary
            onPress={onPressFilterDate}
            style={styles.button}
            color={filterDate ? colors.primary3 : colors.primary1}
            textColor={colors.primary6}>
            {textDate}
          </Button.Secondary>
          {countFilter > 0 && (
            <Button.Secondary
              style={styles.button}
              textColor={colors.primary6}
              onPress={onPressClear}
              rightIcon={'iconCloseSmall'}
              rightIconProps={{
                icon: 'iconCloseSmall',
                style: {marginRight: 0, marginLeft: spacing.margin.base},
              }}>
              {t('home:newsfeed_search:clear')}
            </Button.Secondary>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    scrollContainer: {
      backgroundColor: colors.background,
    },
    container: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.base,
      borderBottomWidth: 1,
      borderColor: colors.bgSecondary,
    },
    button: {
      marginLeft: spacing.margin.tiny,
    },
  });
};

export default NFSFilterToolbar;
