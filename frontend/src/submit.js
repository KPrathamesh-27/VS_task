// submit.js

import { useState } from 'react';
import { useStore } from "./store";
import axios from "axios";
import React from 'react';

const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert">
        <h2>Submission Results</h2>
        <p className="custom-alert-message" dangerouslySetInnerHTML={{ __html: message }} />
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/pipelines/parse", {
        nodes,
        edges,
      });
      const { num_nodes, num_edges, is_dag } = response.data;
      const message = `The pipeline contains <strong class="highlight">${num_nodes}</strong> nodes and <strong class="highlight">${num_edges}</strong> edges. It is ${
        is_dag ? "" : "not "
      }a Directed Acyclic Graph (DAG).`;
      setAlertMessage(message);
    } catch (error) {
      console.error("Error submitting pipeline:", error);
      setAlertMessage("Failed to submit pipeline. Please try again.");
    }
  };

  const closeAlert = () => {
    setAlertMessage(null);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button type="button" onClick={handleSubmit}>Submit</button>
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
    </div>
  );
};
