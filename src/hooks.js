import { emitUpdateForHooks } from './react-dom';
let hookIndex = 0;
let states = [];

export function resetHookIndex(){
  hookIndex = 0
}

export function useState(initialValue) {
  states[hookIndex] = states[hookIndex] || initialValue;
  const currentIndex = hookIndex;
  function setState(newState) {
    states[currentIndex] = newState;
    emitUpdateForHooks();
  }
  return [states[hookIndex++], setState]
}

export function useReducer(reducer, initialValue) {
  states[hookIndex] = states[hookIndex] || initialValue;
  const currentIndex = hookIndex;
  function dispatch(action) {
    states[currentIndex] = reducer(states[currentIndex], action);
    emitUpdateForHooks();
  }
  return [states[hookIndex++], dispatch];
}

export function useEffect(effectFunction, deps = []) {
  const currentIndex = hookIndex;
  const [destoryFunction, preDeps] = states[hookIndex] || [null, null]
  if (!states[hookIndex] || deps.some((item, index) => item !== preDeps[index])) {
    setTimeout(() => {
      destoryFunction && destoryFunction();
      states[currentIndex] = [effectFunction(), deps]
    })
  }
  hookIndex++;
}

export function useLayoutEffect(effectFunction, deps = []) {
  const currentIndex = hookIndex;
  const [destoryFunction, preDeps] = states[hookIndex] || [null, null]
  if (!states[hookIndex] || deps.some((item, index) => item !== preDeps[index])) {
    queueMicrotask(() => {
      destoryFunction && destoryFunction();
      states[currentIndex] = [effectFunction(), deps]
    })
    
  }
  hookIndex++;
}

export function useRef(initialValue) {
  states[hookIndex] = states[hookIndex] || { current: initialValue };
  return states[hookIndex++]
}

export function useImperativeHandle(ref, dataFactory) {
  ref.current = dataFactory();
}