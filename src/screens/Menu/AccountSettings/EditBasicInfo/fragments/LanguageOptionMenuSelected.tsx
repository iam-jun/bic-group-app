import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { ILanguageItem } from '~/interfaces/IEditUser';
import spacing from '~/theme/spacing';
import Tag from '~/baseComponents/Tag';
import { useBaseHook } from '~/hooks';
import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';

type LanguageOptionMenuSelectedProps = {
  languages: ILanguageItem[];
  onRemove: (language?: ILanguageItem) => void;
};

const LanguageOptionMenuSelected: FC<LanguageOptionMenuSelectedProps> = ({
  languages,
  onRemove,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <Button testID="button.selected_languages" style={styles.inputContainer}>
        {languages && languages.length !== 0 ? (
          <>
            <View style={styles.tagContainer}>
              {languages.map((item) => (
                <View key={`sllg-${item.code}`}>
                  <Tag
                    type="neutral"
                    size="medium"
                    style={styles.tag}
                    label={item.local}
                    icon="Xmark"
                    onPressIcon={() => onRemove(item)}
                  />
                </View>
              ))}
            </View>
            <Button
              testID="button.remove"
              style={styles.buttonRemove}
              onPress={() => onRemove()}
            >
              <Icon icon="Xmark" tintColor={colors.neutral40} size={10} />
            </Button>
          </>
        ) : (
          t('common:text_not_set')
        )}
      </Button>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
    inputContainer: {
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.neutral5,
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.xSmall,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      flex: 1,
    },
    tag: {
      marginVertical: 2,
    },
    buttonRemove: {
      padding: spacing.padding.xSmall,
    },
  });
};

export default LanguageOptionMenuSelected;
