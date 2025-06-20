/**
 * Project detection utilities for Maven, Gradle, and other project types.
 */

import type { FileMap } from '~/lib/stores/files';

export type ProjectType =
  | 'maven'
  | 'gradle'
  | 'gradle-kotlin'
  | 'node'
  | 'python'
  | 'spring-boot'
  | 'quarkus'
  | 'micronaut'
  | 'unknown';

export interface ProjectInfo {
  type: ProjectType;
  buildFile?: string;
  mainSourceDir?: string;
  testSourceDir?: string;
  resourcesDir?: string;
  dependencies?: string[];
  frameworks?: string[];
}

/**
 * Detect the project type based on files present.
 */
export function detectProjectType(files: FileMap): ProjectInfo {
  const fileNames = Object.keys(files);
  
  // maven project detection
  if (fileNames.includes('pom.xml')) {
    return {
      type: 'maven',
      buildFile: 'pom.xml',
      mainSourceDir: 'src/main/java',
      testSourceDir: 'src/test/java',
      resourcesDir: 'src/main/resources',
      ...detectJavaFrameworks(files),
    };
  }
  
  // gradle project detection
  if (fileNames.includes('build.gradle') || fileNames.includes('build.gradle.kts')) {
    const isKotlinDsl = fileNames.includes('build.gradle.kts');
    return {
      type: isKotlinDsl ? 'gradle-kotlin' : 'gradle',
      buildFile: isKotlinDsl ? 'build.gradle.kts' : 'build.gradle',
      mainSourceDir: 'src/main/java',
      testSourceDir: 'src/test/java',
      resourcesDir: 'src/main/resources',
      ...detectJavaFrameworks(files),
    };
  }
  
  // node.js project detection
  if (fileNames.includes('package.json')) {
    return {
      type: 'node',
      buildFile: 'package.json',
      mainSourceDir: 'src',
      testSourceDir: 'test',
    };
  }
  
  // python project detection
  if (
    fileNames.some((f) => f.endsWith('.py')) ||
    fileNames.includes('requirements.txt') ||
    fileNames.includes('pyproject.toml')
  ) {
    return {
      type: 'python',
      mainSourceDir: '.',
    };
  }
  
  return { type: 'unknown' };
}

/**
 * Detect Java frameworks based on files and dependencies.
 */
function detectJavaFrameworks(files: FileMap): { frameworks: string[] } {
  const frameworks: string[] = [];
  const fileNames = Object.keys(files);
  
  // check for Spring Boot
  if (fileNames.some((f) => f.includes('Application.java') || f.includes('SpringBootApplication'))) {
    frameworks.push('Spring Boot');
  }
  
  // check for configuration files
  if (
    fileNames.includes('src/main/resources/application.properties') ||
    fileNames.includes('src/main/resources/application.yml')
  ) {
    if (!frameworks.includes('Spring Boot')) {
      frameworks.push('Spring');
    }
  }
  
  // check for Quarkus
  if (
    fileNames.includes('src/main/resources/application.properties') &&
    Object.values(files).some((file) => file?.type === 'file' && file.content.includes('quarkus'))
  ) {
    frameworks.push('Quarkus');
  }
  
  // check for Micronaut
  if (fileNames.some((f) => f.includes('Micronaut') || f.includes('micronaut'))) {
    frameworks.push('Micronaut');
  }
  
  return { frameworks };
}

/**
 * Get suggested file structure for a project type.
 */
export function getProjectStructure(projectType: ProjectType): string[] {
  switch (projectType) {
    case 'maven':
    case 'spring-boot': {
      return ['src/main/java', 'src/main/resources', 'src/test/java', 'src/test/resources', 'target/'];
    }
    case 'gradle':
    case 'gradle-kotlin': {
      return ['src/main/java', 'src/main/resources', 'src/test/java', 'src/test/resources', 'build/', 'gradle/'];
    }
    case 'node': {
      return ['src/', 'test/', 'dist/', 'node_modules/'];
    }
    case 'python': {
      return ['src/', 'tests/', '__pycache__/', 'venv/'];
    }
    default: {
      return [];
    }
  }
}

/**
 * Get build commands for a project type.
 */
export function getBuildCommands(projectType: ProjectType): Record<string, string> {
  switch (projectType) {
    case 'maven': {
      return {
        Clean: 'mvn clean',
        Compile: 'mvn compile',
        Test: 'mvn test',
        Package: 'mvn package',
        Install: 'mvn install',
        Run: 'mvn spring-boot:run',
      };
    }
    case 'gradle':
    case 'gradle-kotlin': {
      return {
        Clean: './gradlew clean',
        Build: './gradlew build',
        Test: './gradlew test',
        Run: './gradlew bootRun',
        Assemble: './gradlew assemble',
      };
    }
    case 'node': {
      return {
        Install: 'npm install',
        Build: 'npm run build',
        Test: 'npm test',
        Start: 'npm start',
        Dev: 'npm run dev',
      };
    }
    case 'python': {
      return {
        Install: 'pip install -r requirements.txt',
        Test: 'python -m pytest',
        Run: 'python main.py',
      };
    }
    default: {
      return {};
    }
  }
}
