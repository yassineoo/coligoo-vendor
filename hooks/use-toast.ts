import React, { useEffect, useState } from "react";

export type ToastActionElement = React.ReactElement | null;

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export type ToastProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: ToastVariant;
  className?: string;
};

export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastProps & {
  id: string;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let counter = 0;

function genId(): string {
  if (typeof globalThis?.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  return `toast_${counter}`;
}

type State = {
  toasts: ToasterToast[];
};

type Action =
  | { type: typeof actionTypes.ADD_TOAST; toast: ToasterToast }
  | {
      type: typeof actionTypes.UPDATE_TOAST;
      toast: Partial<ToasterToast> & { id: string };
    }
  | { type: typeof actionTypes.DISMISS_TOAST; toastId?: string }
  | { type: typeof actionTypes.REMOVE_TOAST; toastId?: string };

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const listeners = new Set<(state: State) => void>();
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  for (const l of Array.from(listeners)) {
    try {
      l(memoryState);
    } catch {}
  }
}

const addToRemoveQueue = (toastId: string, delay = TOAST_REMOVE_DELAY) => {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, delay);
  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST: {
      const toasts = [action.toast, ...state.toasts].slice(0, TOAST_LIMIT);
      return { ...state, toasts };
    }
    case actionTypes.UPDATE_TOAST: {
      const toasts = state.toasts.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );
      return { ...state, toasts };
    }
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id));
      }
      const toasts = state.toasts.map((t) =>
        toastId === undefined || t.id === toastId ? { ...t, open: false } : t
      );
      return { ...state, toasts };
    }
    case actionTypes.REMOVE_TOAST: {
      if (action.toastId) {
        const timer = toastTimeouts.get(action.toastId);
        if (timer) {
          clearTimeout(timer);
          toastTimeouts.delete(action.toastId);
        }
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId),
        };
      }
      for (const t of state.toasts) {
        const timer = toastTimeouts.get(t.id);
        if (timer) {
          clearTimeout(timer);
          toastTimeouts.delete(t.id);
        }
      }
      return { ...state, toasts: [] };
    }
    default:
      return state;
  }
};

export type ToastInput = Omit<ToasterToast, "id">;

export function toast(input: ToastInput) {
  const id = genId();
  const update = (props: Partial<ToasterToast>) =>
    dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } });
  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  const remove = () =>
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...input,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        input.onOpenChange?.(open);
        if (!open) dismiss();
      },
    },
  });
  return { id, update, dismiss, remove };
}

export function useToast() {
  const [state, setState] = useState<State>(memoryState);
  useEffect(() => {
    listeners.add(setState);
    setState(memoryState);
    return () => {
      listeners.delete(setState);
    };
  }, []);
  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    remove: (toastId?: string) =>
      dispatch({ type: actionTypes.REMOVE_TOAST, toastId }),
    update: (toast: Partial<ToasterToast> & { id: string }) =>
      dispatch({ type: actionTypes.UPDATE_TOAST, toast }),
  };
}

export default useToast;
