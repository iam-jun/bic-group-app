import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import { mapIndexToAlphabet } from '../../helper';
import { spacing } from '~/theme';

interface AnswerItemProps {
    index: number;
    data: any;
    onPress: (data: any) => void;
    isCorrect: boolean;
}

const AnswerItem: React.FC<AnswerItemProps> = ({ index, data, onPress, isCorrect }) => {
    const theme: ExtendedTheme = useTheme();
    const { colors } = theme;
    const styles = createStyle(theme);

    const onPressAnswer = () => {
        onPress(data);
    }

    return (
        <View style={styles.container}>
            <View style={[styles.square, isCorrect && styles.squareCorrect]}>
                <Text.ButtonS color={isCorrect ? colors.purple50 : colors.neutral40}>
                    {mapIndexToAlphabet[index]}
                </Text.ButtonS>
            </View>
            <Button style={[styles.answerBtn, isCorrect && styles.answerCorrect]} onPress={onPressAnswer}>
                <Text.DropdownM color={isCorrect ? colors.white : colors.neutral60}>
                    { data?.answer }
                </Text.DropdownM>
            </Button>
        </View>
    );
};

const createStyle = (theme: ExtendedTheme) => {
    const { colors } = theme;

    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.margin.large,
        },
        square: {
            height: 28,
            width: 28,
            borderRadius: spacing.borderRadius.base,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.margin.small,
        },
        squareCorrect: {
            backgroundColor: colors.purple5, 
        },
        answerBtn: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.neutral5,
            paddingLeft: spacing.padding.large,
            paddingVertical: spacing.padding.small,
            paddingRight: spacing.padding.small,
            borderRadius: spacing.borderRadius.large,
        },
        answerCorrect: {
            backgroundColor: colors.purple50,
            borderWidth: 1,
            borderColor: colors.purple50,
        },
    });
};

const styles = StyleSheet.create({
    
});

export default AnswerItem;
