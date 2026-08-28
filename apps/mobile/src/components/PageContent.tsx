import type { ReactNode } from "react";
import TopBar from "./TopBar";
import { View } from "react-native";

interface PageContentProps {
    children: ReactNode;
}

function PageContent({ children }: PageContentProps) {

  return (
    <View className="flex flex-1 flex-col text-text min-h-0">
      <TopBar />
      <View className="flex-1 p-4 min-h-0 overflow-y-auto">
        {children}
      </View>
    </View>
  );
}

export default PageContent;