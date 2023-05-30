import { Avatar, Button, Table, Tag, Input, Popover } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import AddUser from '../../components/AddUser/AddUser';
import { useDispatch } from 'react-redux';
import { SHOW_SIDER } from '../../redux/reducers/ProjectManageReducer/ProjectManageTypes';
import EditProject from '../../components/EditProject/EditProject';
import { useNavigate } from 'react-router-dom';
import { deleteProjectAction, getProjectDetailAction, removeUserProjectAction, setListProjectsAction } from '../../redux/reducers/ProjectManageReducer/ProjcetManageActions';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
const { Search } = Input;


function ProjectManagement() {
  const { listProjects } = useSelector(state => state.ProjectManageReducer);
  const { user } = useSelector(state => state.UserSlice);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setListProjectsAction());
  }, []);

  const timerRef = useRef();
  const handleChange = (event) => {
    clearTimeout(timerRef);

    timerRef.current = setTimeout(() => {
      dispatch(setListProjectsAction(event.target.value));
      setSearchTerm(event.target.value);
    }, 1000);
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['ascend', 'descend'],
      width: '15%'
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: (a, b) => {
        return a.projectName.localeCompare(b.projectName);
      },
      sortDirections: ['ascend', 'descend'],
      render: (text, project) => {
        return <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => {
          if (project.creator.id !== user?.id && project.members.findIndex(member => member.userId === user?.id) === -1) {
            Swal.fire({
              icon: 'error',
              text: 'You are not allowed to access details of this project',
              confirmButtonColor: "#1677ff"
            });
          } else {
            navigate(`/project-detail/${project.id}`);
          }
        }}>
          {project.projectName}
        </span>
      },
      width: '25%'
    },
    {
      title: 'Project Category',
      dataIndex: 'categoryid',
      key: 'categoryid',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['ascend', 'descend'],
      render: (text, project) => {
        return <>
          {project.categoryName}
        </>
      },
      width: '15%'
    },
    {
      title: 'Creator',
      key: 'creator',
      dataIndex: 'creator',
      render: (text, project, index) => {
        let color = null;

        switch (index % 3) {
          case 0:
            color = "red";
            break;
          case 1:
            color = "gold";
            break;
          case 2:
            color = "green";
            break;
          default:
            break;
        }
        return <Tag color={color}>{project.creator.name}</Tag>
      },
      width: '15%'
    },
    {
      title: 'Member',
      key: 'members',
      dataIndex: 'members',
      render: (text, project) => {
        const miniColumns = [
          {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            sorter: (a, b) => a.userId - b.userId,
            sortDirections: ['ascend', 'descend'],
            width: '20%'
          },
          {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, member) => {
              return <Avatar title={member.name} src={member.avatar} key={member.userId} />
            },
            width: '20%'
          },
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, member) => {
              return member.name
            },
            width: '40%'
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, member) => {
              return <button className="text-2xl flex justify-center items-center" onClick={() => {
                if (user?.id !== project.creator.id) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Remove members failed.',
                    text: 'You are not allowed to remove members in this project',
                    confirmButtonColor: "#1677ff"
                  });
                } else {
                  dispatch(removeUserProjectAction({
                    projectId: project.id,
                    userId: member.userId
                  }))
                }
              }}>
                <DeleteOutlined style={{ color: 'red' }} />
              </button>
            },
            width: '20%'
          },
        ];
        return <div className='flex items-center'>
          <Popover className='cursor-pointer flex items-center' placement="left"
            content={
              <Table
                columns={miniColumns}
                pagination={{
                  position: ['bottomRight'],
                }}
                dataSource={project.members}
                rowKey={'userId'}
              />
            }
            trigger="hover"
          >
            <Avatar.Group
              maxCount={2}
              maxPopoverTrigger="hover"
              size="large"
              maxStyle={{
                color: '#1677ff',
                backgroundColor: '#fde3cf',
                cursor: 'pointer',
              }}
            >
              {project.members.map(member => {
                return <Avatar title={member.name} src={member.avatar} key={member.userId} />
              })}
            </Avatar.Group>
            <Button className='border-none'>
            </Button>
          </Popover>
          <div className='ml-3'>
            <AddUser currentMembers={project.members} userId={user?.id} creatorId={project.creator.id} projectId={project.id} />
          </div>
        </div >
      },
      width: '20%'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, project) => {
        return <div className='flex justify-center items-center'>
          <button key={1} className="mr-1 text-2xl flex justify-center items-center" onClick={async () => {
            if (user.id === project.creator.id) { // kiểm tra có phải project mình tạo không, nếu đúng mới cho phép chỉnh sửa
              await dispatch(getProjectDetailAction(project.id));
              dispatch({ type: SHOW_SIDER })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Edit project failed.',
                text: 'You are not allowed to edit this project',
                confirmButtonColor: "#1677ff"
              });
            }
          }}>
            <EditOutlined style={{ color: 'blue' }} />
          </button>
          <button key={2} className="text-2xl flex justify-center items-center" onClick={async () => {
            await dispatch(deleteProjectAction(project.id));
            dispatch(setListProjectsAction(searchTerm));
          }}>
            <DeleteOutlined style={{ color: 'red' }} />
          </button>
        </div>
      },
      width: '15%'
    },
  ];
  const data = listProjects;

  return (
    <>
      <div className='w-full flex justify-between'>
        <h1 className='text-3xl font-bold mb-4'>List Of Projects</h1>
        <div className='flex flex-col items-end'>
          <Button className='mb-2' onClick={() => navigate('/create-project')}>
            Add Project
          </Button>
          <Search placeholder="Input project's name" allowClear onKeyDown={(event) => {
            if (event.key === 'Enter') {
              dispatch(setListProjectsAction(event.target.value));
            }
          }} onChange={handleChange} style={{ width: 200 }} />
        </div>
      </div>
      <Table
        columns={columns}
        pagination={{
          position: ['bottomRight'],
        }}
        dataSource={data}
        rowKey={'id'}
      />
      <EditProject />
    </>
  )
}

export default ProjectManagement