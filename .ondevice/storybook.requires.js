/* do not change this file, it is auto generated by storybook. */

import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
} from "@storybook/react-native";

import "@storybook/addon-ondevice-notes/register";
import "@storybook/addon-ondevice-controls/register";
import "@storybook/addon-ondevice-backgrounds/register";
import "@storybook/addon-ondevice-actions/register";

import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs";

import { decorators, parameters } from "./preview";

if (decorators) {
  decorators.forEach((decorator) => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

// temporary fix for https://github.com/storybookjs/react-native/issues/327 whilst the issue is investigated
try {
  argsEnhancers.forEach((enhancer) => addArgsEnhancer(enhancer));
} catch {}

const getStories = () => {
  return [
    require("../src/baseComponents/Avatar/index.stories.tsx"),
    require("../src/baseComponents/BannerImportant/index.stories.tsx"),
    require("../src/baseComponents/Button/ButtonRaise/index.stories.tsx"),
    require("../src/baseComponents/Button/index.stories.tsx"),
    require("../src/baseComponents/Checkbox/index.stories.tsx"),
    require("../src/baseComponents/CirclePercentage/index.stories.tsx"),
    require("../src/baseComponents/Input/DateInput/index.stories.tsx"),
    require("../src/baseComponents/Input/PasswordInput/index.stories.tsx"),
    require("../src/baseComponents/Input/SearchInput/index.stories.tsx"),
    require("../src/baseComponents/Input/TextArea/index.stories.tsx"),
    require("../src/baseComponents/Input/TextInput/index.stories.tsx"),
    require("../src/baseComponents/PlaceHolderRemoveContent/index.stories.tsx"),
    require("../src/baseComponents/Radio/index.stories.tsx"),
    require("../src/baseComponents/Reaction/index.stories.tsx"),
    require("../src/baseComponents/Tab/index.stories.tsx"),
    require("../src/baseComponents/Tag/index.stories.tsx"),
    require("../src/baseComponents/Toast/index.stories.tsx"),
    require("../src/baseComponents/Toggle/index.stories.tsx"),
  ];
};

configure(getStories, module, false);
