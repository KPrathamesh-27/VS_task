// outputNode.js

import { NodeComponent } from './nodeContainer';

export const OutputNode = ({ id, data }) => {
  return <NodeComponent id={id} data={data} type="Output" isInput={false} />;
};
