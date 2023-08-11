import React from 'react';
import ReactDOM from 'react-dom';
class ScrollingList extends React.Component {
  counter = 0
  isAppend = true
  intervalId = 0
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.state = {list: []}
  }
  // https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate
  // 1.该函数在render函数执行完成生成真实DOM后，DOM挂载到页面前执行
  // 2.该函数使得组件在DOM发生变化之前可以获取一些信息
  // 3.该函数返回的任何值都会作为componentDidUpdate的第三个参数传入
  // 4.该生命周期函数并不常用，仅仅在一些特定UI变化的场景才会用到
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevState.list.length < this.state.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  appendData = () => {
    if(this.isAppend){
      this.intervalId = setInterval(()=>{
        this.setState({
          list: [...this.state.list, this.counter++]
        })
      },1000)
    }else{
      clearInterval(this.intervalId)
    }
    this.isAppend = !this.isAppend
  }

  render() {
    return (<div>
      <input type="button" onClick={()=>this.appendData()}  value={"追加/暂停追加数据"}/>
      <div  ref={this.listRef} style={{overflow: 'auto', height:'400px', background: '#efefef'}}>
        {
          this.state.list.map(item => {
            return <div key={item} style={{
              height: '60px',
              padding: '10px',
              marginTop: '10px',
              border: '1px solid blue',
              borderRadius: '6px'
            }}>{item}</div>
          })
        }
      </div>
      
      </div>
    );
  }
}
ReactDOM.render(<ScrollingList/>, document.getElementById('root'));

// class TextItem extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       arr: this.oldArr
//     }
//   }
//   componentWillUnmount() {
//     console.log('componentWillUnmount')
//   }
//   render() {
//     return <div>{this.props.text}</div>
//   }
// }
// class Text extends React.Component {
//   oldArr = ['A', 'B', 'C', 'D', 'E'];
//   newArr = ['C', 'B', 'E', 'F', 'A'];
//   isReset = false
//   constructor(props) {
//     super(props);
//     this.state = {
//       arr: this.oldArr
//     }
//   }
//   componentDidMount() {
//     console.log('componentDidMount')
//   }

//   updateArr() {
//     this.setState({
//       arr: this.isReset ? this.oldArr : this.newArr
//     })
//     this.isReset = !this.isReset
//   }

//   shouldComponentUpdate(nextProps, nextState) {
//     console.log('shouldComponentUpdate')
//     return true;
//   }
  
//   render() {
//     return (
//       <div>
//         <button onClick={() => this.updateArr()}>change</button>
//         <div>
//           {
//           this.state.arr.map((i) => (
//             <div>{i}</div>
//           ))
//           }
//         </div>
//       </div>
//     )
//   }
// }

// function Text2() {
//   return (<div>1</div>)
// }

// ReactDOM.render(<Text />, document.getElementById('root'))

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <div>
//     hello react simple
//   </div>
// );
// ReactDOM.render(<div style={{color: 'red'}}>hello react simple</div>, document.getElementById('root'))
// console.log(<div>hello react simple<span>xx1</span><span>xxx2</span></div>)
// 函数组件
// function MyFunctionComponent(props){
//   return <div className='test-class' style={{color: 'red'}}>Simple React App<span>{props.xx}</span><span>xx2</span></div>
// }
// 类组件
// class CustomTextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     // create a ref to store the textInput DOM element
//     this.textInput = React.createRef();
//     this.focusTextInput = this.focusTextInput.bind(this);
//   }

//   focusTextInput() {
//     // Explicitly focus the text input using the raw DOM API
//     // Note: we're accessing "current" to get the DOM node
//     this.textInput.current.focus();
//   }

//   render() {
//     // tell React that we want to associate the <input> ref
//     // with the `textInput` that we created in the constructor
//     return (
//       <div>
//         <input
//           type="text"
//           ref={this.textInput} />
//         <input
//           type="button"
//           value="Focus the text input"
//           onClick={this.focusTextInput}
//         />
//       </div>
//     );
//   }
// }

// class AutoFocusTextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.textInput = React.createRef();
//   }

//   componentDidMount() {
//     this.textInput.current.focusTextInput();
//   }

//   render() {
//     return (
//       <CustomTextInput ref={this.textInput} />
//     );
//   }
// }
// ReactDOM.render(<CustomTextInput />, document.getElementById('root'))