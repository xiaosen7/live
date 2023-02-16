import {Component} from "react";
// import {connect} from "react-redux";
import {connect} from "../react-redux-nut";
import {bindActionCreators} from "../redux-nut";
import {decrement, increment} from "../store/counterSlice";

// HOC（higher order Component）
// 高阶组件，是个函数、参数是组件、并且返回一个新的组件
export default connect(
  // mapStateToProps 把state映射到props
  (state, ownProps) => {
    return state;
  },
  // mapDispatchToProps  undefined | object | function
  {
    increment: () => increment(),
    decrement: () => decrement(),
  }

  // (dispatch, ownProps) => {
  //   let creators = {
  //     increment: () => increment(),
  //     decrement: () => decrement(),
  //   };
  //   creators = bindActionCreators(creators, dispatch);
  //   return {dispatch, ...creators};
  // }
)(
  class ReactReduxPage extends Component {
    render() {
      console.log(
        "%c [  ]-33",
        "font-size:13px; background:pink; color:#bf2c9f;",
        this.props
      );
      const {counter, dispatch} = this.props;

      return (
        <div>
          <h1>ReactReduxPage</h1>
          <p>{counter.value}</p>
          <button onClick={() => dispatch(increment())}>
            dispatch increment
          </button>
          <button onClick={this.props.increment}>increment</button>
          <button onClick={this.props.decrement}>decrement</button>
        </div>
      );
    }
  }
);
