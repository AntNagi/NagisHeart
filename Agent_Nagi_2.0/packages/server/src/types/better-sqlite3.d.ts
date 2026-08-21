declare module "better-sqlite3" {
  interface Statement {
    get(...parameters: readonly unknown[]): unknown;
    all(...parameters: readonly unknown[]): unknown[];
    run(...parameters: readonly unknown[]): unknown;
  }
  interface DatabaseInstance {
    pragma(sql: string): unknown;
    exec(sql: string): void;
    prepare(sql: string): Statement;
    transaction<T>(fn: () => T): () => T;
    close(): void;
  }
  const Database: { new (path: string): DatabaseInstance };
  export default Database;
}
