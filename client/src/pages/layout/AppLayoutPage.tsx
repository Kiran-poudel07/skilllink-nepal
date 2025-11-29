import { Layout } from "antd";
import { Sidebar } from "../../component/sidebar/sidebar";
import HeaderBar from "../../component/header/header";
import { Navigate, Outlet } from "react-router";
import type { UserRole } from "../../config/constant";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth.context";
import { toast } from "sonner"
const { Sider, Header, Content } = Layout;
const AppLayout = ({ role }: { role: UserRole }) => {
  const [collapsed, setCollapsed] = useState(true);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, []);

  useEffect(() => {
    const handleCollapse = () => setCollapsed(true);
    window.addEventListener("collapseEverything", handleCollapse);
    return () => window.removeEventListener("collapseEverything", handleCollapse);
  }, []);

  const { loggedInUser } = useAuth();

  if (!loggedInUser) {
    toast.error("Login First!!", {
      description: "Please login first in order to access this page!!!"
    });
    return <Navigate to="/auth" />;
  }

  if (loggedInUser.role !== role) {
    toast.error("Unauthorized", {
      description: "You do not have access to this page!"
    });
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        {!collapsed && (
          <Sider
            width={isMobile ? "100%" : 230}
            collapsedWidth={0}
            theme="dark"
            style={{
              background: "#001529",
              position: isMobile ? "fixed" : "relative",
              inset: isMobile ? 0 : "auto",
              height: "100vh",
              overflowY: "auto",
              zIndex: 1000,
              transition: "none",
              paddingTop: isMobile ? 64 : 0,
            }}
          >
            <Sidebar collapsed={false} role={role} />
          </Sider>
        )}

        <Layout>
          {!collapsed && (
            <Header
              style={{
                background: "#004c7f",
                position: isMobile ? "fixed" : "relative",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1100,
                height: 64,
              }}
              className="px-4 flex justify-between items-center shadow-sm"
            >
              <button onClick={() => setCollapsed(true)} className="text-xl p-1">
                ☰
              </button>
              <HeaderBar />
            </Header>
          )}

          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="
              fixed top-3 left-3 z-50 
              bg-black/80 text-white
              w-6 h-6 flex items-center justify-center
              rounded-full text-[10px]
            "
            >
              ☰
            </button>
          )}

          <Content
            style={{
              margin: collapsed ? "0" : "20px",
              padding: collapsed ? 0 : 20,
              height: "100vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: collapsed ? "0" : "12px",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AppLayout;
