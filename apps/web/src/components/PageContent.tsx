import type { ReactNode } from "react";
import TopBar from "./TopBar";

interface PageContentProps {
    children: ReactNode;
}

function PageContent({ children }: PageContentProps) {

  return (
    <div className="flex flex-1 flex-col text-text min-h-0">
      <TopBar />
      <div className="flex-1 p-4 min-h-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default PageContent;