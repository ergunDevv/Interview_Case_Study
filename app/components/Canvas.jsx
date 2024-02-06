import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import Asset from "./Asset";

const Canvas = () => {
  const [assetsOnCanvas, setAssetsOnCanvas] = useState([]);
  const dropRef = useRef(null);

  const [{ isOver }, drop] = useDrop({
    accept: "ASSET",
    drop: (item) => {
      const { type, ...position } = item;
      setAssetsOnCanvas([...assetsOnCanvas, { type, position }]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="canvas " ref={dropRef}>
      {assetsOnCanvas.map((asset) => (
        <Asset key={asset.id} type={asset.type} position={asset.position} />
      ))}
      {isOver && <div className="drop-indicator" />}
    </div>
  );
};

export default Canvas;
