import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Text from '~/beinComponents/Text';

import {ExtendedTheme, useTheme} from '@react-navigation/native';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Tag from '~/beinComponents/Tag';
import {IAudience} from '~/interfaces/IPost';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';

export interface SelectingAudiencesProps {
  list: IAudience[];
  onRemoveItem: (item: IAudience) => void;
}

const SelectingAudiences: React.FC<SelectingAudiencesProps> = ({
  list,
  onRemoveItem,
}: SelectingAudiencesProps) => {
  const [showAll, setShowAll] = useState(false);
  const [showBtnShowAll, setShowBtnShowAll] = useState(false);
  const [containerWidth, setContainerWidth] = useState();
  const [audiencesWidth, setAudiencesWidth] = useState();

  useEffect(() => {
    if (audiencesWidth && containerWidth) {
      if (audiencesWidth > containerWidth) {
        setShowBtnShowAll(true);
      } else {
        setShowAll(false);
        setShowBtnShowAll(false);
      }
    }
  }, [audiencesWidth, containerWidth]);

  useEffect(() => {
    if (!list || list?.length === 0) {
      setShowAll(false);
      setShowBtnShowAll(false);
    }
  }, [list]);

  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const styles = createStyle(theme);

  const onPressShowAll = () => {
    setShowAll(!showAll);
  };

  const onPressRemoveItem = (item: IAudience) => {
    onRemoveItem?.(item);
  };

  const onLayoutContainer = (e: any) => {
    const {width} = e?.nativeEvent?.layout || {};
    setContainerWidth(width);
  };

  const onLayoutAudiences = (e: any) => {
    const {width} = e?.nativeEvent?.layout || {};
    setAudiencesWidth(width);
  };

  const renderItem = (item: any, index: number) => {
    const {name, icon, avatar} = item;
    return (
      <Tag
        style={styles.item}
        key={'tag_' + index}
        avatar={icon || avatar}
        label={name}
        onPressIcon={() => onPressRemoveItem(item)}
      />
    );
  };

  if (!list || list?.length === 0) {
    return null;
  }

  return (
    <View
      testID={'selecting_audience.container'}
      style={styles.container}
      onLayout={onLayoutContainer}>
      <View style={styles.headerContainer}>
        <Text.H6 style={{flex: 1}}>Chosen Audiences</Text.H6>
        {showBtnShowAll && (
          <ButtonWrapper
            textProps={{color: colors.purple60, variant: 'buttonS'}}
            onPress={onPressShowAll}
            testID="selecting_audiences.show">
            {showAll ? 'Show less' : `Show all(${list?.length})`}
          </ButtonWrapper>
        )}
      </View>
      <View>
        <ScrollView
          style={showAll ? {position: 'absolute'} : {}}
          horizontal
          scrollEnabled={false}>
          <View
            onLayout={onLayoutAudiences}
            testID="selecting_audiences"
            style={styles.contentContainer}>
            {list?.map?.(renderItem)}
          </View>
        </ScrollView>
        {showAll && (
          <View
            testID="selecting_audiences_all"
            style={styles.contentContainer}>
            {list?.map?.(renderItem)}
          </View>
        )}
      </View>
      <Divider style={styles.divider} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
    },
    headerContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
    },
    item: {
      marginRight: spacing.margin.small,
      marginBottom: spacing.margin.small,
    },
    divider: {
      marginTop: spacing.margin.tiny,
    },
    contentContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: colors.white,
    },
  });
};

export default SelectingAudiences;
