// NodeContainer.js
import { Handle } from "reactflow";
import { Box } from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";
import { TextField, Typography, Select, FormControl, InputLabel} from "@mui/material";
import debounce from "lodash/debounce";

export const CustomHandle = ({ id, type, position, top }) => {
  console.log(`CustomHandle created: id=${id}`);
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      style={{ position: "absolute", top: `${top}%`, zIndex: 1 }}
    />
  );
};

export const NodeContainer = ({ children, height, className }) => {
return (
    <Box
        className={className}
        sx={{
            fontFamily: "Parkinsans",
            height: height,
            width: "250px",
            border: "2px #0B2447",
            padding: "10px",
            position: "relative",
            borderRadius: 1,
            backgroundColor: "#d7edfc",
            boxShadow: "0 0 10px #19376D",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
                boxShadow: "0 0 20px #295F98",
            },
        }}
    >
        {children}
    </Box>
);
};

export const NodeComponent = ({
  id,
  data,
  type,
  isInput,
  handles = [],
  textarea = false,
  additionalContent,
}) => {
  const [name, setName] = useState(
    data?.[`${type}Name`] ||
      id.replace(`${type.toUpperCase()}-`, `${type.toLowerCase()}_`)
  );
  const [nodeType, setNodeType] = useState(data?.[`${type}Type`] || "Text");
  const [text, setText] = useState(data?.text || "");
  const [variables, setVariables] = useState(new Set());
  const [variableHandles, setVariableHandles] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 250, height: 80 });
  const inputRef = useRef(null);

  useEffect(() => {
    console.log(`Name updated to: ${name}`);
  }, [name]);

  useEffect(() => {
    console.log("Variables in the node:", variables);
  }, [variables]);

  useEffect(() => {
    console.log("Handles in the node:", handles);
  }, [handles]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    const variablePattern = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g;
    const foundVariables = new Set();
    let match;

    while ((match = variablePattern.exec(newText)) !== null) {
      foundVariables.add(match[1]);
      console.log(match[1]);
    }

    setVariables(foundVariables);
    setVariableHandles([...foundVariables]);
  };

  const renderInputOutputNode = () => {
    if (type !== "Input" && type !== "Output") {
      return null;
    }

    const isInput = type === "Input";
    return (
      <div
        key={id}
        style={{
          position: "absolute",
          top: 130,
          [isInput ? "right" : "left"]: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            transform: `translate(${
              isInput ? name.length * 5 + 20 : -name.length * 5 - 20
            }px)`,
            display: "inline-block",
          }}
        >
          {name}
        </span>
      </div>
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetDimensions = useCallback(
    debounce((height) => {
      setDimensions((prev) => ({
        ...prev,
        height: Math.max(height, 80),
      }));
    }, 5),
    [setDimensions] 
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "80px";
      const scrollHeight = Math.min(
        Math.max(inputRef.current.scrollHeight, 20),
        100000
      );
      inputRef.current.style.height = `${scrollHeight}px`;
      debouncedSetDimensions(scrollHeight);
    }

    return () => {
      debouncedSetDimensions.cancel();
    };
  }, [text, debouncedSetDimensions]);

  return (
    <NodeContainer
      id={id}
      className="node-container"
      height={
        type === "Text"
          ? dimensions.height + 60
          : 225 && type === "LLM"
          ? 80
          : 225
      }
    >
      <Typography
        variant="h6"
        style={{
          fontFamily: "Parkinsans",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        {type}
      </Typography>

      {isInput || type === "Text" || type === "LLM" ? (
        <CustomHandle type="source" position="right" id={`${id}-value`} />
      ) : (
        <CustomHandle type="target" position="left" id={`${id}-value`} />
      )}

      {textarea && (
        <div>
          <label style={{ fontFamily: "Parkinsans" }}>
            Text:
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleTextChange}
              style={{
                fontFamily: "Parkinsans",
                width: "100%",
                height: dimensions.height,
                font: "inherit",
                borderRadius: "5px",
                boxSizing: "border-box",
                overflow: "hidden",
                resize: "none",
              }}
            />
          </label>
        </div>
      )}

      {additionalContent}

      {handles.map((handle) => (
        <CustomHandle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          top={handle.top}
        />
      ))}

      {variableHandles.map((variable, index) => (
        <div
          key={variable}
          style={{
            position: "absolute",
            top: 40 + index * 30,
            left: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              transform: `translate(-${variable.length * 5 + 20}px, ${
                10 + index * 5
              }px)`,
              display: "inline-block",
            }}
          >{`${variable}`}</span>
          <CustomHandle
            type="target"
            position="left"
            id={`input-${index}-${variable}`}
          />
        </div>
      ))}

      {type !== "Text" && type !== "LLM" && (
        <div style={{ fontFamily: "Parkinsans"}}>
          <FormControl variant="outlined" margin="normal" fullWidth>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              style={{ background: "#fff" }}
            />
          </FormControl>
          <FormControl variant="outlined" margin="normal" fullWidth>
            <InputLabel htmlFor="node-type">Type</InputLabel>
            <Select
              native
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value)}
              label="Type"
              inputProps={{
                name: "type",
                id: "node-type",
              }}
              style={{ backgroundColor: "#fff"}}
            >
              <option value="Text" style={{ fontFamily: "Parkinsans" }}>
                Text
              </option>
              {isInput ? (
                <option value="File" style={{ fontFamily: "Parkinsans" }}>
                  File
                </option>
              ) : null}
              {!isInput ? (
                <option value="Image" style={{ fontFamily: "Parkinsans" }}>
                  Image
                </option>
              ) : null}
            </Select>
          </FormControl>
        </div>
      )}
      {renderInputOutputNode()}
    </NodeContainer>
  );
};