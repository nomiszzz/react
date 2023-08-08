export const REACT_ELEMENT = Symbol('react.element');
export const REACT_FORWARD_REF = Symbol('react_forward_ref');
export const REACT_TEXT = Symbol('react_text');

export const toVNode = (node) => {
  return typeof node === 'string' || typeof node === 'number' ? {
    type: REACT_TEXT,
    props: {
      text: node
    }
  } : node
}