import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import { postTypeFilter } from './constants';
import { PostType } from '~/interfaces/IPost';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import useModalStore from '~/store/modal';

type FilterPostTypeProps = {
  selectedPostType: PostType;
  onSelect: (postType: PostType) => void;
};

const FilterPostType: FC<FilterPostTypeProps> = ({
  selectedPostType,
  onSelect,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const modalActions = useModalStore((state) => state.actions);

  const onSelectItemFilter = (item: any) => {
    onSelect?.(item.key);
    modalActions.hideModal();
  };

  const renderFilter = () => (
    <>
      {postTypeFilter.map((item) => (
        <Button testID={`btn_post_type_${item.key}`} key={item.key} onPress={() => onSelectItemFilter(item)}>
          <View style={styles.rowItemFilter}>
            <Text.BodyM useI18n color={colors.neutral40}>{item.text}</Text.BodyM>
            {selectedPostType === item.key && (
              <Icon icon="CircleCheckSolid" tintColor={colors.blue50} />
            )}
          </View>
        </Button>
      ))}
    </>
  );

  return (
    <TouchableOpacity testID="filter_post_type" activeOpacity={1} style={styles.container}>
      <Text.H4 style={styles.textHeader}>
        {t('home:newsfeed_search:filter_post_type')}
      </Text.H4>
      {renderFilter()}
    </TouchableOpacity>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    paddingBottom: spacing.padding.extraLarge,
  },
  textHeader: {
    marginTop: spacing.margin.tiny,
    marginBottom: spacing.margin.extraLarge,
    marginHorizontal: spacing.margin.large,
  },
  rowItemFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.margin.extraLarge,
    paddingHorizontal: spacing.padding.large,
  },
});

export default FilterPostType;
