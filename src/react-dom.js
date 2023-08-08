import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT, MOVE, CREATE } from "./utils";
import { addEvent } from './event';

function render(VNode, containerDom) {
  mount(VNode, containerDom);
}

function mount(VNode, containerDom) {
  const newDom = createDom(VNode);
  console.log(newDom);
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
  if (type === REACT_TEXT) {
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
    children[i].index = i; // 用在后面的updateChildren中进行仅右移的计算中
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
  let { type, props } = vNode;
  let renderVNode = type(props);
  if (!renderVNode) return null;
  vNode.oldRenderVNode = renderVNode
  let dom = createDOM(renderVNode)
  vNode.dom = dom
  return dom;
}

function getDomByClassComponent(VNode) {
  let { type, props, ref } = vNode;
  let instance = new type(props)
  vNode.classInstance = instance
  ref && (ref.current = instance);
  let renderVNode = instance.render();
  instance.oldVNode = renderVNode
  if (!renderVNode) return null;
  let dom = createDOM(renderVNode);
  if (instance.componentDidMount) instance.componentDidMount();
  return dom
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
  let diffTypeMap = {
    ORIGIN_NODE: typeof oldVNode.type === 'string', // 原生节点
    CLASS_COMPONENT: typeof oldVNode.type === 'function' && oldVNode.type.isReactComponent,
    FUNCTION_COMPONENT: typeof oldVNode.type === 'function',
    TEXT: oldVNode.type === REACT_TEXT
  }
  let DIFF_TYPE = Object.keys(diffTypeMap).filter(key => diffTypeMap[key])[0];
  switch (DIFF_TYPE) {
    case 'ORIGIN_NODE':
      let currentDom = newVNode.dom = findDomByVNode(oldVNode);
      setPropsForDOM(currentDom, newVNode.props);
      updateChildren(currentDom, oldVNode.props.children, newVNode.props.children)
      break;
    case 'CLASS_COMPONENT':
      updateClassComponent(oldVNode, newVNode);
      break;
    case 'FUNCTION_COMPONENT':
      updateFunctionComponent(oldVNode, newVNode)
      break
    case 'TEXT':
      newVNode.dom = findDomByVNode(oldVNode)
      newVNode.dom.textContent = newVNode.props.text;
      break;
    default:
      break;
  }
}

function updateClassComponent(oldVNode, newVNode) {
  // 获取实例，新的实例
  const classInstance = newVNode.classInstance = oldVNode.classInstance;
  // 调用更新
  classInstance.updater.launchUpdate()
}

function updateFunctionComponent(oldVNode, newVNode) {
  let oldDom = findDomByVNode(oldVNode);
  if (!oldDom) return;
  const { type, props } = newVNode;
  // 函数组件本身转化成虚拟dom，其中type是return的函数，type(props)执行完就是要渲染的虚拟dom
  const newRenderVNode = type(props);
  // 无论是函数组件还是类组件最终都会执行updateDomTree
  updateDomTree(oldVNode.oldRenderVNode, newRenderVNode, oldDom);
  newVNode.oldRenderVNode = newRenderVNode
}

// Dom Diff 核心
function updateChildren(parentDom, oldVNodeChildren, newVNodeChildren) {
  oldVNodeChildren = (Array.isArray(oldVNodeChildren) ? oldVNodeChildren : [oldVNodeChildren]).filter(Boolean);
  newVNodeChildren = (Array.isArray(newVNodeChildren) ? newVNodeChildren : [newVNodeChildren]).filter(Boolean);
  let oldKeyChildMap = {};
  oldVNodeChildren.forEach((oldVNode, index) => {
    let oldKey = oldVNode?.key ?? index;
    oldKeyChildMap[oldKey] = oldVNode
  });
  let lastNotChangedIndex = -1;
  // 遍历新的VNode,找到可以复用但需要移动的节点、重新创建的节点、需要删除的节点，余下的都是不用动的节点
  // 动作具体是什么，需要具体记录
  const actions = []
  newVNodeChildren.forEach((newVNode, index) => {
    newVNode.index = index;
    const newKey = newVNode?.key ?? index;
    const oldVNode = oldKeyChildMap(newKey);
    // 如果在oldKeyChildMap中存在就意味着可以复用，找不到就需要重新创建
    if (oldVNode) {
      // 意味着两个虚拟节点是同一条数据则需要深度diff
      deepDOMDiff(oldVNode, newVNode)
      // 更新结束之后
      // diff算法仅右移
      if (lastNotChangedIndex > oldVNode.index ) {
        actions.push({
          type: MOVE,
          index,
          oldVNode,
          newVNode,
        })
      }
      // 删除命中的节点
      delete oldKeyChildMap[newKey];
      // 更新一下位置
      lastNotChangedIndex = Math.max(lastNotChangedIndex, oldVNode.key);
    } else {
      actions.push({
        type: CREATE,
        index,
        newVNode
      })
    }
  })
  // 找到所有要移动的节点, 从actions中查找出type都是move的节点，返回其中的oldVNode,就是可复用但是需要移动的
  const VNodeToMove = actions.filter(action => action.type === MOVE).map(action => action.oldVNode);
  // 找到所有要删除的节点
  // 剩下的就是在新vnodechildren中没有的节点，删除
  const VNodeToDelete = Object.values(oldKeyChildMap)
  // 移动和删除的节点，都从父节点上删除
  VNodeToMove.concat(VNodeToDelete).forEach(oldVNode => {
    const currentDom = findDomByVNode(oldVNode);
    currentDom.remove();
  })
  // 对需要移动以及需要新创建的节点统一插入到正确的位置
  actions.forEach(action => {
    const { index, type, oldVNode, newVNode } = action;
    const childNodes = parentDom.childNodes;
    const childNode = childNodes[index];
    const getDomForInsert = () => {
      if (type === CREATE) {
        return createDom(newVNode)
      }
      if (type === MOVE) {
        return findDomByVNode(oldVNode)
      }
    }
    if (childNode) {
        parentDOM.insertBefore(getDomForInsert(), childNode)
    } else {
        parentDOM.appendChild(getDomForInsert());
    }
  })
}

const ReactDOM = {
  render
}

export default ReactDOM