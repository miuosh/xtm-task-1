import React, { useRef, useCallback } from "react";

export default function (fn, delay = 500) {
  const ref = useRef({});

  ref.current.fn = fn;

  const debounce = useCallback(
    (...args) => {
      //clear timer
      if (ref.current.timeout) {
        clearTimeout(ref.current.timeout);
      }

      ref.current.timeout = setTimeout(() => {
        ref.current.fn(...args);
        ref.current.timeout = undefined;
      }, delay);
    },
    [delay]
  );

  return debounce;
}
