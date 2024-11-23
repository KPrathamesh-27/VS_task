// inputNode.js

import { NodeComponent } from './nodeContainer';

export const InputNode = ({ id, data }) => {
  return <NodeComponent id={id} data={data} type="Input" isInput={true} />;
};