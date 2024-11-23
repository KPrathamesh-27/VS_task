// textNode.js

import { NodeComponent } from './nodeContainer';

export const TextNode = ({ id, data}) => {
  const handles = [{ type: "source", position: "right", id: `${id}-response` }];

  return (
    <NodeComponent
      id={id}
      data={data}
      type="Text"
      isInput={false}
      handles={handles}
      textarea={true}
    />
  );
};