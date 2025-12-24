import type { BaseAction, BaseSearchItem, SearchItem } from "./types";

export interface ActionContext {
  navigate: (path: string) => void;
  close?: () => void;
}

export interface ActionHandler<TAction extends BaseAction = BaseAction> {
  type: TAction["type"];
  execute(action: TAction, context: ActionContext): void | Promise<void>;
}

export class ActionRegistry<TAction extends BaseAction = BaseAction> {
  private readonly handlers = new Map<string, ActionHandler<TAction>>();

  register<T extends TAction>(handler: ActionHandler<T>): () => void {
    this.handlers.set(handler.type, handler as ActionHandler<TAction>);

    return () => {
      this.unregister(handler.type);
    };
  }

  unregister(type: string): void {
    this.handlers.delete(type);
  }

  has(type: string): boolean {
    return this.handlers.has(type);
  }

  async execute(action: TAction, context: ActionContext): Promise<void> {
    const handler = this.handlers.get(action.type);

    if (!handler) {
      throw new ActionError(
        `No handler registered for action type: ${action.type}`,
        "NO_HANDLER"
      );
    }

    await handler.execute(action, context);
  }

  getRegisteredTypes(): string[] {
    return [...this.handlers.keys()];
  }
}

export class ActionError extends Error {
  readonly code: ActionErrorCode;
  override readonly cause?: unknown;

  constructor(message: string, code: ActionErrorCode, cause?: unknown) {
    super(message);
    this.name = "ActionError";
    this.code = code;
    this.cause = cause;
  }
}

export type ActionErrorCode = "NO_HANDLER" | "EXECUTION_FAILED";

export function executeItemAction<TItem extends BaseSearchItem = SearchItem>(
  item: TItem & { action: BaseAction },
  registry: ActionRegistry,
  context: ActionContext
): Promise<void> {
  return registry.execute(item.action, context);
}
