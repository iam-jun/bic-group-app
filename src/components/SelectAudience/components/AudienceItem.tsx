import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IGroup } from '~/interfaces/IGroup';
import AudienceContent from './AudienceContent';
import { spacing } from '~/theme';

interface AudienceItemProps {
    item: IGroup;
    shouldCheckboxDisabled: (item: IGroup) => boolean;
    shouldBeChecked: (item: IGroup) => boolean;
    onCheckboxPress: (item: IGroup, isChecked: boolean) => void;
}

const AudienceItem: React.FC<AudienceItemProps> = ({
    item,
    shouldCheckboxDisabled,
    shouldBeChecked,
    onCheckboxPress,
}) => {
    const styles = createStyle();
    const children = item?.children || [];

    return (
        <View style={styles.container}>
            <AudienceContent
                shouldCheckboxDisabled={shouldCheckboxDisabled}
                shouldBeChecked={shouldBeChecked}
                onPress={onCheckboxPress}
                style={styles.itemContainer}
                item={item}
            />
            {children.map((child: IGroup) => (
                <AudienceItem
                    item={child}
                    shouldCheckboxDisabled={shouldCheckboxDisabled}
                    shouldBeChecked={shouldBeChecked}
                    onCheckboxPress={onCheckboxPress}
                    key={`audience-item-${child.id}`}
                />
            ))}
        </View>
    );
};

const createStyle = () => {
    return StyleSheet.create({
        container: {},
        itemContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: spacing.padding.small,
        },
    });
};

export default AudienceItem;
