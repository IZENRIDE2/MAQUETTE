module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // expo-router & @/ alias
      [
        'module-resolver',
        {
          alias: { '@': './src' },
        },
      ],
      // reanimated must be last
      'react-native-reanimated/plugin',
    ],
  };
};
