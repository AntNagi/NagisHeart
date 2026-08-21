// 分层边界的强制执行。V4 §3.1 / §12。
//
// 这不是代码风格检查，是架构保证：
//   - core 不许碰 LangGraph / HTTP / 数据库 / UI  → 保住「core 能在 Node 裸跑单测」
//   - runtime 可以依赖 core，反向禁止              → 保住框架可摘除、可评价
//   - graph 节点只能调 Ports，不许直接读文件/跑 SQL → 保住人格规则不渗进编排层
//
// 违反这些边界 = 立项书的框架评价（V4 §13.2）失去可行性。不是小事。

import tseslint from 'typescript-eslint';

/** core 层禁止触碰的东西 */
const CORE_FORBIDDEN = [
  { group: ['@langchain/*', 'langchain', 'langchain/*'], message: 'core 不得依赖 LangGraph/LangChain。框架若渗进 core，就无法把它摘出来评价（V4 §11.3 / §13.2）。编排请放 packages/runtime-langgraph。' },
  { group: ['express', 'fastify', 'hono', 'node:http', 'node:https'], message: 'core 不得依赖 HTTP。网络访问经 ports/ 注入（V4 §3.1）。' },
  { group: ['better-sqlite3', 'sqlite3', 'pg', 'node:sqlite', 'drizzle-orm', 'kysely'], message: 'core 不得依赖数据库驱动。持久化经 ports/ 注入（V4 §3.1）。' },
  { group: ['react', 'preact', 'vue', 'svelte'], message: 'core 不得依赖任何 UI 框架。' },
  { group: ['node:fs', 'node:fs/*', 'fs', 'fs/*'], message: 'core 不得直接读文件。资源加载经 ports/ResourceSource 注入，否则单测要造文件系统。' },
  { group: ['../../server/*', '../../runtime-langgraph/*'], message: 'core 不得反向依赖上层。依赖方向只能是 server → runtime → core。' },
];

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', 'var/**'] },
  ...tseslint.configs.recommended,

  // ── L0–L3：零依赖纯 TS ──────────────────────────────────────────────
  {
    files: ['packages/core/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: CORE_FORBIDDEN }],
      // 资源里的 activation.when 用自写受限求值器，不许 eval（V4 §8.1 口径）
      'no-eval': 'error',
      'no-new-func': 'error',
    },
  },

  // ── L4：LangGraph 编排层 ────────────────────────────────────────────
  {
    files: ['packages/runtime-langgraph/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['../../server/*', '@nagi/server'], message: 'runtime 不得依赖 server。依赖方向：server → runtime → core。' },
        ],
      }],
    },
  },

  // ── Graph 节点：只能调 Ports ────────────────────────────────────────
  {
    files: ['packages/runtime-langgraph/src/nodes/**/*.ts', 'packages/runtime-langgraph/src/edges/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['node:fs', 'node:fs/*', 'fs', 'fs/*'], message: '节点不得直接读资源文件，只能调 Ports（V4 §12）。' },
          { group: ['better-sqlite3', 'sqlite3', 'pg', 'node:sqlite'], message: '节点不得直接执行 SQL，只能调 Ports（V4 §12）。' },
          { group: ['../../server/*', '@nagi/server'], message: 'runtime 不得依赖 server。' },
        ],
      }],
    },
  },
);
