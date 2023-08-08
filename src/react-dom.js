import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT } from "./utils";
import { addEvent } from './event';

function render(VNode, containerDom) {
  mount(VNode, containerDom);
}

function mount(VNode, containerDom) {
  const newDom = createDom(VNode);
  containerDom.appendChild(newDom)
}

function createDom(VNode) {
  // 1.根据type创建节点 2.根据children创建子节点 3.处理props
  const { type, props, ref } = VNode;
  let dom
  if (type && type.$$typeof === REACT_FORWARD_REF) {
    return getDomByRefForwardFunction(VNode);
  }
  // class组件
  if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT && type.IS_CLASS_COMPONENT) {
    return getDomByClassComponent(VNode);
  } else if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT) { // 函数组件
    return getDomByFunctionComponent(VNode)
  }
  if (type && VNode.$$typeof === REACT_TEXT) {
    dom = document.createTextNode(props.text);
  }
  else if (type && VNode.$$typeof === REACT_ELEMENT) {
    dom = document.createElement(type)
  }
  if (props) {
    if (props.children && typeof props.children === 'object' && props.children.type) {
      mount(props.children, dom)
    } else if (Array.isArray(props.children)) {
      mountArray(props.children, dom)
    }
  }
  setPropsForDOM(dom, props);
  VNode.dom = dom
  // 传递ref引用和赋值
  // dom创建成功的时候，解决原生标签赋值ref的问题
  ref && (ref.current = dom)
  return dom
}

function mountArray(children, parent) {
  if (!Array.isArray(children)) render;
  const length = children.length
  for (let i = 0; i < length; i++) {
    children[i].index = i;
    mount(children[i], parent)
  }
}

function setPropsForDOM(dom, VNodeProps = {}) {
  if (!dom) return;
  for (let key in VNodeProps) {
    // 如果是children不处理
    if (key === 'children') continue;
    // 如是是事件
    if (/^on[A-Z].*/.test(key)) {
      // 绑定事件
      addEvent(dom, key.toLowerCase(), VNodeProps[key])
    } else if (key === 'style') {
      Object.keys(VNodeProps[key]).forEach(styleName => {
        dom.style[styleName] = (VNodeProps[key])[styleName]
      })
    } else {
      // 如果是普通属性则处理属性
      // 如果用函数setAttribute(key, VNodeProps[key])，则需要对key值进行转化
      // dom上的属性名称和jsx的属性名称基本一致，但和我们编写html时候的属性名称是有差异的，需要注意
      // 在官方文档上有关于属性名称的说明：https://reactjs.org/docs/introducing-jsx.html
      // Since JSX is closer to JavaScript than to HTML, React DOM uses camelCase property naming convention instead of HTML attribute names.
      // For example, class becomes className in JSX, and tabindex becomes tabIndex.
      dom[key] = VNodeProps[key]
    }
  }
}

function getDomByFunctionComponent(VNode) {
  const { type, props } = VNode;
  const renderVNode = type(props);
  if (!renderVNode) return null;
  return createDom(renderVNode);
}

function getDomByClassComponent(VNode) {
  const {type, props, ref} = VNode;
  const renderInstance = new type(props);
  // 类组件ref是返回类组件的实例
  ref && (ref.current = renderInstance)
  const renderVNode = renderInstance.render();
  renderInstance.oldVNode = renderVNode;
  if (!renderVNode) return null;
  return createDom(renderVNode)
}


function getDomByRefForwardFunction(VNode) {
  const {type, props, ref} = VNode;
  const renderVNode = type.render(props, ref);
  if (!renderVNode) return null;
  return createDom(renderVNode)
}

export function findDomByVNode(VNode) {
  if (!VNode) return;
  if (VNode.dom) return VNode.dom;
}

export function updateDomTree(oldVNode, newVNode, oldDom) {
  if (!oldDom) return;
  // let parentNode = oldDom.parentNode;
  // parentNode.removeChild(oldDom);
  // parentNode.appendChild(createDom(newVNode))
  const typeMap = {
    NO_OPERATE: !oldVNode && !newVNode,
    ADD: !oldVNode && newVNode,
    DELETE: oldVNode && !newVNode,
    REPLACE: oldVNode && newVNode && oldVNode.type !== newVNode.type
  }
  let UPDATE_TYPE = Object.keys(typeMap).filter(key => typeMap[key])[0];
  switch (UPDATE_TYPE) {
    case 'NO_OPERATE':
      break;
    case 'ADD':
      oldDom.parentNode.appendChild(createDom(newVNode));
      break;
    case 'DELETE':
      removeVNode(oldVNode);
      break;
    case 'REPLACE':
      removeVNode(oldDom);
      oldDom.parentNode.appendChild(createDom(newVNode));
      break;
    default:
      deepDOMDiff(oldVNode, newVNode)
      break;
  }
}

function removeVNode(VNode) {
  const currentDome = findDomByVNode(VNode);
  if (currentDome) {
    currentDome.remove()
  }
}

function deepDOMDiff(oldVNode, newVNode) {

}

const ReactDOM = {
  render
}

export default ReactDOM