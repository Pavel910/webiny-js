const { getStateValues, updateEnvValues } = require("./serverless");
const { buildFunction } = require("./bundling/function");
const { startApp, buildApp } = require("./bundling/app");
const { buildAppSSR, buildAppSSRFromSource } = require("./bundling/ssr");

module.exports = {
    buildApp,
    startApp,
    buildAppSSR,
    buildAppSSRFromSource,
    buildFunction,
    getStateValues,
    updateEnvValues
};
