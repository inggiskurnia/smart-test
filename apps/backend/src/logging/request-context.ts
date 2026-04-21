import { AsyncLocalStorage } from 'node:async_hooks';

export type Actor = {
  username: string;
  email: string;
  division: string;
  attribute: string;
};

export type RequestContext = {
  requestId: string;
  actor?: Actor;
};

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getCtx(): RequestContext | undefined {
  return requestContext.getStore();
}
