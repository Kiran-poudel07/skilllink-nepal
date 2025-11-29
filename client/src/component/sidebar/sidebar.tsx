import { Menu } from "antd";
import {
  UserRoles,
  AdminMenu,
  StudentMenu,
  EmployerMenu,
  type UserRole,
} from "../../config/constant";
import { useAuth } from "../../context/auth.context";

export const Sidebar = ({ collapsed, role }: { collapsed: boolean; role: UserRole }) => {
  const { loggedInUser } = useAuth();

  const items =
    role === UserRoles.ADMIN
      ? AdminMenu
      : role === UserRoles.EMPLOYER
      ? EmployerMenu
      : StudentMenu;

  const collapseAll = () => {
    window.dispatchEvent(new CustomEvent("collapseEverything"));
  };

  return (
    <div className="h-full flex flex-col">

      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-700">
        <img
          src={loggedInUser?.image?.optimizedUrl || ""}
          className="w-16 h-16 rounded-full object-cover border-2 border-white mb-3"
        />
        {!collapsed && (
          <>
            <p className="text-white font-semibold">{loggedInUser?.name}</p>
            <p className="text-gray-300 text-xs italic truncate w-32">
              {loggedInUser?.email}
            </p>
          </>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        items={items}
        onClick={collapseAll}
      />
    </div>
  );
};
