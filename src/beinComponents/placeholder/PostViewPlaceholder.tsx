import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import {
  ShineOverlay,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import {getRandomInt} from '~/utils/generator';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';

export interface PostViewPlaceholderProps {
  style?: StyleProp<ViewStyle>;
  disableRandom?: boolean;
  testID?: string;
}

const PostViewPlaceholder: FC<PostViewPlaceholderProps> = ({
  style,
  disableRandom,
  testID = 'post_view_placeholder',
}: PostViewPlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View testID={testID} style={StyleSheet.flatten([styles.container, style])}>
      <View style={styles.importantContainer}>
        <Image style={styles.iconStar} source={images.ic_star_white} />
        <Placeholder Animation={ShineOverlay} style={styles.flex1}>
          <PlaceholderMedia style={styles.importantTitle} />
        </Placeholder>
      </View>
      <Placeholder
        Animation={ShineOverlay}
        Left={p => <PlaceholderMedia style={[p.style, styles.avatar]} />}
        style={styles.infoContainer}>
        <PlaceholderLine
          width={disableRandom ? 50 : getRandomInt(30, 60)}
          style={styles.marginBottomSmall}
        />
        <PlaceholderLine
          width={disableRandom ? 60 : getRandomInt(30, 80)}
          style={styles.marginBottomSmall}
        />
        <PlaceholderLine
          width={disableRandom ? 40 : getRandomInt(30, 50)}
          style={styles.margin0}
        />
      </Placeholder>
      <Placeholder Animation={ShineOverlay} style={styles.contentContainer}>
        {Array.from(Array(disableRandom ? 3 : getRandomInt(1, 5)).keys()).map(
          item => (
            <PlaceholderLine
              key={`line_${item}`}
              style={styles.marginBottomSmall}
            />
          ),
        )}
        <PlaceholderLine
          width={disableRandom ? 45 : getRandomInt(20, 80)}
          style={styles.margin0}
        />
      </Placeholder>
      <Placeholder Animation={ShineOverlay}>
        <PlaceholderMedia style={styles.image} />
      </Placeholder>
      <View style={styles.buttonWrapper}>
        <View style={styles.buttonContainer}>
          <Placeholder
            Animation={ShineOverlay}
            style={styles.buttonContent}
            Left={p => <PlaceholderMedia style={[p.style, styles.icon]} />}>
            <PlaceholderLine style={styles.margin0} height={14} />
          </Placeholder>
        </View>
        <Divider horizontal style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Placeholder
            Animation={ShineOverlay}
            style={styles.buttonContent}
            Left={p => <PlaceholderMedia style={[p.style, styles.icon]} />}>
            <PlaceholderLine style={styles.margin0} height={14} />
          </Placeholder>
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    margin0: {marginTop: 0, marginBottom: 0},
    marginBottomSmall: {marginBottom: spacing.margin.small},
    container: {
      backgroundColor: colors.white,
      marginBottom: spacing.margin.base,
    },
    importantContainer: {
      backgroundColor: colors.neutral5,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.base,
    },
    importantTitle: {
      marginLeft: spacing.margin.large,
      width: 135,
      height: 15,
    },
    iconStar: {width: 28, height: 28},
    infoContainer: {
      paddingTop: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.base,
    },
    content: {
      height: 40,
      marginBottom: 0,
      marginTop: 0,
      borderRadius: 100,
    },
    avatar: {
      width: 52,
      height: 52,
      marginRight: 8,
    },
    contentContainer: {
      paddingHorizontal: spacing.padding.base,
      paddingBottom: 0,
    },
    image: {
      borderRadius: 0,
      height: 200,
      width: '100%',
      marginTop: spacing.margin.base,
    },
    icon: {
      width: 16,
      height: 16,
    },
    buttonWrapper: {height: 40, flexDirection: 'row', alignItems: 'center'},
    buttonContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContent: {
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    divider: {height: '65%', alignSelf: 'center'},
  });
};

export default PostViewPlaceholder;
