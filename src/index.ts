/* eslint-disable guard-for-in, max-len, no-await-in-loop, no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import { extendConfig, task } from 'hardhat/config';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { HardhatConfig, HardhatRuntimeEnvironment, HardhatUserConfig } from 'hardhat/types';
import * as Sqrl from 'squirrelly';

import { CompilerOutputContractWithDocumentation, Doc } from './dodocTypes';
import { decodeAbi } from './abiDecoder';
import './type-extensions';

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  // eslint-disable-next-line no-param-reassign
  config.dodoc = {
    include: userConfig.dodoc?.include || [],
    exclude: userConfig.dodoc?.exclude || [],
    runOnCompile: userConfig.dodoc?.runOnCompile !== undefined ? userConfig.dodoc?.runOnCompile : true,
    debugMode: userConfig.dodoc?.debugMode || false,
    outputDir: userConfig.dodoc?.outputDir || './docs',
    templatePath: userConfig.dodoc?.templatePath || path.join(__dirname, './template.sqrl'),
    keepFileStructure: userConfig.dodoc?.keepFileStructure ?? true,
    freshOutput: userConfig.dodoc?.freshOutput ?? true,
    helpers: userConfig.dodoc?.helpers || [],
  };
});

async function generateDocumentation(hre: HardhatRuntimeEnvironment): Promise<void> {
  const config = hre.config.dodoc;
  const docs: Doc[] = [];

  const qualifiedNames = await hre.artifacts.getAllFullyQualifiedNames();
  const filteredQualifiedNames = qualifiedNames.filter((filePath: string) => {
    // Checks if the documentation has to be generated for this contract
    const includesPath = config.include.some((str) => filePath.includes(str));
    const excludesPath = config.exclude.some((str) => filePath.includes(str));
    return (config.include.length === 0 || includesPath) && !excludesPath;
  });

  // Loops through all the qualified names to get all the compiled contracts
  const sourcesPath = hre.config.paths.sources.substr(process.cwd().length + 1); // trick to get relative path to files, and trim the first /

  for (const qualifiedName of filteredQualifiedNames) {
    const [source, name] = qualifiedName.split(':');

    const buildInfo = await hre.artifacts.getBuildInfo(qualifiedName);
    const info = buildInfo?.output.contracts[source][name] as CompilerOutputContractWithDocumentation;

    if (config.debugMode) {
      console.log('ABI:\n');
      console.log(JSON.stringify(info.abi, null, 4));
      console.log('\n\n');
      console.log('User doc:\n');
      console.log(JSON.stringify(info.userdoc, null, 4));
      console.log('\n\n');
      console.log('Dev doc:\n');
      console.log(JSON.stringify(info.devdoc, null, 4));
    }

    const doc: Doc = {
      ...decodeAbi(info.abi),
      path: source.substr(sourcesPath.length).split('/').slice(0, -1).join('/'),
    }; // get file path without filename

    // Fetches info from userdoc
    for (const errorSig in info.userdoc?.errors) {
      const [errorName] = errorSig.split('(');
      const error = info.userdoc?.errors[errorSig][0];

      if (doc.errors[errorName] !== undefined) doc.errors[errorName].notice = error?.notice;
    }

    for (const eventSig in info.userdoc?.events) {
      const [eventName] = eventSig.split('(');
      const event = info.userdoc?.events[eventSig];

      if (doc.events[eventName] !== undefined) doc.events[eventName].notice = event?.notice;
    }

    for (const methodSig in info.userdoc?.methods) {
      // const [methodName] = methodSig.split('(');
      const method = info.userdoc?.methods[methodSig];

      if (doc.methods[methodSig] !== undefined) doc.methods[methodSig].notice = method?.notice;
    }

    // Fetches info from devdoc
    for (const errorSig in info.devdoc?.errors) {
      const [errorName] = errorSig.split('(');
      const error = info.devdoc?.errors[errorSig][0];

      if (doc.errors[errorName] !== undefined) doc.errors[errorName].details = error?.details;

      for (const param in error?.params) {
        if (doc.errors[errorName].inputs[param])
          doc.errors[errorName].inputs[param].description = error?.params[param];
      }

      for (const value in error) {
        if (value.startsWith('custom:')) {
          const strippedValue = value.substring(7);
          if (strippedValue.length > 0) {
            doc.errors[errorName][`custom:${strippedValue}`] = error[`custom:${strippedValue}`];
          }
        }
      }
    }

    for (const eventSig in info.devdoc?.events) {
      const [eventName] = eventSig.split('(');
      const event = info.devdoc?.events[eventSig];

      if (doc.events[eventName] !== undefined) doc.events[eventName].details = event?.details;

      for (const param in event?.params) {
        if (doc.events[eventName].inputs[param])
          doc.events[eventName].inputs[param].description = event?.params[param];
      }

      for (const value in event) {
        if (value.startsWith('custom:')) {
          const strippedValue = value.substring(7);
          if (strippedValue.length > 0) {
            doc.events[eventName][`custom:${strippedValue}`] = event[`custom:${strippedValue}`];
          }
        }
      }
    }

    // fetch manually Natspec tags from `receive()` and `fallback()` functions
    // as these do not get included in the devdoc and userdoc from the solc output
    if (doc.methods['receive()'] !== undefined || doc.methods['fallback()'] !== undefined) {
      const astNodes = buildInfo?.output.sources[source].ast.nodes;

      // find all AST node that is a `contract`
      const contractNodes = astNodes.filter((node: any) => node.contractKind === 'contract');

      contractNodes.forEach((node: any) => {
        // find the `receive()` and `fallback()` functions
        Array('receive', 'fallback').forEach((fn: any) => {
          const astNode = node.nodes.find((node: any) => node.kind === fn);

          // check if there are some Natspec docs included
          if (astNode?.hasOwnProperty('documentation')) {
            const natspecTags = astNode.documentation.text.match(/@.*/g);

            const devDoc = natspecTags.filter((text: string) => text.match(/@dev.*/));
            const userDoc = natspecTags.filter((text: string) => text.match(/@notice.*/));

            // add custom any `@custom:` tags
            const customDocTags = natspecTags.filter((text: string) => text.match(/@custom:.*/));

            if (customDocTags.length > 0) {
              customDocTags.forEach((customDoc: any) => {
                const customTag = customDoc.replace(/ .*/, '');
                doc.methods[`${fn}()`][customTag] = customDoc.substring(customTag.length + 1);
              });
            }

            // add the Natspec docs to the `receive()` and `fallback()` functions, stripping the `@` tags
            doc.methods[`${fn}()`]['details'] = devDoc[0].substring(5);
            doc.methods[`${fn}()`]['notice'] = userDoc[0].substring(8);

            // parse any @param or @return tags if fallback function is written as
            // `fallback(bytes calldata fallbackParam) external <payable> returns (bytes memory)`
            if (fn === 'fallback') {
              // we will always have only a single `@param` or `@return` tag for the fallback function
              const paramDoc = natspecTags.filter((text: string) => text.match(/@param.*/));

              if (paramDoc.length !== 0) {
                const paramName = astNode.parameters.parameters[0].name;
                doc.methods[`${fn}()`].inputs[paramName] = {
                  type: 'bytes',
                  description: paramDoc[0].replace(`@param ${paramName} `, ''),
                };
              }

              const returnDoc = natspecTags.filter((text: string) => text.match(/@return.*/));

              if (returnDoc.length !== 0) {
                const returnVariableName =
                  astNode.returnParameters.parameters[0].name == ''
                    ? ''
                    : astNode.returnParameters.parameters[0].name;

                doc.methods[`${fn}()`].outputs[returnVariableName] = {
                  type: 'bytes',
                  description: returnDoc[0].replace(`@return ${returnVariableName} `, ''),
                };
              }

              // modify the code if the fallback is written as `fallback(bytes calldata fallbackParam) external <payable> returns (bytes memory)`
              if (
                astNode.parameters.parameters.length == 1 &&
                astNode.returnParameters.parameters.length == 1
              ) {
                const paramName =
                  astNode.parameters.parameters[0].name === '' ? '' : astNode.parameters.parameters[0].name;

                const returnVariableName =
                  astNode.returnParameters.parameters[0].name === ''
                    ? ''
                    : astNode.returnParameters.parameters[0].name;

                const stateMutability = astNode.stateMutability;

                let newFallbackCode = `fallback(bytes calldata`;

                if (paramName !== '') {
                  newFallbackCode += ` ${paramName}`;
                }

                newFallbackCode += `) external ${stateMutability} returns (bytes memory`;

                if (returnVariableName !== '') {
                  newFallbackCode += ` ${returnVariableName}`;
                }

                newFallbackCode += ')';

                doc.methods[`${fn}()`].code = newFallbackCode;
              }
            }
          }
        });
      });
    }

    for (const methodSig in info.devdoc?.methods) {
      const method = info.devdoc?.methods[methodSig];

      if (doc.methods[methodSig] !== undefined) {
        doc.methods[methodSig].details = method?.details;

        for (const param in method?.params) {
          if (doc.methods[methodSig].inputs)
            if (doc.methods[methodSig].inputs[param])
              doc.methods[methodSig].inputs[param].description = method?.params[param];
        }

        for (const output in method?.returns) {
          if (doc.methods[methodSig].outputs)
            if (doc.methods[methodSig].outputs[output])
              doc.methods[methodSig].outputs[output].description = method?.returns[output];
        }
      }

      for (const value in method) {
        if (value.startsWith('custom:')) {
          const strippedValue = value.substring(7);
          if (strippedValue.length > 0) {
            doc.methods[methodSig][`custom:${strippedValue}`] = method[`custom:${strippedValue}`];
          }
        }
      }
    }

    for (const varName in info.devdoc?.stateVariables) {
      const variable = info.devdoc?.stateVariables[varName];
      const abiInfo = info.abi.find((a: any) => a.name === varName);

      const varNameWithParams = `${varName}(${
        abiInfo?.inputs ? abiInfo.inputs.map((inp: any) => inp.type).join(',') : ''
      })`;

      if (doc.methods[varNameWithParams]) doc.methods[varNameWithParams].details = variable?.details;

      for (const param in variable?.params) {
        if (doc.methods[varNameWithParams].inputs[param])
          doc.methods[varNameWithParams].inputs[param].description = variable?.params[param];
      }

      for (const output in variable?.returns) {
        if (doc.methods[varNameWithParams].outputs[output])
          doc.methods[varNameWithParams].outputs[output].description = variable?.returns[output];
      }
    }

    // Fetches global info
    if (info.devdoc?.title) doc.title = info.devdoc.title;
    if (info.userdoc?.notice) doc.notice = info.userdoc.notice;
    if (info.devdoc?.details) doc.details = info.devdoc.details;
    if (info.devdoc?.author) doc.author = info.devdoc.author;

    for (const value in info.devdoc) {
      if (value.startsWith('custom:')) {
        const strippedValue = value.substring(7);
        if (strippedValue.length > 0) {
          doc[`custom:${strippedValue}`] = info.devdoc[`custom:${strippedValue}`];
        }
      }
    }

    doc.name = name;
    docs.push(doc);
  }

  try {
    await fs.promises.access(config.outputDir);

    if (config.freshOutput) {
      await fs.promises.rm(config.outputDir, {
        recursive: true,
      });
      await fs.promises.mkdir(config.outputDir);
    }
  } catch (e) {
    await fs.promises.mkdir(config.outputDir);
  }

  const template = await fs.promises.readFile(config.templatePath, {
    encoding: 'utf-8',
  });

  for (let i = 0; i < docs.length; i += 1) {
    config.helpers?.forEach((elem) => {
      Sqrl.helpers.define(elem.helperName, elem.helperFunc);
    });
    const result = Sqrl.render(template, docs[i]);
    let docfileName = `${docs[i].name}.md`;
    let testFileName = `${docs[i].name}.json`;
    if (config.keepFileStructure && docs[i].path !== undefined) {
      if (!fs.existsSync(path.join(config.outputDir, <string>docs[i].path)))
        await fs.promises.mkdir(path.join(config.outputDir, <string>docs[i].path), {
          recursive: true,
        });
      docfileName = path.join(<string>docs[i].path, docfileName);
      testFileName = path.join(<string>docs[i].path, testFileName);
    }
    await fs.promises.writeFile(path.join(config.outputDir, docfileName), result, {
      encoding: 'utf-8',
    });

    if (config.debugMode) {
      await fs.promises.writeFile(
        path.join(config.outputDir, testFileName),
        JSON.stringify(docs[i], null, 4),
        {
          encoding: 'utf-8',
        }
      );
    }
  }

  console.log('✅ Generated documentation for', docs.length, docs.length > 1 ? 'contracts' : 'contract');
}

// Custom standalone task
task('dodoc', 'Generates NatSpec documentation for the project')
  .addFlag('noCompile', 'Prevents compiling before running this task')
  .setAction(async (args, hre) => {
    if (!args.noCompile) {
      await hre.run(TASK_COMPILE, { noDodoc: true });
    }

    await generateDocumentation(hre);
  });

// Overriding task triggered when COMPILE is called
task(TASK_COMPILE)
  .addFlag('noDodoc', 'Prevents generating NatSpec documentation for the project')
  .setAction(async (args, hre, runSuper) => {
    // Updates the compiler settings
    for (const compiler of hre.config.solidity.compilers) {
      compiler.settings.outputSelection['*']['*'].push('devdoc');
      compiler.settings.outputSelection['*']['*'].push('userdoc');
    }

    // Compiles the contracts
    await runSuper();

    if (hre.config.dodoc.runOnCompile && !args.noDodoc) {
      await hre.run('dodoc', { noCompile: true });
    }
  });
