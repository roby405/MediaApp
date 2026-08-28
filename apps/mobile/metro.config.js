const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in monorepo
config.watchFolders = [monorepoRoot];

// 2. Tell Metro where node_modules live
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 3. Force EVERY import of 'react' across the entire monorepo to resolve to Mobile's React 18
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react") {
    return {
      filePath: path.resolve(projectRoot, "node_modules/react/index.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "react/jsx-runtime") {
    return {
      filePath: path.resolve(projectRoot, "node_modules/react/jsx-runtime.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "react/jsx-dev-runtime") {
    return {
      filePath: path.resolve(projectRoot, "node_modules/react/jsx-dev-runtime.js"),
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });