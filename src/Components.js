import { findDomByVnode, updateDomTree } from './react-dom';
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
  launchUpdate() {
    const { ClassComponentInstance, pendingStates} = this;
    if (pendingStates.length === 0) return
    ClassComponentInstance.state = this.pendingStates.reduce((prev, curt) => {
      return {
        ...prev,
        ...curt
      }
    }, this.ClassComponentInstance.state);
    // 清空
    this.pendingStates.length = 0;
    this.ClassComponentInstance.update()
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
  update() {
    let oldVNode = this.oldVNode;
    let oldDom = findDomByVnode(oldVNode);
    let newVNode = this.render();
    updateDomTree(oldDom, newVNode);
    this.oldVNode = newVNode
  } 
}