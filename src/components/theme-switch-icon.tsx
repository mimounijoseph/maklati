import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Sun, Moon, Laptop } from "lucide-react";

export default function ThemeSwitchIcon() {
  return (
    <ThemeSwitch
      variant="icon-click"
      modes={["light", "dark", "system"]}
      icons={[
        <Sun key="sun-icon" size={16} />,
        <Moon key="moon-icon" size={16} />,
        <Laptop key="laptop-icon" size={16} />,
      ]}
      showInactiveIcons="all"
    />
  );
}
