import { voxpelli } from '@voxpelli/eslint-config';

export default [
  ...voxpelli({
    noMocha: true,
  }),
  {
    languageOptions: {
      ecmaVersion: 'latest',
    },
  },
];
