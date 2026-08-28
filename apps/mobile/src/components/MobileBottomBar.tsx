import {
  BookOpen,
  Images,
  Video,
  Upload,
  Music,
  type LucideIcon,
} from "lucide-react-native";
import { useNavStore } from "../../../../packages/core/stores/useNavStore";
import { useRef } from "react";
import { useImportStore } from "../../../../packages/core/stores/useImportStore";
import type { Screen } from "../../../../packages/core/types/global";
import { Pressable, Text, View } from "react-native";

export interface NavItem {
  id: Screen;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: "book", label: "Books", icon: BookOpen },
  { id: "image", label: "Images", icon: Images },
  { id: "import", label: "Import", icon: Upload },
  { id: "video", label: "Videos", icon: Video },
  { id: "audio", label: "Audio", icon: Music },
];

export interface NavButtonProps extends NavItem {
  isActive: boolean;
  onPress: () => void;
}

// export interface ImportButtonProps extends NavItem {
//   isActive: boolean;
// }

function NavButton({ label, icon: Icon, isActive, onPress }: NavButtonProps) {
  return (
    <Pressable
      className="flex-1 flex flex-col items-center justify-center"
      onPress={onPress}
    >
      <View
        className={`transition-transform duration-300 ease-out ${
          isActive ? "-translate-y-6 scale-125" : "translate-y-0 scale-100"
        }`}
      >
        <Icon className="w-8 h-8" strokeWidth={isActive ? 2.5 : 1.7} />
      </View>
      <Text className={`text-md ${isActive ? "font-bold" : ""}`}>{label}</Text>
    </Pressable>
  );
}

function ImportButton({
  label,
  icon: Icon,
  isActive,
  onPress,
}: NavButtonProps) {
  const startImporting = useImportStore((state) => state.startImporting);

  const filesInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const setDeferred = useNavStore((state) => state.setDeferred);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    importType: "files" | "folder",
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    startImporting(fileArray, importType);
    e.target.value = "";
    setDeferred(false);
  };

  return (
    <>
      {/* <input
        type="file"
        ref={filesInputRef}
        multiple
        className="hidden"
        onChange={(e) => handleFileChange(e, "files")}
      />
      <input
        type="file"
        ref={folderInputRef}
        // @ts-expect-error its just way to pick directory
        webkitdirectory=""
        className="hidden"
        onChange={(e) => handleFileChange(e, "folder")}
      /> */}
      <Pressable
        className="relative flex-1 flex flex-col items-center justify-center"
        onPress={onPress}
      >
        <View
          className={`transition-transform duration-300 ease-out ${
            isActive ? "-translate-y-6 scale-125" : "translate-y-0 scale-100"
          }`}
        >
          <Icon className="w-8 h-8" strokeWidth={isActive ? 2.5 : 1.7} />
        </View>
        <Text className="text-md">{label}</Text>
        {isActive && (
          <View className="absolute bottom-full mb-10 bg-secondary flex flex-col w-40 h-26 gap-2 rounded-2xl text-lg">
            <Pressable
              className="flex-1"
              onPress={() => filesInputRef.current?.click()}
            >
              Import Files
            </Pressable>
            <Pressable
              className="flex-1"
              onPress={() => folderInputRef.current?.click()}
            >
              Import a Folder
            </Pressable>
          </View>
        )}
      </Pressable>
    </>
  );
}

function MobileBottomBar() {
  const activeScreen = useNavStore((state) => state.activeScreen);
  const setScreen = useNavStore((state) => state.setScreen);
  const setDeferred = useNavStore((state) => state.setDeferred);
  return (
    <View className="h-20 px-4 py-2 mt-4 rounded-t-xl flex flex-row gap-2 bg-secondary text-text">
      {NAV_ITEMS.map((item) =>
        item.id !== "import" ? (
          <NavButton
            key={item.id}
            {...item}
            isActive={activeScreen === item.id}
            onPress={() => {setDeferred(false); setScreen(item.id);}}
          />
        ) : (
          <ImportButton
            key={item.id}
            {...item}
            isActive={activeScreen === item.id}
            onPress={() => {setDeferred(true); setScreen(item.id);}}
          />
        ),
      )}
    </View>
  );
}

export default MobileBottomBar;
