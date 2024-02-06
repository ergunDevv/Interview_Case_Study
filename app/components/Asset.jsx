// components/Asset.js
import React from "react";

const Asset = ({ id, type, onDragStart }) => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData("assetId", id);
    event.dataTransfer.setData("assetType", type);
    onDragStart && onDragStart(event, id, type);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={() => false}
      style={{ border: "1px solid #ccc", margin: "5px", padding: "10px" }}
      className="cursor-pointer"
    >
      <img
        src={`/assets/${type}.svg`}
        alt={`Asset ${id}`}
        style={{ width: "50px", height: "50px" }}
      />
    </div>
  );
};

export default Asset;
