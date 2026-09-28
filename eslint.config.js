import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // hooky jen na nejvyšší úrovni komponenty (ne v podmínkách a cyklech)
      'react-hooks/rules-of-hooks': 'error',
      // chybějící závislosti v useEffect / useCallback
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
