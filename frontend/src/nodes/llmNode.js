// llmNode.js

import { NodeComponent } from './nodeContainer';

export const LLMNode = ({ id , data}) => {
  const handles = [
    { type: "target", position: "left", id: `${id}-system`, top: 33 },
    { type: "target", position: "left", id: `${id}-prompt`, top: 67 },
    { type: "source", position: "right", id: `${id}-response` }
  ];

  const additionalContent = (
    <div><span>This is an LLM node.</span></div>
  );

  return (
    <NodeComponent
      id={id}
      type="LLM"
      isInput={false}
      handles={handles}
      additionalContent={additionalContent}
    />
  );
};