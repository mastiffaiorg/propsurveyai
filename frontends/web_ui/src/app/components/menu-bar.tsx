import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, FolderOpenIcon, SaveIcon } from "lucide-react";

export function MenuBar() {
  return (
    <nav
      className="flex flex-wrap justify-center sm:justify-end space-x-2 space-y-2 sm:space-y-0"
    >
      <Button
        variant="outline"
        className="flex items-center text-blue-700 border-blue-700 hover:bg-blue-50 font-semibold"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        <PlusCircleIcon className="w-4 h-4 mr-2" />
        New Project
      </Button>
      <Button
        variant="outline"
        className="flex items-center text-blue-700 border-blue-700 hover:bg-blue-50 font-semibold"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        <FolderOpenIcon className="w-4 h-4 mr-2" />
        Open Project
      </Button>
      <Button
        variant="outline"
        className="flex items-center text-blue-700 border-blue-700 hover:bg-blue-50 font-semibold"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        <SaveIcon className="w-4 h-4 mr-2" />
        Save Project
      </Button>
    </nav>
  );
}
