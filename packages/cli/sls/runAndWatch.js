const { join } = require("path");
const { green, red, blue } = require("chalk");
const chokidar = require("chokidar");
const ora = require("ora");
const { getTemplate, findTemplate } = require("./template/utils");

let deployInProgress = false;

const onChange = ({ alias, execute }) => {
    let interval;
    let number;
    const spinner = ora();
    const spinnerText = number => `Deploying ${green(alias)} in ${number}...`;

    return async file => {
        clearInterval(interval);
        spinner.stop();

        console.log(`File changed: ${blue(file)}`);
        if (deployInProgress) {
            console.log(`\n🚨 ${red("Another deploy is already in progress!\n")}`);
            return;
        }

        number = 3;
        spinner.text = spinnerText(number);
        spinner.start();
        interval = setInterval(async () => {
            number--;
            spinner.text = spinnerText(number);
            if (number === 0) {
                clearInterval(interval);
                spinner.stop();
                deployInProgress = true;
                console.log(`Deploying ${green(alias)}...\n`);
                try {
                    await execute(alias);
                } catch (e) {
                    console.log(`🚨 ${e.message}`);
                } finally {
                    deployInProgress = false;
                    console.log(`Watching for changes...`);
                }
            }
        }, 1000);
    };
};

const runAndWatch = (execute, { alias, what }) => {
    return new Promise(async resolve => {
        // Find template file
        const cwd = process.cwd();
        const root = join(cwd, what);
        process.chdir(root);
        const templatePath = findTemplate();
        process.chdir(cwd);

        // Get template
        const template = await getTemplate({ template: templatePath });
        const aliases = Array.isArray(alias) ? alias : [alias];

        const globs = {};
        aliases.forEach(alias => {
            const { watch } = template[alias];
            if (!watch || !watch.paths) {
                return;
            }

            if (watch && watch.paths) {
                console.log(`Watching ${green(alias)} for changes...`);
            }
            globs[alias] = watch.paths.map(glob => {
                if (glob.startsWith("./")) {
                    return join(root, glob);
                }
                return glob;
            });
        });

        if (aliases.length > Object.keys(globs)) {
            console.log(
                `⚠️ No files are being watched. Configure the ${blue(
                    "watch"
                )} parameter for components you want to watch in your ${blue(
                    "serverless.yaml"
                )} file.`
            );
            return resolve();
        }

        // Run the initial deploy
        // await execute();

        // Create watchers for each alias
        Object.keys(globs).forEach(alias => {
            const watcher = chokidar.watch(globs[alias]);
            watcher.on("change", onChange({ alias, watch: template[alias].watch, execute }));
        });
    });
};

module.exports = { runAndWatch };
