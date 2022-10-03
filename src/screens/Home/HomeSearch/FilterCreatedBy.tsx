import React, { FC, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { ISelectedFilterUser } from '~/interfaces/IHome';
import FilterCreateBySpecific from '~/screens/Home/HomeSearch/FilterCreateBySpecific';
import modalActions from '~/storeRedux/modal/actions';

import spacing from '~/theme/spacing';
import Tag from '~/baseComponents/Tag';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface NFSFilterCreatedByProps {
  selectedCreatedBy?: any;
  onSelect?: (selected?: ISelectedFilterUser) => void;
}

const FilterCreatedBy: FC<NFSFilterCreatedByProps> = ({
  selectedCreatedBy,
  onSelect,
}: NFSFilterCreatedByProps) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();
  const userId = useUserIdAuth();

  const [staged, setStaged] = useState(0);
  const [selectedCreatedByState, setSelectedCreatedByState]
    = useState(selectedCreatedBy);

  const _onSelect = (selected?: any) => {
    setSelectedCreatedByState(selected);
    setStaged(0);
  };

  const onPressApply = () => {
    onSelect?.(selectedCreatedByState);
    dispatch(modalActions.hideModal());
  };

  const onBack = () => {
    setStaged(0);
  };

  const renderSpecificRightComponent = () => (
    <View style={styles.specificRightView}>
      <Button.Secondary
        disabled={
          selectedCreatedByState && selectedCreatedByState.id !== userId
        }
        onPress={() => setStaged(1)}
        type="ghost"
      >
        {t('common:text_select')}
      </Button.Secondary>
    </View>
  );

  const renderTagSpecificPerson = () => {
    if (!selectedCreatedByState || selectedCreatedByState.id === userId) {
      return null;
    }

    return (
      <View style={styles.tagContainer}>
        <Tag
          style={styles.tag}
          type="secondary"
          size="small"
          label={selectedCreatedByState.name}
          onActionPress={() => setStaged(1)}
          icon="Xmark"
          onPressIcon={() => setSelectedCreatedByState(undefined)}
          textProps={{ numberOfLines: 1 }}
        />
      </View>
    );
  };

  if (staged === 1) {
    return <FilterCreateBySpecific onSelect={_onSelect} onBack={onBack} />;
  }

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <Text.H4 style={styles.textHeader}>
        {t('home:newsfeed_search:filter_post_by')}
      </Text.H4>
      <Button onPress={() => _onSelect()}>
        <View style={styles.rowItemFilter}>
          <Text.BodyMMedium useI18n>
            home:newsfeed_search:filter_created_by_all
          </Text.BodyMMedium>
          {!selectedCreatedByState && (
            <Icon icon="CircleCheckSolid" tintColor={colors.blue50} />
          )}
        </View>
      </Button>
      <Button onPress={() => _onSelect({ id: userId, name: '' })}>
        <View style={styles.rowItemFilter}>
          <Text.BodyMMedium useI18n>
            home:newsfeed_search:filter_created_by_me
          </Text.BodyMMedium>
          {selectedCreatedByState?.id === userId && (
            <Icon icon="CircleCheckSolid" tintColor={colors.blue50} />
          )}
        </View>
      </Button>
      <View style={[styles.rowItemFilter, { marginBottom: 0 }]}>
        <Text.BodyMMedium useI18n>
          home:newsfeed_search:filter_created_by_specific
        </Text.BodyMMedium>
        {renderSpecificRightComponent()}
      </View>
      {renderTagSpecificPerson()}
      <ViewSpacing height={spacing.margin.extraLarge} />
      <Button.Secondary onPress={onPressApply} style={styles.buttonApply}>
        {t('home:newsfeed_search:apply')}
      </Button.Secondary>
    </TouchableOpacity>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    paddingBottom: spacing.padding.extraLarge,
  },
  itemContainer: {
    paddingHorizontal: spacing.padding.extraLarge,
  },
  textHeader: {
    marginTop: spacing.margin.tiny,
    marginBottom: spacing.margin.large,
    marginHorizontal: spacing.margin.large,
  },
  buttonSpecificRight: {
    marginLeft: spacing.margin.tiny,
  },
  rowItemFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.margin.extraLarge,
    paddingHorizontal: spacing.padding.large,
    flex: 1,
  },
  buttonApply: {
    marginHorizontal: spacing.margin.extraLarge,
    marginVertical: spacing.margin.small,
  },
  tagContainer: {
    marginHorizontal: spacing.margin.large,
    marginTop: spacing.margin.small,
    flex: 1,
    alignItems: 'flex-start',
  },
  tag: {
    paddingLeft: spacing.padding.xSmall,
  },
  specificRightView: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default FilterCreatedBy;
