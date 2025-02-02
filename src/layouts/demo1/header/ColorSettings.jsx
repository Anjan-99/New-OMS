"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KeenIcon } from "@/components";

const ColorSettings = () => {
  const [open, setOpen] = useState(false);
  const [colors, setColors] = useState({
    buy: "#00A261",
    sell: "#E42855",
    future: "#272A34",
    option: "#E42855",
    equity: "#883FFF",
    market: "#006AE6",
    limit: "#C59A00",
  });

  useEffect(() => {
    const storedColors = localStorage.getItem("tradingColors");
    if (storedColors) {
      setColors(JSON.parse(storedColors));
    }
  }, []);

  const handleColorChange = (key, event) => {
    const newColor = event.target.value;
    setColors((prevColors) => ({
      ...prevColors,
      [key]: newColor,
    }));
  };

  const handleReset = () => {
    const color = {
      buy: "#00A261",
      sell: "#E42855",
      future: "#272A34",
      option: "#E42855",
      equity: "#883FFF",
      market: "#006AE6",
      limit: "#C59A00",
    };
    localStorage.setItem("tradingColors", JSON.stringify(color));
    setOpen(false);
    window.location.reload();
  };

  const handleSave = () => {
    localStorage.setItem("tradingColors", JSON.stringify(colors));
    setOpen(false);
    window.location.reload();
  };

  return (
    <div>
      {/* Button to Open Dialog */}
      <div className="bg-linear-65 from-purple-500 to-pink-500">
        <button
          onClick={() => setOpen(true)}
          className="btn btn-icon text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
        >
          <KeenIcon icon="color-swatch" />
        </button>
      </div>
      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trading Colors</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="card-body grid gap-5 lg:gap-7.5 lg:py-7.5 py-5">
              <div className="grid grid-cols-2 gap-5">
                {Object.entries(colors).map(([key, color]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between border border-gray-300 rounded-md p-3.5"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {key}
                      </span>
                    </div>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(key, e)}
                      className="w-8 h-8 cursor-pointer rounded-md dark:bg-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          </DialogBody>
          <div className="flex justify-end px-4 pb-2">
            <button onClick={handleSave} className="btn btn-primary">
              Save
            </button>
            <button onClick={handleReset} className="btn btn-light ms-2">
              Reset
            </button>
          </div>
          <DialogDescription>
            <div className="text-center text-gray-500 pb-2">
              * The page will be refreshed to apply the changes in colors *
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ColorSettings };