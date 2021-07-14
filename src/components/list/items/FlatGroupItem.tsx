import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {IGroup} from "~/interfaces/IGroup";
import {useDispatch} from "react-redux";
import {useTheme} from "react-native-paper";
import {useBaseHook} from "~/hooks";
import {IObject} from "~/interfaces/common";
import {Image, Text} from "~/components";
import Icon from "~/components/Icon";
import {grey5, grey9} from "~/theme/colors";
import {groupsStack} from "~/configs/navigator";

const FlatGroupItem: React.FC<IGroup> = (
    {
        id,
        name,
        userCount,
        parentId,
        parent,
        children,
        type,
        icon,
    }
) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const {spacing}:IObject<any> = theme;
    const {t, navigation} = useBaseHook();
    const styles = themeStyles(theme);

    const _onPressParentGroup = (group:any) => {
        navigation.navigate(groupsStack.groupDetail, {groupId: group.id});
    }

    const _onPressItem = () => {
        navigation.navigate(groupsStack.groupDetail, {groupId: id});
    }

    const getGroupParent = (group: IGroup, parents: IGroup[]) => {
        parents.push(group);
        if (group.parent) {
            getGroupParent(group.parent, parents);
        }
    }

    const renderPath = () => {
        const parents:IGroup[] = [];
        if (parent) {
            getGroupParent(parent, parents);
        }
        const largestParent:IGroup | undefined = parents?.length > 1 ? parents?.[parents?.length - 1] : undefined;
        const hasMiddleParent = parents?.length > 2;
        const directParent:IGroup | undefined = parents?.[0];
        return (
            <View style={{ marginHorizontal: spacing.margin.tiny}}>
                <Text>
                    {largestParent && <Text onPress={() => _onPressParentGroup(largestParent)}>{largestParent.name}/</Text>}
                    {hasMiddleParent && <Text>.../</Text>}
                    {directParent && <Text onPress={() => _onPressParentGroup(directParent)}>{directParent.name}/</Text>}
                    {parents?.length === 0 && <Text>/</Text>}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={{marginTop: spacing.margin.tiny, flexDirection: 'row'}}>
                <View style={styles.iconNextContainer}>
                    <Icon icon={'iconArrowRight'} size={12} tintColor={grey9}/>
                </View>
                {renderPath()}
            </View>
            <TouchableOpacity onPress={_onPressItem}>
                <View style={{ flexDirection: 'row', marginVertical: spacing.margin.tiny}}>
                    <Image style={styles.icon} source={{uri: icon}}/>
                    <View style={styles.textContainer}>
                        <Text bold h5>{name}</Text>
                        <View style={styles.row}>
                            <Icon icon={'iconUserGroup'} size={16} tintColor={grey5}/>
                            <Text style={styles.textInfo} h5 colorThird>{userCount}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const themeStyles = (theme: IObject<any>) => {
    const {spacing, colors} = theme;
    return StyleSheet.create({
        container: {
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
            backgroundColor: colors.grey1,
            width: 16,
            height: 16,
            marginTop: 2,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        }
    });
};

export default FlatGroupItem;
