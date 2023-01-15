import { ComponentMeta } from '@storybook/react-native';
import PlaceHolderRemoveContent from '.';
import { getStoryComponent } from '~/storybook';

export default {
  title: 'base/PlaceHolderRemoveContent',
  component: PlaceHolderRemoveContent,
} as ComponentMeta<typeof PlaceHolderRemoveContent>;

const StoryComponent = getStoryComponent(PlaceHolderRemoveContent);

export const Default = StoryComponent.bind({});
Default.args = {
  label: 'common:text_post_reported',
};
