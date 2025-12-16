export type Role = "Doctor" | "Patient";

export interface TopbarProps {
  clinicName: string;
  role: Role;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

export interface SidebarItemProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarProps {
  items: Array<Pick<SidebarItemProps, "label" | "icon">>;
  activeIndex: number;
  onSelect: (index: number) => void;
  collapsed?: boolean;
}

export interface DashboardContentProps {
  title: string;
  description?: string;
}
