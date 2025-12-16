import { MouseEventHandler } from "react";

interface OverlayProps {
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLDivElement>;
}

export default function Overlay({ isOpen, onClose }: OverlayProps) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden="true"
    />
  );
}
