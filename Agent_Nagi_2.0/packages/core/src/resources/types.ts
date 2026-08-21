import type { ContextBlockKind, ResourceBlock } from "../context/types.js";

export interface ResourceDescriptor extends ResourceBlock {
  readonly version: string;
  readonly contextEnabled: boolean;
  readonly sourcePaths: readonly string[];
}
