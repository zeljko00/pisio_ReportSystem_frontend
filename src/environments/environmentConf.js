import developmentConfig from "./config.development.json";
import productionConfig from "./config.production.json";

export default () => {
  // based on value of environment variable NODE_ENV, app will be configured for executing in production/development/test environment
  // app will use configuration from developmentConfig or productionConfig (config files for different execution environments) depending on value of NODE_ENV
  // in this simple case config files contain only base url of backend app, which commonly differs for different execution environments
  switch (process.env.NODE_ENV) {
    case "development":
    case "test": {
      return developmentConfig;
    }
    case "production": {
      return productionConfig;
    }

    default: {
      throw new Error("NODE_ENV not being set");
    }
  }
};
