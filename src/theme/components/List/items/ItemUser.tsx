import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import Text from "../../Text";
import { spacing } from "~/theme/configs";
import { IObject } from "~/interfaces/common";
import { generateAvatar } from "~/utils/common";
import Avatar from "../../Image/Avatar";

const ItemUser: React.FC<IObject<any>> = ({ id, name, online, role }) => {
  const theme: IObject<any> = useTheme();

  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.avatarView}>
        <Avatar uri={generateAvatar(name)} />
        {online && <View style={styles.dot} />}
      </View>
      <View>
        <Text bold>{name || id}</Text>
        <Text>{role}</Text>
      </View>
    </View>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: spacing.padding.base,
    },
    avatarView: {
      marginEnd: spacing.margin.base,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 100,
      backgroundColor: "green",
      position: "absolute",
      bottom: 4,
      right: 0,
      borderWidth: 2,
      borderColor: colors.white,
    },
  });
};

export default ItemUser;
