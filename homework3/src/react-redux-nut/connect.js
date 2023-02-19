import { useContext, useLayoutEffect, useReducer } from "react";
import { context } from "./context";
import { bindActionCreators } from "../redux-nut";

export function connect(mapStateToProps, mapDispatchToProps) {
  return (Component) => (ownProps) => {
    const store = useContext(context);
    const stateProps = mapStateToProps(store.getState());
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const dispatch = store.dispatch;
    let dispatchProps = {};
    if (typeof mapDispatchToProps === "object" && mapDispatchToProps !== null) {
      dispatchProps = {
        dispatch,
        ...bindActionCreators(mapDispatchToProps, dispatch),
      };
    } else if (typeof mapDispatchToProps === "function") {
      dispatchProps = mapDispatchToProps(dispatch, ownProps);
    }

    useLayoutEffect(() => {
      return store.subscribe(() => {
        forceUpdate();
      });
    }, [forceUpdate]);

    return <Component {...ownProps} {...stateProps} {...dispatchProps} />;
  };
}
