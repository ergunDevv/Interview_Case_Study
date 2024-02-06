import Asset from "./Asset";
import React from "react";
import { useDrag } from "react-dnd";

const DraggableAsset = ({ asset }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "ASSET",
    item: { type: asset.type, src: asset.src },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={dragRef} className={`asset ${isDragging ? "dragging" : ""}`}>
      <Asset type={asset.type} src={asset.src} />
    </div>
  );
};

export default DraggableAsset;
