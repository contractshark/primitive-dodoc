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
    libraries: userConfig.dodoc?.libraries || [],
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
    const relativeFilePath = filePath.split(':')[0];
    // Checks if the documentation has to be generated for this contract
    const includesPath = config.include.some((str) => relativeFilePath === str);
    const excludesPath = config.exclude.some((str) => relativeFilePath === str);
    return (config.include.length === 0 || includesPath) && !excludesPath;
  });

  // Loops through all the qualified names to get all the compiled contracts
  const sourcesPath = hre.config.paths.sources.substr(process.cwd().length + 1); // trick to get relative path to files, and trim the first /

  for (const qualifiedName of filteredQualifiedNames) {
    const [source, name] = qualifiedName.split(':');

    const buildInfo = await hre.artifacts.getBuildInfo(qualifiedName);
    const info = buildInfo?.output.contracts[source][name] as CompilerOutputContractWithDocumentation;

    // Getting inheritance of the contract and combining the natspec
    for (const inheritanceSource in buildInfo?.output.contracts) {
      const fileContracts = buildInfo?.output.contracts[inheritanceSource];
      for (const inheritanceContract in fileContracts) {
        const contractBuildInfo = fileContracts[
          inheritanceContract
        ] as CompilerOutputContractWithDocumentation;
        // Combining devdoc
        const contractDevdoc = info.devdoc;
        const parentContractDevdoc = contractBuildInfo.devdoc;
        if (parentContractDevdoc !== undefined) {
          if (contractDevdoc !== undefined) {
            contractDevdoc.methods = {
              ...contractDevdoc.methods,
              ...parentContractDevdoc.methods,
            };
            contractDevdoc.events = {
              ...contractDevdoc.events,
              ...parentContractDevdoc.events,
            };
            contractDevdoc.errors = {
              ...contractDevdoc.errors,
              ...parentContractDevdoc.errors,
            };
          }
          info.devdoc = contractDevdoc;
        }
        // Combining userdoc
        const contractUserdoc = info.userdoc;
        const parentContractUserdoc = contractBuildInfo.userdoc;
        if (parentContractUserdoc !== undefined) {
          if (contractUserdoc !== undefined) {
            contractUserdoc.methods = {
              ...contractUserdoc.methods,
              ...parentContractUserdoc.methods,
            };
            contractUserdoc.events = {
              ...contractUserdoc.events,
              ...parentContractUserdoc.events,
            };
            contractUserdoc.errors = {
              ...contractUserdoc.errors,
              ...parentContractUserdoc.errors,
            };
          }
          info.userdoc = contractUserdoc;
        }
      }
    }

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
        if (doc.errors[errorName]?.inputs[param]) {
          doc.errors[errorName].inputs[param].description = error?.params[param];
        }
      }

      for (const value in error) {
        if (value.startsWith('custom:')) {
          const strippedValue = value.substring(7);
          if (strippedValue.length > 0) {
            if (doc.errors[errorName]) {
              doc.errors[errorName][`custom:${strippedValue}`] = error[`custom:${strippedValue}`];
            }
          }
        }
      }
    }

    for (const eventSig in info.devdoc?.events) {
      const [eventName] = eventSig.split('(');
      const event = info.devdoc?.events[eventSig];

      if (doc.events[eventName] !== undefined) doc.events[eventName].details = event?.details;

      for (const param in event?.params) {
        if (doc.events[eventName]?.inputs[param]) {
          doc.events[eventName].inputs[param].description = event?.params[param];
        }
      }

      for (const value in event) {
        if (value.startsWith('custom:')) {
          const strippedValue = value.substring(7);
          if (strippedValue.length > 0) {
            if (doc.events[eventName]) {
              doc.events[eventName][`custom:${strippedValue}`] = event[`custom:${strippedValue}`];
            }
          }
        }
      }
    }

    /**
     * @dev this function is intended to be used only to parse the `receive` and `fallback` function so far.
     * Caution if using this function to parse the Natspec of other methods from the AST
     */
    const parseNatspecFromAST = (functionName: 'receive' | 'fallback', functionASTNode: any) => {
      const tags = functionASTNode.documentation.text.split('@');

      tags.forEach((natspecTag: any) => {
        if (natspecTag.replace(' ', '').length === 0) {
          return;
        }

        if (natspecTag.startsWith('dev ')) {
          doc.methods[`${functionName}()`].details = natspecTag.replace('dev ', '').trim();
        }

        if (natspecTag.startsWith('notice ')) {
          doc.methods[`${functionName}()`].notice = natspecTag.replace('notice ', '').trim();
        }

        // add custom any `@custom:` tags
        if (natspecTag.startsWith('custom:')) {
          const customTagName = natspecTag.substring('custom:'.length, natspecTag.trim().indexOf(' '));
          doc.methods[`${functionName}()`][`custom:${customTagName}`] = natspecTag.replace(
            `custom:${customTagName} `,
            '',
          );
        }
      });
    };

    // transform the code field in the user doc from `fallback() external` to `fallback(bytes calldata paramName) external returns (bytes memory)`
    const modifyFallbackFunctionSyntax = (fallbackASTNode: any) => {
      const paramVariableName = fallbackASTNode.parameters.parameters[0].name;
      const returnVariableName = fallbackASTNode.returnParameters.parameters[0].name;
      const { stateMutability } = fallbackASTNode;

      let newFallbackCode = 'fallback(bytes calldata';

      if (paramVariableName !== '') {
        newFallbackCode += ` ${paramVariableName}`;
      }

      newFallbackCode += `) external ${stateMutability} returns (bytes memory`;

      if (returnVariableName !== '') {
        newFallbackCode += ` ${returnVariableName}`;
      }

      newFallbackCode += ')';

      doc.methods['fallback()'].code = newFallbackCode;
    };

    const parseParamsAndReturnNatspecsForFallback = (fallbackASTNode: any) => {
      const paramDoc = fallbackASTNode.documentation.text
        .match(/@.*/g)
        .filter((text: string) => text.match(/@param.*/));

      if (paramDoc.length !== 0) {
        const paramName = fallbackASTNode.parameters.parameters[0].name;
        doc.methods['fallback()'].inputs[paramName] = {
          type: 'bytes',
          description: paramDoc[0].replace(`@param ${paramName} `, ''),
        };
      }

      const returnDoc = fallbackASTNode.documentation.text
        .match(/@.*/g)
        .filter((text: string) => text.match(/@return.*/));

      if (returnDoc.length !== 0) {
        const returnVariableName =
          fallbackASTNode.returnParameters.parameters[0].name === ''
            ? ''
            : fallbackASTNode.returnParameters.parameters[0].name;

        doc.methods['fallback()'].outputs[returnVariableName] = {
          type: 'bytes',
          description: returnDoc[0].replace(`@return ${returnVariableName} `, ''),
        };
      }
    };

    const parseNatspecFromFallback = (fallbackASTNode: any) => {
      parseNatspecFromAST('fallback', fallbackASTNode);

      // parse any @param or @return tags if fallback function is written as
      // `fallback(bytes calldata fallbackParam) external <payable> returns (bytes memory)`
      //
      // Note: we should ideally have only a single `@param` or `@return` tag in this case
      parseParamsAndReturnNatspecsForFallback(fallbackASTNode);

      // modify the code if the fallback is written as `fallback(bytes calldata fallbackParam) external <payable> returns (bytes memory)`
      if (
        fallbackASTNode.parameters.parameters.length === 1 &&
        fallbackASTNode.returnParameters.parameters.length === 1
      ) {
        modifyFallbackFunctionSyntax(fallbackASTNode);
      }
    };

    // Natspec docs from `receive()` and `fallback()` functions are not included in devdoc or userdoc
    // Need to be fetched manually from AST
    const AST = buildInfo?.output.sources[source].ast.nodes;

    // find all AST nodes that are `contract`
    const contractNode = AST.filter((node: any) => node.contractKind === 'contract')[0];

    if (doc.methods['receive()'] !== undefined) {
      const receiveASTNode = contractNode.nodes.find((node: any) => node.kind === 'receive');

      if (receiveASTNode !== undefined && receiveASTNode.hasOwnProperty('documentation')) {
        parseNatspecFromAST('receive', receiveASTNode);
      } else {
        // search in the parent contracts
        // eslint-disable-next-line no-lonely-if
        if (contractNode.hasOwnProperty('baseContracts')) {
          contractNode.baseContracts.forEach((baseContract: any) => {
            for (const inheritedSource in buildInfo?.output.sources) {
              const inheritedContractAST = buildInfo?.output.sources[inheritedSource].ast.nodes.filter(
                (node: any) => node.contractKind === 'contract',
              );

              if (
                inheritedContractAST.length > 0 &&
                baseContract.baseName.referencedDeclaration === inheritedContractAST[0].id
              ) {
                const receiveParentASTNode = inheritedContractAST[0].nodes.find(
                  (node: any) => node.kind === 'receive',
                );

                if (
                  receiveParentASTNode !== undefined &&
                  receiveParentASTNode.hasOwnProperty('documentation')
                ) {
                  parseNatspecFromAST('receive', receiveParentASTNode);
                  // stop searching as soon as we find the most overriden function in the most derived contract
                  break;
                }
              }
            }
          });
        }
      }
    }

    if (doc.methods['fallback()'] !== undefined) {
      // look for the `fallback()` function
      const fallbackASTNode = contractNode.nodes.find((node: any) => node.kind === 'fallback');

      if (fallbackASTNode !== undefined && fallbackASTNode.hasOwnProperty('documentation')) {
        parseNatspecFromFallback(fallbackASTNode);
      } else {
        // search in the parent contracts
        // eslint-disable-next-line no-lonely-if, no-prototype-builtins
        if (contractNode.hasOwnProperty('baseContracts')) {
          contractNode.baseContracts.forEach((baseContract: any) => {
            for (const inheritedSource in buildInfo?.output.sources) {
              const inheritedContractAST = buildInfo?.output.sources[inheritedSource].ast.nodes.filter(
                (node: any) => node.contractKind === 'contract',
              );

              if (
                inheritedContractAST.length > 0 &&
                baseContract.baseName.referencedDeclaration === inheritedContractAST[0].id
              ) {
                const fallbackParentASTNode = inheritedContractAST[0].nodes.find(
                  (node: any) => node.kind === 'fallback',
                );

                if (
                  fallbackParentASTNode !== undefined &&
                  fallbackParentASTNode.hasOwnProperty('documentation')
                ) {
                  parseNatspecFromFallback(fallbackParentASTNode);

                  // stop searching as soon as we find the most overriden function in the most derived contract
                  break;
                }
              }
            }
          });
        }
      }
    }

    for (const methodSig in info.devdoc?.methods) {
      const method = info.devdoc?.methods[methodSig];

      if (doc.methods[methodSig] !== undefined) {
        doc.methods[methodSig].details = method?.details;

        for (const param in method?.params) {
          if (doc.methods[methodSig].inputs) {
            if (doc.methods[methodSig].inputs[param]) {
              doc.methods[methodSig].inputs[param].description = method?.params[param];
            }
          }
        }

        for (const output in method?.returns) {
          if (doc.methods[methodSig].outputs) {
            if (doc.methods[methodSig].outputs[output]) {
              doc.methods[methodSig].outputs[output].description = method?.returns[output];
            }
          }
        }
      }

      for (const value in method) {
        if (value.startsWith('custom:')) {
          const strippedValue = value.substring(7);
          if (strippedValue.length > 0) {
            if (doc.methods[methodSig]) {
              doc.methods[methodSig][`custom:${strippedValue}`] = method[`custom:${strippedValue}`];
            }
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
        if (doc.methods[varNameWithParams].inputs[param]) {
          doc.methods[varNameWithParams].inputs[param].description = variable?.params[param];
        }
      }

      for (const output in variable?.returns) {
        if (doc.methods[varNameWithParams].outputs[output]) {
          doc.methods[varNameWithParams].outputs[output].description = variable?.returns[output];
        }
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
      if (!fs.existsSync(path.join(config.outputDir, <string>docs[i].path))) {
        if (config.libraries.length === 0) {
          await fs.promises.mkdir(path.join(config.outputDir, <string>docs[i].path), {
            recursive: true,
          });
        } else {
          const relativeFilePath = filteredQualifiedNames[i].split(':')[0];
          let { outputDir } = config;

          outputDir = config.libraries.includes(relativeFilePath)
            ? `${config.outputDir}/libraries`
            : `${config.outputDir}/contracts`;

          try {
            await fs.promises.access(outputDir);
          } catch (e) {
            await fs.promises.mkdir(outputDir);
          }

          await fs.promises.mkdir(path.join(outputDir, <string>docs[i].path), {
            recursive: true,
          });
        }
      }
      docfileName = path.join(<string>docs[i].path, docfileName);
      testFileName = path.join(<string>docs[i].path, testFileName);
    }

    if (config.libraries.length === 0) {
      await fs.promises.writeFile(path.join(config.outputDir, docfileName), result, {
        encoding: 'utf-8',
      });
    } else {
      const relativeFilePath = filteredQualifiedNames[i].split(':')[0];
      let { outputDir } = config;

      outputDir = config.libraries.includes(relativeFilePath)
        ? `${config.outputDir}/libraries`
        : `${config.outputDir}/contracts`;

      try {
        await fs.promises.access(outputDir);
      } catch (e) {
        await fs.promises.mkdir(outputDir);
      }

      await fs.promises.writeFile(path.join(outputDir, docfileName), result, {
        encoding: 'utf-8',
      });
    }

    if (config.debugMode) {
      if (config.libraries.length === 0) {
        await fs.promises.writeFile(
          path.join(config.outputDir, testFileName),
          JSON.stringify(docs[i], null, 4),
          {
            encoding: 'utf-8',
          },
        );
      } else {
        const relativeFilePath = filteredQualifiedNames[i].split(':')[0];
        let { outputDir } = config;

        outputDir = config.libraries.includes(relativeFilePath)
          ? `${config.outputDir}/libraries`
          : `${config.outputDir}/contracts`;

        try {
          await fs.promises.access(outputDir);
        } catch (e) {
          await fs.promises.mkdir(outputDir);
        }

        await fs.promises.writeFile(path.join(outputDir, testFileName), JSON.stringify(docs[i], null, 4), {
          encoding: 'utf-8',
        });
      }
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
