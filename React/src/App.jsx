import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import SignUp from "./Component/SignUp";
import ProtectedPages from "./Component/ProtectedPages";
import NotLoginPages from "./Component/NotLoginPages";
import Tickets from "./Component/Tickets";
import ReadTicket from "./Component/ReadTicket";
import Login from "./Component/Login";
import { getTickets, loginWithJwt } from "./Service/UserService";

import { Route, Routes, useNavigate } from "react-router-dom";
import Profile from "./Component/Profile";
import CreateTicket from "./Component/CreateTicket";

const { Header, Sider, Content } = Layout;

const menuLoginUser = [
  { key: "1", label: "Profile" },
  { key: "2", label: "My Tickets" },
  { key: "3", label: "Create Ticket" },
  { key: "5", label: "Log out" },
];

const menuLoginAdmin = [
  { key: "1", label: "Profile" },
  { key: "2", label: "My Tickets" },
  { key: "3", label: "Create Ticket" },
  { key: "4", label: "Manage Users Tickets" },
  { key: "5", label: "Log out" },
];

const menuNotLoginItem = [
  { key: "1", label: "Login" },
  { key: "2", label: "Signup" },
];

const App = () => {
  const [selected, setSelected] = useState("1");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tickets, setTickets] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItem, setMenuItem] = useState(menuNotLoginItem);
  const [isLogin, setIsLogin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  
  const refreshTickets = () => {
    const jwtToken = localStorage.getItem("userToken");
    if (jwtToken && isAdmin) {
      getTickets(jwtToken)
        .then((response) => setTickets(response.data))
        .catch((error) => console.error("Error refreshing tickets:", error));
    }
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("userToken");

    if (!jwtToken) {
      setIsLogin(false);
      setIsLoading(false);
      setMenuItem(menuNotLoginItem);
      return;
    }

    loginWithJwt(jwtToken)
      .then((response) => {
        const frameUser = response.data;
        setUser(frameUser);

        const tempAdmin = frameUser.roles.some(
          (role) => role.role === "ROLE_ADMIN"
        );
        setIsAdmin(tempAdmin);
        setIsLogin(true);
        setMenuItem(tempAdmin ? menuLoginAdmin : menuLoginUser);

        if (tempAdmin) {
          getTickets(jwtToken)
            .then((_response) => setTickets(_response.data))
            .catch(() => {});
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleMenuItem = (e) => {
    const clickedKey = e.key;
    setSelected(clickedKey);

    if (!isLogin) {
      if (clickedKey === "1") navigate("/login");
      if (clickedKey === "2") navigate("/signup");
      return;
    }

 
    if (clickedKey === "1") navigate("/profile");
    if (clickedKey === "2") navigate("/mytickets");
    if (clickedKey === "3") navigate("/createTicket");
    if (isAdmin && clickedKey === "4") {
     
      refreshTickets();
      navigate("/showAllTickets");
    }
    if (clickedKey === "5") {
      localStorage.removeItem("userToken");
      setIsLogin(false);
      setUser(null);
      setIsAdmin(false);
      setTickets(null);
      setMenuItem(menuNotLoginItem);
      navigate("/login");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          items={menuItem}
          onClick={handleMenuItem}
          theme="dark"
          mode="inline"
          selectedKeys={[selected]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            {}
            <Route element={<ProtectedPages isLogin={isLogin} isLoading={isLoading} />}>
              <Route path="/" element={<Profile user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route
                path="/mytickets"
                element={<Tickets user={user} isAdmin={false} tickets={null} />}
              />
              <Route
                path={isAdmin ? "/showAllTickets" : "/"}
                element={<Tickets user={user} isAdmin={isAdmin} tickets={tickets} />}
              />
              <Route
                path="/createTicket"
                element={<CreateTicket user={user} jwtToken={localStorage.getItem("userToken")} />}
              />
              <Route
                path="/readTicket/:ticketInfo"
                element={
                  <ReadTicket 
                    user={user} 
                    jwtToken={localStorage.getItem("userToken")} 
                    tickets={tickets} 
                    isAdmin={isAdmin}
                    refreshTickets={refreshTickets}
                  />
                }
              />
            </Route>

            {}
            <Route element={<NotLoginPages isLogin={isLogin} isLoading={isLoading} />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;