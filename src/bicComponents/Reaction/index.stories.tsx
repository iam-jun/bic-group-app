/* eslint-disable no-alert */
import Reaction from '.';
import { ComponentMeta, getStoryComponent } from '~/storybook';

export default {
  title: 'components/Reaction',
  component: Reaction,
} as ComponentMeta<typeof Reaction>;

const StoryComponent = getStoryComponent(Reaction);

export const Default = StoryComponent.bind({});
Default.args = {
  value: 10,
  icon: 'kissing_closed_eyes',
  selected: false,
  onActionPress: () => { alert('onActionPress') },
  onLongPress: () => { alert('onLongPress') },
}

export const Loading = StoryComponent.bind({});
Loading.args = {
  ...Default.args,
  selected: true,
  loading: true,
}
