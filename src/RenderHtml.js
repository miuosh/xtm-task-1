import React from "react";

const RenderHTML = (props) => (
  <div dangerouslySetInnerHTML={{ __html: props.HTML }}></div>
);

export default RenderHTML;
