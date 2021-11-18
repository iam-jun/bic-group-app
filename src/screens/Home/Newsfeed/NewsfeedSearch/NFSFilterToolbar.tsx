import React, {FC} from 'react';
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

export interface NewsfeedSearchFilterToolbarProps {
  style?: StyleProp<ViewStyle>;
}

const NFSFilterToolbar: FC<NewsfeedSearchFilterToolbarProps> = ({
  style,
}: NewsfeedSearchFilterToolbarProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const {colors, spacing} = theme;
  const styles = createStyle(theme);
  const userId = useUserIdAuth();

  const filterCreatedBy = useKeySelector(
    homeKeySelector.newsfeedSearchFilterCreatedBy,
  );
  const filterDate = useKeySelector(homeKeySelector.newsfeedSearchFilterDate);

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
      : filterCreatedBy
    : t('home:newsfeed_search:filter_created_by');
  const textDate = filterDate
    ? filterDate
    : t('home:newsfeed_search:filter_date');

  const onPressFilterCreatedBy = (event?: any) => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: (
          <NFSFilterCreatedBy
            selectedCreatedBy={filterCreatedBy}
            onSelect={onSelectCreatedBy}
          />
        ),
        props: {
          webModalStyle: {minHeight: undefined},
          isContextMenu: true,
          side: 'right',
          position: {x: event?.pageX, y: event?.pageY},
        },
      }),
    );
  };

  const onSelectCreatedBy = (selected?: any) => {
    dispatch(homeActions.setNewsfeedSearchFilter({createdBy: selected}));
  };

  const onPressClear = () => {
    dispatch(homeActions.clearNewsfeedSearchFilter());
  };

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollContainer} horizontal>
        <View style={styles.container}>
          <Button.Secondary
            leftIcon={'SlidersAlt'}
            leftIconProps={{
              icon: 'SlidersAlt',
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
      flex: 1,
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
