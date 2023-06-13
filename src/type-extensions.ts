import 'hardhat/types/config';
import { HelperFunction } from 'squirrelly/dist/types/containers';

declare module 'hardhat/types/config' {
  export interface HardhatUserConfig {
    dodoc?: {
      include?: string[];
      exclude?: string[];
      libraries?: string[];
      runOnCompile?: boolean;
      debugMode?: boolean;
      templatePath?: string;
      outputDir?: string;
      keepFileStructure?: boolean;
      freshOutput?: boolean;
      helpers?: { helperName: string; helperFunc: HelperFunction }[];
    };
  }

  export interface HardhatConfig {
    dodoc: {
      include: string[];
      exclude: string[];
      libraries: string[];
      runOnCompile: boolean;
      debugMode: boolean;
      templatePath: string;
      outputDir: string;
      keepFileStructure: boolean;
      freshOutput: boolean;
      helpers: { helperName: string; helperFunc: HelperFunction }[];
    };
  }
}
