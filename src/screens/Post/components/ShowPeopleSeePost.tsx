import React, {FC, useRef, useEffect, useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text as RNText,
  View,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';

import {ITheme} from '~/theme/interfaces';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';
import {getResourceUrl, uploadTypes} from '~/configs/resourceConfig';
import {fontFamilies} from '~/theme/fonts';
import {
  IActivityDataImage,
  ICommentData,
  ICreatePostImage,
} from '~/interfaces/IPost';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';
import {useUserIdAuth} from '~/hooks/auth';
import style from '~/theme/style';

export interface ShowPeopleSeePostProps {
  onPressSeenBy?: () => void;
  seenPeopleCount?: number;
}

const ShowPeopleSeePost: FC<ShowPeopleSeePostProps> = ({
  seenPeopleCount,
  onPressSeenBy,
}: ShowPeopleSeePostProps) => {
  const [publishing, setPublishing] = useState(false);

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();
  const _onPressSeenBy = () => {
    onPressSeenBy?.();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => _onPressSeenBy()} activeOpacity={1}>
        <RNText style={styles.seenText}>
          {t('post:label_seen_by')}
          {seenPeopleCount}
        </RNText>
      </TouchableOpacity>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      alignItems: 'flex-end',
      marginTop: 16,
      marginEnd: 16,
    },
    seenText: {
      fontFamily: fontFamilies.OpenSans,
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 14,
      color: colors.iconTintLight,
    },
    footerButtonContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.tiny,
    },
    footerButton: {
      flex: 1,
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.tiny,
    },
    draftText: {
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
    },
  });
};

export default ShowPeopleSeePost;
