// components/AssetList.js
import React from "react";
import Asset from "./Asset";

const AssetList = ({ onDragStart }) => {
  return (
    <div>
      <h2>Assets</h2>
      <div className="w-full flex">
        {/* Render a list of assets */}
        <Asset id="1" type="circle" onDragStart={onDragStart} />
        <Asset id="2" type="rectangle" onDragStart={onDragStart} />
        <Asset id="3" type="colorfulSnowflake" onDragStart={onDragStart} />
        <Asset id="4" type="fire" onDragStart={onDragStart} />
        <Asset id="5" type="box" onDragStart={onDragStart} />
        <Asset id="6" type="rain" onDragStart={onDragStart} />
        {/* Add more assets as needed */}
      </div>
    </div>
  );
};

export default AssetList;
