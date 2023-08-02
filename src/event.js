import { updaterQueue, flushUpdaterQueue } from './Components';
export function addEvent(dom, eventName, bindFunction) {
  // dom.attach 用来记住当前dom上绑定了什么事件
  dom.attach = dom.attach || {};
  dom.attach[eventName] = bindFunction
  if(document[eventName]) return;
  document[eventName] = dispatchEvent
}
// nativeEvent此刻是document上绑定事件的原生事件对象
function dispatchEvent(nativeEvent) {
  // 事件处理均需要采取批量更新
  updaterQueue.isBatch = true;
  // 根据原生事件对象生成合成事件对象
  let syntheticEvent = createSyntheticEvent(nativeEvent)
  // 冒泡阶段从内到外
  let target = syntheticEvent.target;
  while(target) {
    // 随事件冒泡去修改合成事件的currentTarget
    syntheticEvent.currentTarget = target;
    let eventName = `on${nativeEvent.type}`;
    let bindFunction = target.attach && target.attach[eventName];
    bindFunction && bindFunction(syntheticEvent);
    if (syntheticEvent.isPropagationStopped) {
      break
    }
    target = target.parentNode
  }
  // 执行完之后清空updaterQueue
  flushUpdaterQueue()
}

function createSyntheticEvent(nativeEvent) {
  let nativeEventKeyValues = {}
  for(let key in nativeEvent){
    nativeEventKeyValues[key] = typeof nativeEvent[key] === 'function'? nativeEvent[key].bind(nativeEvent) : nativeEvent[key]
  }
  let syntheticEvent = Object.assign(nativeEventKeyValues, {
    nativeEvent,
    isDefaultPrevented: false,
    isPropagationStopped: false,
    preventDefault: function () {
      this.isDefaultPrevented = true;
      if (this.nativeEvent.preventDefault) {
        this.nativeEvent.preventDefault();
      } else {
        this.nativeEvent.returnValue = false;
      }
    },
    stopPropagation: function () {
      this.isPropagationStopped = true;
      if (this.nativeEvent.stopPropagation) {
        this.nativeEvent.stopPropagation();
      } else {
        this.nativeEvent.cancelBubble = true;
      }
    }
  })
  return syntheticEvent
}