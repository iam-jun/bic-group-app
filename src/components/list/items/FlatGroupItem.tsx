import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IGroup} from "~/interfaces/IGroup";
import {useDispatch} from "react-redux";
import {useTheme} from "react-native-paper";
import {useBaseHook} from "~/hooks";
import {IObject} from "~/interfaces/common";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Image, Text} from "~/components";
import Icon from "~/components/Icon";
import {grey5, grey9} from "~/theme/colors";

const FlatGroupItem: React.FC<IGroup> = (
    {
        id,
        name,
        userCount,
        parentId,
        children,
        type,
        icon,
    }
) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const {t, navigation} = useBaseHook();
    const styles = themeStyles(theme);

    return (
        <View style={styles.container}>
            <Image style={styles.icon} source={{uri: icon}}/>
            <View style={styles.textContainer}>
                <Text h5>{name}</Text>
                <View style={styles.row}>
                    <Icon icon={'iconUserGroup'} size={16} tintColor={grey5}/>
                    <Text style={styles.textInfo} h5 colorThird>{userCount}</Text>
                </View>
            </View>
            <View style={styles.iconNextContainer}>
                <Icon icon={'iconArrowRight'} size={12} tintColor={grey9}/>
            </View>
        </View>
    );
};

const themeStyles = (theme: IObject<any>) => {
    const insets = useSafeAreaInsets();
    const {spacing, colors} = theme;
    return StyleSheet.create({
        container: {
            paddingVertical: spacing.padding.tiny,
            flexDirection: 'row',
        },
        textContainer: {
            paddingHorizontal: spacing.padding.base,
            flex: 1,
        },
        icon: {
            width: 48,
            height: 48,
            borderRadius: spacing.borderRadius.small,
        },
        row: {
            flexDirection: 'row',
        },
        textInfo: {
            marginHorizontal: spacing.margin.tiny,
        },
        iconNextContainer: {
            backgroundColor: colors.prelude,
            width: 16,
            height: 16,
            marginTop: spacing.margin.tiny,
            marginRight: spacing.margin.small,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        }
    });
};

export default FlatGroupItem;
