import { ReactNode } from "react";

export const MasonryGrid = ({ children }: { children: ReactNode }) => (
  <div className="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4 [&>*]:mb-6">
    {children}
  </div>
);
