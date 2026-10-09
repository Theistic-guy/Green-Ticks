import { visit } from 'unist-util-visit';

const LANG_MAP = {
  python: 'python',
  py: 'python',
  'c++': 'cpp',
  cpp: 'cpp',
  c: 'c',
  csharp: 'csharp',
  'c#': 'csharp',
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  sh: 'bash',
  shell: 'bash',
  bash: 'bash',
  zsh: 'bash',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',
  sql: 'sql',
  java: 'java',
  text: 'text',
  txt: 'text',
  unset: 'plaintext',
  plaintext: 'plaintext',
};

/**
 * Remark plugin to normalize code block language tags.
 * Ensures case-insensitivity (e.g., 'Python' -> 'python', 'CPP' -> 'cpp')
 * so Shiki syntax highlighter can always identify the correct grammar.
 */
export function remarkNormalizeCodeLang() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang && typeof node.lang === 'string') {
        const cleaned = node.lang.trim().toLowerCase();
        node.lang = LANG_MAP[cleaned] || cleaned;
      }
    });
  };
}
