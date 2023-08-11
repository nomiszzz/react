import { REACT_ELEMENT, REACT_MEMO, REACT_FORWARD_REF, toVNode, shallowEqual } from './utils';

import { Component } from './Components';

class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
      return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }
}

function createElement(type, properties, children) {
  let key = properties.key || '';
  let ref = properties.ref || '';
  // __self,___srouce 是bable处理来的与react无关
  ['__self', '__source', 'key', 'ref'].forEach(key => {delete properties[key]});
  let props = {...properties}
  if (arguments.length > 3) {
    // 多个子元素, 转化成数组
    props.children = Array.prototype.slice.call(arguments, 2).map(toVNode);
  } else {
    // 单个子元素，转化为数组
    props.children = toVNode(children);
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    ref,
    key,
    props
  }
}

// 初始化createRef,也就是创建对象{current: null}
function createRef() { 
  return { current: null };
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render
  }
}

function memo(type, compare = shallowEqual) {
  return {
    $$typeof: REACT_MEMO,
    type,
    compare
  }
}

const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  forwardRef,
  memo
}

export default React