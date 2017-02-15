#!/usr/bin/env node

// Example Usage
// ./cli.js --ts 'test/fixtures/**/*.{ts,tsx}' --md 'test/fixtures/**/*.md' --css 'test/fixtures/**/*.css'

// const program = require("commander");
const yargs = require("yargs");
const fs = require("fs");
const glob = require("glob");
const { Documentalist } = require("./dist/");

const argv = yargs
    .version(require("./package.json").version)
    .usage("$0 [options] <files>")
    .demandCommand(1, "Requires at least one file")
    // TODO: how to specify plugin on CLI?
    // .option("--use [pattern:plugin]", "Use a plugin to process files matching the pattern")
    .argv;

// ensure `use` option is always an array
const plugins = [].concat(argv.use)
    .filter((use) => use !== undefined)
    .map((/** @type {string} */ use) => {
        const [pattern, plugin] = use.split(":");
        if (plugin === undefined) {
            console.error("invalid --use option '%s'", use);
            process.exit(1);
        }
        return { pattern, plugin };
    });

const doc = new Documentalist();
plugins.forEach(({ pattern, plugin }) => {
    doc.use(new RegExp(pattern), plugin);
});
const documentation = doc.traverse(...argv._);

console.log(JSON.stringify(documentation, null, 2));
