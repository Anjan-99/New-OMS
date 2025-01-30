"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KeenIcon } from "@/components";

const ShortcutKeysInformation = () => {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    { key: "Shift + B", description: "Select Buy Order" },
    { key: "Shift + S", description: "Select Sell Order" },
    { key: "Shift + M", description: "Select Market Order" },
    { key: "Shift + L", description: "Select Limit Order" },
    { key: "Shift + E", description: "Select Equity Segment" },
    { key: "Shift + F", description: "Select Future Segment" },
    { key: "Shift + O", description: "Select Option Segment" },

  ];

  return (
    <div>
      {/* Button to Open Dialog */}
      <button onClick={() => setOpen(true)} className="btn btn-icon btn-light">
        <KeenIcon icon="key" />
      </button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shortcut Keys For OMS</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="card-body grid gap-5 lg:gap-7.5 lg:py-7.5 py-5">
              <div className="grid grid-cols-2 gap-5">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {shortcut.key}
                      </span>
                      <span className="text-2sm text-gray-700">
                        {shortcut.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ShortcutKeysInformation };
