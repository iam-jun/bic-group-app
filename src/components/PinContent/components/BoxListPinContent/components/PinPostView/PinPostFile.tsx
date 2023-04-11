import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';
import { getFileIcons } from '~/configs';
import { IActivityDataFile } from '~/interfaces/IPost';
import { IconType } from '~/resources/icons';
import { IGetFile } from '~/store/uploader';
import { spacing } from '~/theme';
import { borderRadius } from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import { formatBytes } from '~/utils/formatter';

interface PinPostFileProps {
    data: IGetFile[] | IActivityDataFile[];
}

const PinPostFile: React.FC<PinPostFileProps> = ({
  data,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  if (!data || data?.length === 0) return null;

  const fileName = data?.[0]?.name;
  const fileExt = fileName?.split('.')?.pop?.()?.toUpperCase?.();
  const icon = getFileIcons(fileExt) as IconType;

  return (
    <View style={styles.container} testID="pin_post_file.content">
      <View style={styles.boxFile}>
        <Icon
          size={22}
          icon={icon}
          style={styles.iconFile}
          tintColor={colors.neutral40}
        />
        <View style={styles.boxName}>
          <Text.BodyXSMedium
            color={colors.neutral80}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            { fileName }
            <Text.BodyXS color={colors.neutral40}>
              {`  (${formatBytes(data?.[0]?.size)})`}
            </Text.BodyXS>
          </Text.BodyXSMedium>
        </View>
        <View style={styles.boxIconDownload}>
          <Icon
            size={14}
            icon="ArrowDownToLine"
            tintColor={colors.neutral40}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
    },
    boxFile: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray1,
      borderRadius: borderRadius.small,
      paddingHorizontal: spacing.padding.base,
      paddingVertical: spacing.padding.small,
    },
    iconFile: {
      marginRight: spacing.margin.tiny,
    },
    boxName: {
      flex: 1,
    },
    boxIconDownload: {
      paddingHorizontal: spacing.padding.xTiny,
    },
  });
};

export default PinPostFile;
