import { Slider } from "../components/Slider";
import { useAudioPlayerStore } from "../stores/useAudioPlayerStore";
import { Modal, type BasicModalProps } from "./Modal";

export function AudioVolumeMenu({ isOpen, onClose }: BasicModalProps) {
  const volume = useAudioPlayerStore((state) => state.volume);
  const setVolume = useAudioPlayerStore((state) => state.setVolume);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={true}>
      <div
        className="absolute flex left-1/2 -translate-x-1/2 bg-black/50 border border-white bottom-full mb-2 h-36 lg:h-42 rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Slider
          orientation="v"
          length={"40"}
          min={0}
          max={100}
          step={0.5}
          value={volume}
          className="py-2"
          onChange={(val) => {
            setVolume(val);
          }}
        />
      </div>
    </Modal>
  );
}