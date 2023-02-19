import { createSlice, createAction } from "..";

describe("createSlice", () => {
  describe("when passing slice", () => {
    const { actions, reducer } = createSlice({
      reducers: {
        increment: (state) => state + 1,
      },
      initialState: 0,
      name: "cool",
    });

    it("should create increment action", () => {
      expect(actions.hasOwnProperty("increment")).toBe(true);
    });

    it("should have the correct action for increment", () => {
      expect(actions.increment()).toEqual({
        type: "cool/increment",
        payload: undefined,
      });
    });

    it("should return the correct value from reducer", () => {
      expect(reducer(undefined, actions.increment())).toEqual(1);
    });
  });
});
