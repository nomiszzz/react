import { findDomByVNode, updateDomTree } from './react-dom';
import { deepClone } from './utils'
export let updaterQueue = {
  isBatch: false,
  updaters: new Set()
}

// 清空updaterQueue
export function flushUpdaterQueue() {
  updaterQueue.isBatch = false;
  for (const updater of updaterQueue.updaters) {
    // 更新
    updater.launchUpdate();
  }
  // 清空updater
  updaterQueue.updaters.clear();
}


class Updater {
  constructor(ClassComponentInstance) {
    this.ClassComponentInstance = ClassComponentInstance;
    // 用于收集批量更新state
    this.pendingStates = [];
  }

  // 先添加要更新的内容
  addState(partialState) {
    this.pendingStates.push(partialState);
    // 预处理，判断是否需要批量更新state
    this.preHandleForUpdate();
  }

  preHandleForUpdate() {
    // 批量更新
    if (updaterQueue.isBatch) {
      // 往批量更新队列里增加updater
      updaterQueue.updaters.add(this)
    } else {
      // 立即更新
      this.launchUpdate()
    }
  }
  // 最终要更新的是类组件
  launchUpdate(nextProps) {
    const { ClassComponentInstance, pendingStates} = this;
    let prevProps = deepClone(ClassComponentInstance.props);
    let prevState = deepClone(ClassComponentInstance.state);
    if (pendingStates.length === 0 && !nextProps) return
    let isShouldUpdate = true;
    let nextState = this.pendingStates.reduce((preState, newState) => {
      return {
        ...preState,
        ...newState
      }
    }, ClassComponentInstance.state);
    if (ClassComponentInstance.shouldComponentUpdate && !(this.ClassComponentInstance.shouldComponentUpdate(nextProps, nextState))) {
      isShouldUpdate = false;
    }
    // 清空
    this.pendingStates.length = 0;
    if (nextProps) {
      ClassComponentInstance.props = nextProps;
    }
    ClassComponentInstance.state = nextState;
    if (isShouldUpdate) {
      ClassComponentInstance.update(prevProps, prevState);
    }
    
  }
}
export class Component {
  static IS_CLASS_COMPONENT = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    // 用于管理更新状态，传入this是将状态与组件相关联，也就是知道要管理的是哪个组件的状态
    this.updater = new Updater(this)
  }

  setState(partialState) {
    this.updater.addState(partialState)
  }
  /**
   * 更新组件
   * 1.获取依赖新的数据执行render函数后获取的新虚拟dom
   * 2.根据新虚拟dom生成真实dom
   * 3.将真实dom挂载到页面上
   */
  update(prevProps, prevState) {
    let oldVNode = this.oldVNode;
    let oldDom = findDomByVNode(oldVNode);
    if (this.constructor.getDerivedStateFromProps) {
      const newState = this.constructor.getDerivedStateFromProps(this.props, this.state) || {};
      this.state =  {
        ...this.state,
        ...newState,
      }
    }
    let snapshot = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate(prevProps, prevState);
    let newVNode = this.render();
    updateDomTree(oldVNode, newVNode, oldDom);
    this.oldVNode = newVNode;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, snapshot); 
    }
  } 
}