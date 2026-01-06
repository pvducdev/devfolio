// source: https://github.com/radix-ui/primitives/blob/main/packages/react/use-controllable-state/src/use-controllable-state.tsx

import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { isFunction } from "@/lib/utils.ts";

type ChangeHandler<T> = (state: T) => void;
type SetStateFn<T> = Dispatch<SetStateAction<T>>;

interface UseControllableStateParams<T> {
  prop?: T | undefined;
  defaultProp: T;
  onChange?: ChangeHandler<T>;
}

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>): [T, SetStateFn<T>] {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] =
    useUncontrolledState({
      defaultProp,
      onChange,
    });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;

  const setValue = useCallback<SetStateFn<T>>(
    (nextValue) => {
      if (isControlled) {
        const nextVal = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (nextVal !== prop) {
          onChangeRef.current?.(nextVal);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef]
  );

  return [value, setValue];
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, "prop">): [
  Value: T,
  setValue: Dispatch<SetStateAction<T>>,
  OnChangeRef: RefObject<ChangeHandler<T> | undefined>,
] {
  const [value, setValue] = useState(defaultProp);
  const prevValueRef = useRef(value);

  const onChangeRef = useRef(onChange);
  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value);
      prevValueRef.current = value;
    }
  }, [value]);

  return [value, setValue, onChangeRef];
}
