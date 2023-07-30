import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";
import {
  CloudUploadOutlined,
  HomeOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { 
  Outlet, NavLink, useLocation,
} from "react-router-dom";  

const { Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// 支持文件上传和预览?
const items = [
  getItem(<NavLink to="/">图片预览</NavLink>, "/", <HomeOutlined />),
  getItem(<NavLink to="/upload">图片上传</NavLink>, "/upload", <CloudUploadOutlined />),
  getItem("设置", "/setting", <SettingOutlined />, [
    getItem(<NavLink to="/setting/repo">仓库地址</NavLink>, "/repo", <InfoCircleOutlined />),
  ]),
];

export default function Root() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const [selectedKeys, setselectedKeys] = useState(['/']);
  const [openKeys, setopenKeys] = useState([]);

  // 只在初次进来的时候手动设置需要展开的菜单项 
  useEffect(() => {
    const arr = pathname.split('/')
      .filter(item => item !== '')
      .map(item => '/' + item);
    setopenKeys(arr.slice(0, -1))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 路由变换的时候切换选中的菜单项
  useEffect(() => {
    const arr = pathname.split('/')
      .filter(item => item !== '')
      .map(item => '/' + item);
    setselectedKeys([arr[arr.length - 1] || '/'])
  }, [pathname]);

  // 展开菜单项方法
  const onOpenChange = (keys) => {
    setopenKeys(keys);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          selectedKeys={selectedKeys}
          openKeys={openKeys} 
          mode="inline"
          items={items}
          onOpenChange={onOpenChange}
        />
      </Sider>
      <Layout>
        <Outlet />
        <Footer
          style={{
            textAlign: "center",
            height: "4rem"
          }}
        >
          Toast ©2023 Created by <a href="#">KartJim</a>.
        </Footer>
      </Layout>
    </Layout>
  );
}
