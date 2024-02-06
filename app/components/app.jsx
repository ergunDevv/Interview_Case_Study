"use client";
// components/App.js
import React, { useState, useRef } from "react";
import AssetList from "./AssetList";
import "../styles/global.css";
import html2canvas from "html2canvas";

const App = () => {
  const [assets, setAssets] = useState([]);
  const [draggedAsset, setDraggedAsset] = useState(null);
  // const [selectedObjectId, setSelectedObjectId] = useState(null);
  // Export canvas as PNG
  const canvasRef = useRef(null);
  // Import, export data hooks
  const [importedData, setImportedData] = useState("");
  const [exportedData, setExportedData] = useState("");

  const canvasWidth = 400;
  const canvasHeight = 400;

  // Handle import JSON Format Data
  const handleImport = () => {
    if (importedData) {
      try {
        const importedAssets = JSON.parse(importedData);
        setAssets(importedAssets);
        setImportedData("");
        console.log("Import successful:", importedAssets);
      } catch (error) {
        console.error("Error importing data:", error);
      }
    }
  };
  // Handle Export JSON Format Data
  const handleExport = () => {
    const exportedAssets = JSON.stringify(assets, null, 2);
    setExportedData(exportedAssets);
    console.log("Export successful:", exportedAssets);
  };

  const handleDragStart = (event, id, type) => {
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    setDraggedAsset({ id, type, offsetX, offsetY });
  };

  const handleDrag = (event, id) => {
    event.preventDefault();

    if (draggedAsset) {
      const x = event.clientX - draggedAsset.offsetX - 50;
      const y = event.clientY - draggedAsset.offsetY - 118;

      const maxX = canvasWidth - draggedAsset.offsetX;
      const maxY = canvasHeight - draggedAsset.offsetY;

      if (x >= 0 && x <= maxX && y >= 0 && y <= maxY - 25) {
        setAssets((prevAssets) =>
          prevAssets.map((asset) =>
            asset.id === id ? { ...asset, x, y } : asset
          )
        );
      }
    }
  };
  // Handle canvas export as png
  const handleExportPNG = () => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current;
      html2canvas(canvasElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "canvas.png";
        link.href = imgData;
        link.click();
      });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (draggedAsset) {
      const canvasX = event.clientX - event.target.getBoundingClientRect().left;
      const canvasY = event.clientY - event.target.getBoundingClientRect().top;

      const isAlreadyOnCanvas = assets.some(
        (asset) => asset.id === draggedAsset.id
      );

      const newAssetX = Math.max(
        0,
        Math.min(
          canvasX - draggedAsset.offsetX,
          canvasWidth - draggedAsset.offsetX
        )
      );

      const newAssetY = Math.max(
        0,
        Math.min(
          canvasY - draggedAsset.offsetY,
          canvasHeight - draggedAsset.offsetY
        )
      );

      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.id === draggedAsset.id
            ? {
                ...asset,
                x: isAlreadyOnCanvas ? asset.x : newAssetX,
                y: isAlreadyOnCanvas ? asset.y : newAssetY,
              }
            : asset
        )
      );

      if (!isAlreadyOnCanvas) {
        const newAsset = {
          id: assets.length + 1,
          type: draggedAsset.type,
          x: newAssetX,
          y: newAssetY,
        };
        setAssets([...assets, newAsset]);
      }

      setDraggedAsset(null);
    }
  };

  return (
    <div>
      <div className="w-full">
        <div className="flex mt-4">
          <div className="flex flex-col  justify-items-end">
            <div className="flex  items-center  ml-[50px] mb-[50px]">
              <p className="font-medium my-auto mr-4">
                Click button to export canvas as PNG 🖼️
              </p>
              <button
                onClick={handleExportPNG}
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-[200px]  "
              >
                Export as PNG
              </button>
            </div>
            <p className="ml-[50px] font-semibold text-xl">Canvas</p>
            <div
              onClick={(event) => {
                const clickedElement = event.target.closest("div[data-id]");
                if (clickedElement) {
                  const id = parseInt(clickedElement.getAttribute("data-id"));
                  handleAssetClick(id);
                }
              }}
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              style={{
                border: "1px solid #ccc",
                height: "400px",
                width: "400px",
                left: "50px",
                position: "relative",
              }}
              ref={canvasRef}
            >
              {/* Render assets on the canvas */}
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  data-id={asset.id} // Add data-id attribute to identify the asset
                  style={{
                    position: "absolute",
                    left: asset.x,
                    top: asset.y,
                    cursor: "move",
                  }}
                  draggable
                  onDragStart={(event) =>
                    handleDragStart(event, asset.id, asset.type)
                  }
                  onDrag={(event) => handleDrag(event, asset.id)}
                >
                  <img
                    src={`/assets/${asset.type}.svg`}
                    alt={`Asset ${asset.id}`}
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="ml-[300px]">
            <AssetList onDragStart={handleDragStart} />
          </div>
        </div>

        <div className="flex gap-5 w-full pl-[50px] my-4 ">
          <div className="flex flex-col w-[45%]">
            <p className="font-medium">Paste JSON data here for import</p>
            <textarea
              className="border-2 p-2 resize-none w-full"
              placeholder="Paste JSON data here for import"
              value={importedData}
              onChange={(e) => setImportedData(e.target.value)}
              rows={10}
              cols={50}
            />
            <button
              onClick={handleImport}
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-[200px] mx-auto mt-4"
            >
              Import as JSON
            </button>
          </div>
          <div className="flex flex-col  w-[45%]">
            <p className="font-medium">Paste JSON data here for export</p>
            <textarea
              readOnly
              value={exportedData}
              rows={10}
              cols={50}
              className="border-2 p-2 resize-none w-full"
              placeholder="Paste JSON data here for export"
            />
            <button
              onClick={handleExport}
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-[200px] mx-auto mt-4"
            >
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
