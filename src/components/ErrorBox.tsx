import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from '~/components';
import {useTheme} from "react-native-paper";
import {IObject} from "~/interfaces/common";
import Icon from "~/components/Icon";
import {white} from "~/theme/colors";

export interface Props {
    title?: string;
    content?: string;
    style?: StyleProp<ViewStyle>;
    onClose?: () => void;
}

const ErrorBox: React.FC<Props> = ({title, content, style, onClose}) => {
    const theme = useTheme();
    const styles = themeStyles(theme);

    return (
        <View style={[styles.container, style]}>
            <Text h5 style={{flex: 1}} reverseDarkMode>{content}</Text>
            {onClose && <Icon icon={'iconClose'} tintColor={white} onPress={onClose}/>}
        </View>
    );
}

const themeStyles = (theme: IObject<any>) => {
    const {colors, spacing} = theme;
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: colors.error,
            borderRadius: spacing.borderRadius.small,
            marginTop: spacing.margin.base,
            padding: spacing.padding.base,
            alignSelf: 'center',
        },
    });
}

export default ErrorBox;
