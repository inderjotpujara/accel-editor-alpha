/**
 * File icon utilities for different file types.
 */

export function getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const fullName = fileName.toLowerCase();
  
  // special files (check full name first)
  if (fullName === 'pom.xml') {
    return 'i-ph:package-duotone';
  }

  if (
    fullName === 'build.gradle' ||
    fullName === 'build.gradle.kts' ||
    fullName === 'settings.gradle' ||
    fullName === 'settings.gradle.kts'
  ) {
    return 'i-ph:gear-duotone';
  }

  if (fullName === 'package.json') {
    return 'i-ph:package-duotone';
  }

  if (fullName === 'dockerfile' || fullName.startsWith('dockerfile.')) {
    return 'i-ph:container-duotone';
  }

  if (fullName === 'docker-compose.yml' || fullName === 'docker-compose.yaml') {
    return 'i-ph:stack-duotone';
  }

  if (fullName === 'readme.md' || fullName === 'readme.txt') {
    return 'i-ph:info-duotone';
  }

  if (fullName === '.gitignore' || fullName === '.gitattributes') {
    return 'i-ph:git-branch-duotone';
  }

  if (fullName === 'maven-wrapper.properties' || fullName === 'gradle-wrapper.properties') {
    return 'i-ph:wrench-duotone';
  }
  
  switch (extension) {
    case 'js':
    case 'jsx': {
      return 'i-ph:file-js-duotone';
    }
    case 'ts':
    case 'tsx': {
      return 'i-ph:file-ts-duotone';
    }
    case 'py': {
      return 'i-ph:file-py-duotone';
    }
    case 'java': {
      return 'i-ph:coffee-duotone';
    }
    case 'kt':
    case 'kts': {
      return 'i-ph:diamond-duotone';
    }
    case 'scala': {
      return 'i-ph:spiral-duotone';
    }
    case 'groovy': {
      return 'i-ph:code-duotone';
    }
    case 'html':
    case 'htm': {
      return 'i-ph:file-html-duotone';
    }
    case 'css':
    case 'scss':
    case 'sass':
    case 'less': {
      return 'i-ph:file-css-duotone';
    }
    case 'json':
    case 'jsonc': {
      return 'i-ph:brackets-curly-duotone';
    }
    case 'yaml':
    case 'yml': {
      return 'i-ph:list-duotone';
    }
    case 'xml':
    case 'xsd':
    case 'xsl': {
      return 'i-ph:file-code-duotone';
    }
    case 'properties': {
      return 'i-ph:gear-duotone';
    }
    case 'sql': {
      return 'i-ph:database-duotone';
    }
    case 'md':
    case 'markdown': {
      return 'i-ph:file-text-duotone';
    }
    case 'txt':
    case 'log': {
      return 'i-ph:file-text-duotone';
    }
    case 'svg': {
      return 'i-ph:image-duotone';
    }
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'bmp': {
      return 'i-ph:image-duotone';
    }
    case 'pdf': {
      return 'i-ph:file-pdf-duotone';
    }
    case 'zip':
    case 'jar':
    case 'war':
    case 'tar':
    case 'gz': {
      return 'i-ph:file-archive-duotone';
    }
    case 'sh':
    case 'bat':
    case 'cmd': {
      return 'i-ph:terminal-duotone';
    }
    default: {
      return 'i-ph:file-duotone';
    }
  }
}

export function getFileTypeColor(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const fullName = fileName.toLowerCase();

  // special files
  if (fullName === 'pom.xml') {
    return 'text-orange-600';
  }

  if (
    fullName === 'build.gradle' ||
    fullName === 'build.gradle.kts' ||
    fullName === 'settings.gradle' ||
    fullName === 'settings.gradle.kts'
  ) {
    return 'text-green-600';
  }

  if (fullName === 'package.json') {
    return 'text-green-500';
  }

  if (fullName === 'dockerfile' || fullName.startsWith('dockerfile.')) {
    return 'text-blue-600';
  }

  if (fullName === 'docker-compose.yml' || fullName === 'docker-compose.yaml') {
    return 'text-blue-500';
  }

  if (fullName === 'readme.md' || fullName === 'readme.txt') {
    return 'text-blue-400';
  }

  if (fullName === '.gitignore' || fullName === '.gitattributes') {
    return 'text-orange-500';
  }
  
  switch (extension) {
    case 'js':
    case 'jsx': {
      return 'text-yellow-500';
    }
    case 'ts':
    case 'tsx': {
      return 'text-blue-500';
    }
    case 'py': {
      return 'text-green-500';
    }
    case 'java': {
      return 'text-orange-500';
    }
    case 'kt':
    case 'kts': {
      return 'text-purple-500';
    }
    case 'scala': {
      return 'text-red-500';
    }
    case 'groovy': {
      return 'text-blue-600';
    }
    case 'html':
    case 'htm': {
      return 'text-red-500';
    }
    case 'css':
    case 'scss':
    case 'sass':
    case 'less': {
      return 'text-blue-400';
    }
    case 'json':
    case 'jsonc': {
      return 'text-yellow-600';
    }
    case 'yaml':
    case 'yml': {
      return 'text-purple-400';
    }
    case 'xml':
    case 'xsd':
    case 'xsl': {
      return 'text-orange-400';
    }
    case 'properties': {
      return 'text-gray-500';
    }
    case 'sql': {
      return 'text-blue-700';
    }
    case 'md':
    case 'markdown': {
      return 'text-gray-400';
    }
    case 'sh':
    case 'bat':
    case 'cmd': {
      return 'text-green-400';
    }
    default: {
      return 'text-bolt-elements-textSecondary';
    }
  }
}
