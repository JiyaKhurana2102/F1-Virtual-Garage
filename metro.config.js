const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro knows about the .glb asset extension so binary models are bundled
if (config.resolver && config.resolver.assetExts) {
  config.resolver.assetExts.push('glb');
} else {
  config.resolver = { assetExts: ['glb'] };
}

module.exports = config;
