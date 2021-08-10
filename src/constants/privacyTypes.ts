export type PRIVACY_TYPE = 'PUBLIC' | 'PRIVATE' | 'SECRET';

export default [
  {
    type: 'PUBLIC',
    title: 'Public',
    icon: 'Globe',
    subtitle: 'Group shows to everyone. Learn more',
  },
  {
    type: 'PRIVATE',
    title: 'Private',
    icon: 'Lock',
    subtitle: "Group's content show to only members.\nLearn more",
  },
  {
    type: 'SECRET',
    title: 'Secret',
    icon: 'EyeSlash',
    subtitle: 'This group is secret. Learn more',
  },
];
