import React, {useRef} from './react';
import ReactDOM from './react-dom';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </div>
  );
}
ReactDOM.render(<Form />, document.getElementById('root'));


// export function createConnection(serverUrl, roomId) {
//   // A real implementation would actually connect to the server
//   return {
//     connect() {
//       console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
//     },
//     disconnect() {
//       console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
//     }
//   };
// }

// function ChatRoom({ roomId }) {
//   const [serverUrl, setServerUrl] = useState('https://localhost:1234');

//   useEffect(() => {
//     const connection = createConnection(serverUrl, roomId);
//     connection.connect();
//     return () => {
//       connection.disconnect();
//     };
//   }, [roomId, serverUrl]);

//   return (
//     <div>
//       <label>
//         Server URL:{' '}
//         <input
//           value={serverUrl}
//           onInput={e => setServerUrl(e.target.value)}
//         />
//       </label>
//       <h1>Welcome to the {roomId} room!</h1>
//     </div>
//   );
// }

// export default function App() {
//   const [roomId, setRoomId] = useState('general');
//   const [show, setShow] = useState(false);
//   return <div>
//       <label>
//         Choose the chat room:{' '}
//         <select
//           value={roomId}
//           onChange={e => setRoomId(e.target.value)}
//         >
//           <option value="general">general</option>
//           <option value="travel">travel</option>
//           <option value="music">music</option>
//         </select>
//       </label>
//       <button onClick={() => setShow(!show)}>
//         {show ? 'Close chat' : 'Open chat'}
//       </button>
//       {show && <hr />}
//       {show && <ChatRoom roomId={roomId} />}
//     </div>
// }
// ReactDOM.render(<App />, document.getElementById('root'));

// const initialState = {count: 0};

// function reducer(state, action) {
//   switch (action.type) {
//     case 'increment':
//       return {count: state.count + 1};
//     case 'decrement':
//       return {count: state.count - 1};
//     default:
//       throw new Error();
//   }
// }

// function Counter() {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   return (
//     <div>
//       Count: {state.count}
//       <button onClick={() => dispatch({type: 'decrement'})}>-</button>
//       <button onClick={() => dispatch({type: 'increment'})}>+</button>
//     </div>
//   );
// }

// ReactDOM.render(<Counter />, document.getElementById('root'));

// class Greeting extends React.PureComponent {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     console.log(this.props)
//     // console.log("Greeting was rendered at", new Date().toLocaleTimeString());
//     return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
//   }
// }

// const Greeting = React.memo(function Greeting({ name }) {
//   console.log("Greeting was rendered at", new Date().toLocaleTimeString());
//   return <h3>Hello{name && ', '}{name}!</h3>;
// });

// // const Greeting = function Greeting({ name }) {
// //   console.log("Greeting was rendered at", new Date().toLocaleTimeString());
// //   return <h3>Hello{name && ', '}{name}!</h3>;
// // };


// class MyApp extends React.Component {
//   constructor(props){
//     super(props)
//     this.state = {name: '', address: ''}
//   }

//   setName = (newName) => {
//     this.setState({name: newName})
//   }
//   setAddress = (newAddress) => {
//     this.setState({address: newAddress})
//   }
//   render(){
//     return <div>
//       <label>
//         Name{': '}
//         <input onInput={e => {
//           this.setName(e.target.value)
//         }} />
//       </label>
//       <label>
//         Address{': '}
//         <input onInput={e => {
//           this.setAddress(e.target.value)
//         }} />
//       </label>
//       <Greeting name={this.state.name} />
//     </div> 
//   };
// }

// ReactDOM.render(<MyApp />, document.getElementById('root'));
// class ScrollingList extends React.Component {
//   counter = 0
//   isAppend = true
//   intervalId = 0
//   constructor(props) {
//     super(props);
//     this.listRef = React.createRef();
//     this.state = {list: []}
//   }
//   // https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate
//   // 1.该函数在render函数执行完成生成真实DOM后，DOM挂载到页面前执行
//   // 2.该函数使得组件在DOM发生变化之前可以获取一些信息
//   // 3.该函数返回的任何值都会作为componentDidUpdate的第三个参数传入
//   // 4.该生命周期函数并不常用，仅仅在一些特定UI变化的场景才会用到
//   getSnapshotBeforeUpdate(prevProps, prevState) {
//     // Are we adding new items to the list?
//     // Capture the scroll position so we can adjust scroll later.
//     if (prevState.list.length < this.state.list.length) {
//       const list = this.listRef.current;
//       return list.scrollHeight - list.scrollTop;
//     }
//     return null;
//   }

//   componentDidUpdate(prevProps, prevState, snapshot) {
//     // If we have a snapshot value, we've just added new items.
//     // Adjust scroll so these new items don't push the old ones out of view.
//     // (snapshot here is the value returned from getSnapshotBeforeUpdate)
//     if (snapshot !== null) {
//       const list = this.listRef.current;
//       list.scrollTop = list.scrollHeight - snapshot;
//     }
//   }

//   appendData = () => {
//     if(this.isAppend){
//       this.intervalId = setInterval(()=>{
//         this.setState({
//           list: [...this.state.list, this.counter++]
//         })
//       },1000)
//     }else{
//       clearInterval(this.intervalId)
//     }
//     this.isAppend = !this.isAppend
//   }

//   render() {
//     return (<div>
//       <input type="button" onClick={()=>this.appendData()}  value={"追加/暂停追加数据"}/>
//       <div  ref={this.listRef} style={{overflow: 'auto', height:'400px', background: '#efefef'}}>
//         {
//           this.state.list.map(item => {
//             return <div key={item} style={{
//               height: '60px',
//               padding: '10px',
//               marginTop: '10px',
//               border: '1px solid blue',
//               borderRadius: '6px'
//             }}>{item}</div>
//           })
//         }
//       </div>
      
//       </div>
//     );
//   }
// }
// ReactDOM.render(<ScrollingList/>, document.getElementById('root'));

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