import { createReducer, createActionCreator, createNextState } from "../";

describe("createReducer", () => {
  describe("alternative builder callback for actionMap", () => {
    const increment = createActionCreator("increment");
    const decrement = createActionCreator("decrement");

    test("can be used with string types", () => {
      const reducer = createReducer(0, (builder) =>
        builder
          .addCase(increment.type, (state, action) => state + action.payload)
          .addCase(decrement.type, (state, action) => state - action.payload)
      );
      expect(reducer(0, increment(5))).toBe(5);
      expect(reducer(5, decrement(5))).toBe(0);
    });
  });
});

function behavesLikeReducer(todosReducer) {
  it("should handle initial state", () => {
    const initialAction = { type: "", payload: undefined };
    expect(todosReducer(undefined, initialAction)).toEqual([]);
  });

  it("should handle ADD_TODO", () => {
    expect(
      todosReducer([], {
        type: "ADD_TODO",
        payload: { newTodo: { text: "Run the tests" } },
      })
    ).toEqual([
      {
        text: "Run the tests",
        completed: false,
      },
    ]);

    expect(
      todosReducer(
        [
          {
            text: "Run the tests",
            completed: false,
          },
        ],
        {
          type: "ADD_TODO",
          payload: { newTodo: { text: "Use Redux" } },
        }
      )
    ).toEqual([
      {
        text: "Run the tests",
        completed: false,
      },
      {
        text: "Use Redux",
        completed: false,
      },
    ]);

    expect(
      todosReducer(
        [
          {
            text: "Run the tests",
            completed: false,
          },
          {
            text: "Use Redux",
            completed: false,
          },
        ],
        {
          type: "ADD_TODO",
          payload: { newTodo: { text: "Fix the tests" } },
        }
      )
    ).toEqual([
      {
        text: "Run the tests",
        completed: false,
      },
      {
        text: "Use Redux",
        completed: false,
      },
      {
        text: "Fix the tests",
        completed: false,
      },
    ]);
  });

  it("should handle TOGGLE_TODO", () => {
    expect(
      todosReducer(
        [
          {
            text: "Run the tests",
            completed: false,
          },
          {
            text: "Use Redux",
            completed: false,
          },
        ],
        {
          type: "TOGGLE_TODO",
          payload: { index: 0 },
        }
      )
    ).toEqual([
      {
        text: "Run the tests",
        completed: true,
      },
      {
        text: "Use Redux",
        completed: false,
      },
    ]);
  });
}
