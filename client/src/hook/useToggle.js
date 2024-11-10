import React, { useCallback, useEffect, useState } from "react";

// Part 1
const useToggle = (initialState = false) => {
  // Part 2
  const [state, setState] = useState(initialState);

  // Part 3
  const toggle = useCallback(() => setState((state) => !state), []);

  // Part 4
  return [state, toggle]
};

// Part 5
export default useToggle;