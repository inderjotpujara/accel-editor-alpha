import { useStore } from '@nanostores/react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from 'react-resizable-panels';
import {
  CodeMirrorEditor,
  type EditorDocument,
  type EditorSettings,
  type OnChangeCallback as OnEditorChange,
  type OnSaveCallback as OnEditorSave,
  type OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/CodeMirrorEditor';
import { IconButton } from '~/components/ui/IconButton';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import { shortcutEventEmitter } from '~/lib/hooks';
import type { FileMap } from '~/lib/stores/files';
import { themeStore } from '~/lib/stores/theme';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { WORK_DIR } from '~/utils/constants';
import { getFileIcon, getFileTypeColor } from '~/utils/fileIcons';
import { renderLogger } from '~/utils/logger';
import { isMobile } from '~/utils/mobile';
import { detectProjectType } from '~/utils/projectDetection';
import { FileBreadcrumb } from './FileBreadcrumb';
import { FileTree } from './FileTree';
import { Terminal, type TerminalRef } from './terminal/Terminal';

interface EditorPanelProps {
  files?: FileMap;
  unsavedFiles?: Set<string>;
  editorDocument?: EditorDocument;
  selectedFile?: string | undefined;
  isStreaming?: boolean;
  onEditorChange?: OnEditorChange;
  onEditorScroll?: OnEditorScroll;
  onFileSelect?: (value?: string) => void;
  onFileSave?: OnEditorSave;
  onFileReset?: () => void;
}

const MAX_TERMINALS = 3;
const DEFAULT_TERMINAL_SIZE = 25;
const DEFAULT_EDITOR_SIZE = 100 - DEFAULT_TERMINAL_SIZE;

const editorSettings: EditorSettings = { tabSize: 2 };

export const EditorPanel = memo(
  ({
    files,
    unsavedFiles,
    editorDocument,
    selectedFile,
    isStreaming,
    onFileSelect,
    onEditorChange,
    onEditorScroll,
    onFileSave,
    onFileReset,
  }: EditorPanelProps) => {
    renderLogger.trace('EditorPanel');

    const theme = useStore(themeStore);
    const showTerminal = useStore(workbenchStore.showTerminal);

    const terminalRefs = useRef<Array<TerminalRef | null>>([]);
    const terminalPanelRef = useRef<ImperativePanelHandle>(null);
    const terminalToggledByShortcut = useRef(false);

    const [activeTerminal, setActiveTerminal] = useState(0);
    const [terminalCount, setTerminalCount] = useState(1);

    const activeFileSegments = useMemo(() => {
      if (!editorDocument) {
        return undefined;
      }

      return editorDocument.filePath.split('/');
    }, [editorDocument]);

    const activeFileUnsaved = useMemo(() => {
      return editorDocument !== undefined && unsavedFiles?.has(editorDocument.filePath);
    }, [editorDocument, unsavedFiles]);

    const projectInfo = useMemo(() => {
      if (!files || Object.keys(files).length === 0) {
        return null;
      }

      return detectProjectType(files);
    }, [files]);

    useEffect(() => {
      const unsubscribeFromEventEmitter = shortcutEventEmitter.on('toggleTerminal', () => {
        terminalToggledByShortcut.current = true;
      });

      const unsubscribeFromThemeStore = themeStore.subscribe(() => {
        for (const ref of Object.values(terminalRefs.current)) {
          ref?.reloadStyles();
        }
      });

      return () => {
        unsubscribeFromEventEmitter();
        unsubscribeFromThemeStore();
      };
    }, []);

    useEffect(() => {
      const { current: terminal } = terminalPanelRef;

      if (!terminal) {
        return;
      }

      const isCollapsed = terminal.isCollapsed();

      if (!showTerminal && !isCollapsed) {
        terminal.collapse();
      } else if (showTerminal && isCollapsed) {
        terminal.resize(DEFAULT_TERMINAL_SIZE);
      }

      terminalToggledByShortcut.current = false;
    }, [showTerminal]);

    const addTerminal = () => {
      if (terminalCount < MAX_TERMINALS) {
        setTerminalCount(terminalCount + 1);
        setActiveTerminal(terminalCount);
      }
    };

    return (
      <PanelGroup direction="vertical">
        <Panel defaultSize={showTerminal ? DEFAULT_EDITOR_SIZE : 100} minSize={20}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={10} collapsible>
              <div className="flex flex-col border-r border-bolt-elements-borderColor h-full">
                <PanelHeader>
                  <div className="i-ph:tree-structure-duotone shrink-0" />
                  <span>Files</span>
                  {projectInfo && projectInfo.type !== 'unknown' && (
                    <div className="ml-auto flex items-center text-xs text-bolt-elements-textSecondary">
                      <div
                        className={classNames(
                          'shrink-0 mr-1',
                          projectInfo.type === 'maven'
                            ? 'i-ph:package-duotone text-orange-600'
                            : projectInfo.type.startsWith('gradle')
                              ? 'i-ph:gear-duotone text-green-600'
                              : projectInfo.type === 'node'
                                ? 'i-ph:package-duotone text-green-500'
                                : 'i-ph:folder-duotone',
                        )}
                      />
                      <span className="capitalize">{projectInfo.type.replace('-', ' ')}</span>
                    </div>
                  )}
                </PanelHeader>
                <FileTree
                  className="h-full"
                  files={files}
                  hideRoot
                  unsavedFiles={unsavedFiles}
                  rootFolder={WORK_DIR}
                  selectedFile={selectedFile}
                  onFileSelect={onFileSelect}
                />
              </div>
            </Panel>
            <PanelResizeHandle />
            <Panel className="flex flex-col" defaultSize={80} minSize={20}>
              {/* File Tab Bar - Similar to VS Code */}
              {editorDocument && (
                <div className="flex items-stretch bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor">
                  <div className="flex items-center px-4 py-2 bg-bolt-elements-background-depth-2 border-r border-bolt-elements-borderColor min-w-0 flex-1 relative">
                    {/* Tab indicator line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                    <div
                      className={classNames(
                        'shrink-0 mr-2',
                        getFileIcon(activeFileSegments?.[activeFileSegments.length - 1] || ''),
                        getFileTypeColor(activeFileSegments?.[activeFileSegments.length - 1] || ''),
                      )}
                    />
                    <span className="text-sm font-medium text-bolt-elements-textPrimary truncate flex-1">
                      {activeFileSegments?.[activeFileSegments.length - 1]}
                    </span>
                    {activeFileUnsaved && (
                      <div className="ml-2 w-2 h-2 rounded-full bg-orange-500 shrink-0" title="Unsaved changes" />
                    )}
                  </div>
                  {activeFileUnsaved && (
                    <div className="flex items-center gap-1 px-3 bg-bolt-elements-background-depth-1">
                      <PanelHeaderButton onClick={onFileSave} className="text-xs px-2 py-1">
                        <div className="i-ph:floppy-disk-duotone mr-1" />
                        Save
                      </PanelHeaderButton>
                      <PanelHeaderButton onClick={onFileReset} className="text-xs px-2 py-1">
                        <div className="i-ph:clock-counter-clockwise-duotone mr-1" />
                        Reset
                      </PanelHeaderButton>
                    </div>
                  )}
                </div>
              )}
              
              {/* Breadcrumb Header - Secondary */}
              {editorDocument && (
                <PanelHeader className="overflow-x-auto bg-bolt-elements-background-depth-1">
                  <div className="flex items-center flex-1 text-xs text-bolt-elements-textSecondary">
                    <FileBreadcrumb pathSegments={activeFileSegments} files={files} onFileSelect={onFileSelect} />
                  </div>
                </PanelHeader>
              )}
              <div className="h-full flex-1 overflow-hidden">
                {editorDocument ? (
                  <CodeMirrorEditor
                    theme={theme}
                    editable={!isStreaming && editorDocument !== undefined}
                    settings={editorSettings}
                    doc={editorDocument}
                    autoFocusOnDocumentChange={!isMobile()}
                    onScroll={onEditorScroll}
                    onChange={onEditorChange}
                    onSave={onFileSave}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-bolt-elements-textSecondary">
                    <div className="text-center">
                      <div className="i-ph:file-duotone text-4xl mb-4 opacity-50"></div>
                      <p className="text-lg">No file selected</p>
                      <p className="text-sm mt-2">Select a file from the file tree to start editing</p>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel
          ref={terminalPanelRef}
          defaultSize={showTerminal ? DEFAULT_TERMINAL_SIZE : 0}
          minSize={10}
          collapsible
          onExpand={() => {
            if (!terminalToggledByShortcut.current) {
              workbenchStore.toggleTerminal(true);
            }
          }}
          onCollapse={() => {
            if (!terminalToggledByShortcut.current) {
              workbenchStore.toggleTerminal(false);
            }
          }}
        >
          <div className="h-full">
            <div className="bg-bolt-elements-terminals-background h-full flex flex-col">
              <div className="flex items-center bg-bolt-elements-background-depth-2 border-y border-bolt-elements-borderColor gap-1.5 min-h-[34px] p-2">
                {Array.from({ length: terminalCount }, (_, index) => {
                  const isActive = activeTerminal === index;

                  return (
                    <button
                      key={index}
                      className={classNames(
                        'flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full',
                        {
                          'bg-bolt-elements-terminals-buttonBackground text-bolt-elements-textPrimary': isActive,
                          'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-terminals-buttonBackground':
                            !isActive,
                        },
                      )}
                      onClick={() => setActiveTerminal(index)}
                    >
                      <div className="i-ph:terminal-window-duotone text-lg" />
                      Terminal {terminalCount > 1 && index + 1}
                    </button>
                  );
                })}
                {terminalCount < MAX_TERMINALS && <IconButton icon="i-ph:plus" size="md" onClick={addTerminal} />}
                <IconButton
                  className="ml-auto"
                  icon="i-ph:caret-down"
                  title="Close"
                  size="md"
                  onClick={() => workbenchStore.toggleTerminal(false)}
                />
              </div>
              {Array.from({ length: terminalCount }, (_, index) => {
                const isActive = activeTerminal === index;

                return (
                  <Terminal
                    key={index}
                    className={classNames('h-full overflow-hidden', {
                      hidden: !isActive,
                    })}
                    ref={(ref) => {
                      terminalRefs.current.push(ref);
                    }}
                    onTerminalReady={(terminal) => workbenchStore.attachTerminal(terminal)}
                    onTerminalResize={(cols, rows) => workbenchStore.onTerminalResize(cols, rows)}
                    theme={theme}
                  />
                );
              })}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    );
  },
);
