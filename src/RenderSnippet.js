import React from "react";

export default function ({ text, highlight }) {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <p>
      {parts.map((item, i) =>
        item.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="searchmatch">
            {item}
          </span>
        ) : (
          item
        )
      )}
    </p>
  );
}
