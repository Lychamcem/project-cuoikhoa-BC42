import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  TableOutlined,
  SettingOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
  FilterOutlined,
  FileOutlined,
  ExportOutlined,
  CodepenOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Dropdown, Image, Layout, Menu, Space, theme } from 'antd';
import TaskModal from '../../components/CreateTaskModal/CreateTaskModal';
import { ShowCreateTaskModal } from '../../redux/slices/TaskManageSlice/TaskManageSlice';
import { logOut } from '../../redux/slices/UserSlice/UserSlice';
import { getAllCategoryAction, getAllPriorityAction, getAllStatusAction, getAllTaskTypeAction } from '../../redux/reducers/HelperReducer/HelperActions';
const { Header, Content, Sider } = Layout;

function FrameTemplate() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector(state => state.UserSlice);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    //get all constant states
    dispatch(getAllPriorityAction());
    dispatch(getAllCategoryAction());
    dispatch(getAllStatusAction());
    dispatch(getAllTaskTypeAction());
  }, []);

  const showPathWorking = () => {
    if (pathname.includes('project-detail')) {
      return <Breadcrumb.Item>Project detail</Breadcrumb.Item>
    } else if (pathname.includes('create-project')) {
      return <Breadcrumb.Item>Create project</Breadcrumb.Item>
    } else if (pathname.includes('profile')) {
      return <Breadcrumb.Item>Profile</Breadcrumb.Item>
    } else if(pathname.includes('admin')) {
      return <Breadcrumb.Item>Admin management</Breadcrumb.Item>
    } else {
      return <Breadcrumb.Item>Project management</Breadcrumb.Item>
    }
  }

  const showSelectedTab = () => {
    if (pathname.includes('project-detail')) {
      return ['1'];
    } else if (pathname.includes('create-project')) {
      return ['3'];
    } else if (pathname.includes('profile') || pathname.includes('admin')) {
      return [];
    } else {
      return ['2'];
    }
  }

  const items = [
    {
      label: <NavLink className='flex items-center' to={`/profile/${user?.id}`}>
        <UserOutlined className='mr-1' style={{
          strokeWidth: '40',
          stroke: 'black',
          color: 'black'
        }} /> Profile
      </NavLink>,
      key: '1'
    },
    {
      label: <NavLink className='flex items-center' to="/admin">
        <UsergroupAddOutlined className='mr-1' style={{
          strokeWidth: '40',
          stroke: 'black',
          color: 'black'
        }} /> Admin Management
      </NavLink>,
      key: '2'
    },
    {
      label: <p className='flex items-center' onClick={() => dispatch(logOut())}>
        <LogoutOutlined className='mr-1' style={{
          strokeWidth: '40',
          stroke: 'black',
          color: 'black'
        }} />Log Out</p>,
      key: '3'
    },
  ];
  return (
    <Layout>
      <Layout>
        <Sider className='pt-5 flex flex-col justify-center' style={{ minHeight: '100vh' }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <Menu theme="dark" mode="inline" >
            <Menu.Item icon={<SearchOutlined />} title='Search'>
              Search
            </Menu.Item>
            <Menu.Item icon={<PlusOutlined />} title='Create task' onClick={() => dispatch(ShowCreateTaskModal())}>
              Create task
            </Menu.Item>
            <Menu.Item icon={<QuestionCircleOutlined />} title='Supports'>
              Supports
            </Menu.Item>
          </Menu>
        </Sider>
        <Sider
          className='pt-5 px-4'
          style={{
            background: colorBgContainer,
          }}
          width={'15%'}
        >
          <div className='grid grid-cols-3 py-2 border border-b-2 border-t-0 border-x-0 overflow-hidden'>
            <Image
              className='col-span-1'
              width={50}
              height={30}
              src={require("../../assets/logo-jira.png")}
            />
            <div className='infor col-span-2'>
              <h1 className='text-base font-bold m-0'>{user?.name}</h1>
              <p className='text-xs' title={user?.email}>{user?.email}</p>
            </div>
          </div>
          <Menu className='py-5 border border-b-1 border-t-0 border-x-0' selectedKeys={showSelectedTab()} mode="inline" >
            <Menu.Item key={'1'} icon={<TableOutlined />}>
              <NavLink>
                Working Board
              </NavLink>
            </Menu.Item>
            <Menu.Item key={'2'} icon={<SettingOutlined />}>
              <NavLink to='/project-management'>
                Project Management
              </NavLink>
            </Menu.Item>
            <Menu.Item key={'3'} icon={<PlusCircleOutlined />}>
              <NavLink to='/create-project'>
                Create Project
              </NavLink>
            </Menu.Item>
          </Menu>
          <Menu className='pt-3' defaultSelectedKeys={['1']} mode="inline" >
            <Menu.Item icon={<PrinterOutlined />}>
              <NavLink>
                Releases
              </NavLink>
            </Menu.Item>
            <Menu.Item icon={<FilterOutlined />}>
              <NavLink>
                Issues And Filters
              </NavLink>
            </Menu.Item>
            <Menu.Item icon={<FileOutlined />}>
              <NavLink>
                Pages
              </NavLink>
            </Menu.Item>
            <Menu.Item icon={<ExportOutlined />}>
              <NavLink>
                Reports
              </NavLink>
            </Menu.Item>
            <Menu.Item icon={<CodepenOutlined />}>
              <NavLink>
                Components
              </NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className='pl-5'>
          <Header className='flex justify-end items-center pr-5' style={{ background: colorBgContainer }} >
            <span className='font-bold mr-2'>Hi! {user?.name}</span>
            <Dropdown
              menu={{
                items
              }}
              trigger={['click']}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar src={user?.avatar} alt={<UserOutlined />} />
                </Space>
              </a>
            </Dropdown>
          </Header>
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item className='cursor-pointer hover:text-blue-500' onClick={() => navigate('/')}>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            {showPathWorking()}
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <TaskModal />
    </Layout >
  );
}

export default FrameTemplate
