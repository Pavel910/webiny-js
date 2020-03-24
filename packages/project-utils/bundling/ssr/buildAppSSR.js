const path = require("path");
const fs = require("fs-extra");

module.exports.buildAppSSR = async ({ app = null, output, ...options }, context) => {
    if (!app) {
        throw new Error(`Specify an "app" path to use for SSR bundle.`);
    }

    const { setupOutput } = require("./utils");
    output = setupOutput(output);

    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = "production";
    }

    if (!process.env.REACT_APP_ENV) {
        process.env.REACT_APP_ENV = "ssr";
    }

    const indexHtml = path.resolve(app, "build", "index.html").replace(/\\/g, "\\\\");
    const appComponent = path.resolve(app, "src", "App").replace(/\\/g, "\\\\");

    const chalk = require("chalk");

    if (!fs.existsSync(indexHtml)) {
        console.log(
            `\n🚨 ${chalk.red(
                indexHtml
            )} does not exist!\nHave you built the app before running the SSR build?\n`
        );
        process.exit(1);
    }

    // Build SSR
    const buildDir = path.resolve(output.path);
    await fs.emptyDir(buildDir);

    // Generate SSR boilerplate code
    const entry = path.resolve(output.path, "source.js");
    const handler = path.resolve(output.path, "handler.js");
    let code = await fs.readFile(__dirname + "/template/renderer.js", "utf8");
    const importApp = `import { App } from "${appComponent}";`;
    code = code.replace("/*{import-app-component}*/", importApp);
    code = code.replace("/*{index-html-path}*/", indexHtml);
    await fs.writeFile(entry, code);
    await fs.copyFile(__dirname + "/template/handler.js", handler);

    // Run bundling
    const { bundle } = require("./bundle");
    await bundle({ entry, output, ...options });

    // Delete the temporary source file
    await fs.unlink(entry);
};
