import React from "react";
import { Text } from "~/theme/components";
import ThemeView from "~/theme/components/ThemeView";

const Home = () => {
  return (
    <ThemeView testID="HomeScreen" disabledDarkMode isFullView>
      <Text h1 bold>
        Hello ~~~~~
      </Text>
    </ThemeView>
  );
};

export default Home;
