import React from './react';
import ReactDOM from './react-dom';

class TextItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: this.oldArr
    }
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
  }
  render() {
    return <div>{this.props.text}</div>
  }
}
class Text extends React.Component {
  oldArr = ['A', 'B', 'C', 'D', 'E'];
  newArr = ['C', 'B', 'E', 'F', 'A'];
  isReset = false
  constructor(props) {
    super(props);
    this.state = {
      arr: this.oldArr
    }
  }
  componentDidMount() {
    console.log('componentDidMount')
  }

  updateArr() {
    this.setState({
      arr: this.isReset ? this.oldArr : this.newArr
    })
    this.isReset = !this.isReset
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate')
    return true;
  }
  
  render() {
    return (
      <div>
        <button onClick={() => this.updateArr()}>change</button>
        <div>
          {
          this.state.arr.map((i) => (
            <div>{i}</div>
          ))
          }
        </div>
      </div>
    )
  }
}

function Text2() {
  return (<div>1</div>)
}

ReactDOM.render(<Text />, document.getElementById('root'))

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