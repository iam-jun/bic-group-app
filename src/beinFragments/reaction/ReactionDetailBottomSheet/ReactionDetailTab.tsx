import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {ReactionType} from '~/constants/reactions';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

export interface ReactionDetailTabProps {
  reactionType: ReactionType;
  postId: string;
  commentId?: string;
  limit?: number;
  height?: number;
  onPressItem?: (item: any) => void;
}

const screenHeight = Dimensions.get('window').height;
const contentBarHeight = 0.6 * screenHeight;

const ReactionDetailTab: FC<ReactionDetailTabProps> = ({
  reactionType,
  postId,
  commentId,
  limit = 100,
  height = contentBarHeight,
  onPressItem,
}: ReactionDetailTabProps) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const getData = () => {
    if (reactionType && postId) {
      setLoading(true);
      const param = {reactionType, commentId, postId, limit};
      postDataHelper
        .getReactionDetail(param)
        .then(response => {
          if (response?.results?.length > 0) {
            setData(response?.results);
          }
          setLoading(false);
        })
        .catch(e => {
          console.log(`\x1b[31m🐣️ ReactionDetailTab get error ${e}\x1b[0m`);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setData([]);
    getData();
  }, [reactionType]);

  const _onPressItem = (item: any) => {
    onPressItem?.(item);
  };

  const renderItem = (item: any) => {
    return (
      <PrimaryItem
        showAvatar
        height={44}
        onPress={() => _onPressItem(item)}
        avatar={item?.item?.user?.data?.avatar}
        title={item?.item?.user?.data?.fullname}
      />
    );
  };

  const renderFooter = () => {
    if (loading) {
      return <LoadingIndicator />;
    }
    return null;
  };

  const renderHeader = () => {
    return <View style={styles.header} />;
  };

  return (
    <View style={{height}}>
      <FlatList
        style={styles.listContainer}
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    listContainer: {
      paddingTop: spacing.padding.tiny,
    },
    header: {
      paddingTop: spacing.padding.tiny,
    },
  });
};

export default ReactionDetailTab;
