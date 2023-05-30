import { Avatar, Button, Card, Input, Popover, Table } from 'antd';
import {
  DeleteOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch } from 'react-redux';
import { ShowEditTaskModal, getTaskDetailAction, updateStatusTaskAction } from '../../redux/slices/TaskManageSlice/TaskManageSlice';
import EditTaskModal from '../../components/EditTaskModal/EditTaskModal';
import { useParams } from 'react-router-dom';
import { getProjectDetailAction, removeUserProjectAction } from '../../redux/reducers/ProjectManageReducer/ProjcetManageActions';
import { useSelector } from 'react-redux';
const { Search } = Input;

function ProjectDetail() {
  const { projectDetail } = useSelector(state => state.ProjectManageReducer);
  const [columns, setColumns] = useState({});
  const { allStatus } = useSelector(state => state.HelperReducer);
  const { id } = useParams();
  const dispatch = useDispatch();
  let taskStatus = {};

  useEffect(() => {
    dispatch(getProjectDetailAction(id));
  }, []);

  useEffect(() => {
    allStatus?.forEach(statusType => {
      let lstTaskDetail = projectDetail?.lstTask.find(taskType => taskType.statusName === statusType.statusName).lstTaskDeTail;

      taskStatus[statusType.statusName] = {
        id: statusType.statusId,
        name: statusType.statusName,
        items: lstTaskDetail
      }
    })


    setColumns({ ...taskStatus });
  }, [allStatus, projectDetail]);

  const memberColumns = [
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
        return <button className="text-2xl flex justify-center items-center" onClick={async () => {
          await dispatch(removeUserProjectAction({
            projectId: projectDetail?.id,
            userId: member.userId
          }));

          dispatch(getProjectDetailAction(id));
        }}>
          <DeleteOutlined style={{ color: 'red' }} />
        </button>
      },
      width: '20%'
    },
  ];

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });

      //call api to update task status
      dispatch(updateStatusTaskAction({
        taskId: removed.taskId,
        statusId: destColumn.id
      }));
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  const renderTaskPriority = (priority) => {
    switch (priority) {
      case 'Lowest':
        return <span className='text-blue-500'>
          <i className="fa fa-exclamation-circle mr-1"></i>
          {priority}
        </span>
      case 'Low':
        return <span className='text-green-500'>
          <i className="fa fa-exclamation-circle mr-1"></i>
          {priority}
        </span>
      case 'Medium':
        return <span className='text-yellow-500'>
          <i className="fa fa-exclamation-circle mr-1"></i>
          {priority}
        </span>
      default:
        return <span className='text-red-500'>
          <i className="fa fa-exclamation-circle mr-1"></i>
          {priority}
        </span>
    }
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>{projectDetail?.projectName}</h1>
      <div className='flex justify-between items-center w-1/2'>
        <Search placeholder="Search" allowClear style={{ width: 200 }} />
        <span>Only My Issues</span>
        <span>Recently Updated</span>
      </div>
      <Popover className='cursor-pointer' placement="bottomRight"
        content={
          <Table
            columns={memberColumns}
            pagination={{
              position: ['bottomRight'],
            }}
            dataSource={projectDetail?.members}
            rowKey={'userId'}
          />
        }
        trigger="hover"
      >
        <Avatar.Group
          className='mt-4'
          maxCount={2}
          maxPopoverTrigger="hover"
          maxStyle={{
            color: '#1677ff',
            backgroundColor: '#fde3cf',
            cursor: 'pointer',
          }}
        >
          {projectDetail?.members.map(member => {
            return <Avatar title={member.name} src={member.avatar} key={member.userId} />
          })}
        </Avatar.Group>
        <Button className='border-none'>
        </Button>
      </Popover>
      <div className='mt-4'>
        <div className='w-full h-full grid grid-cols-4 gap-2'>
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div className='flex flex-col items-center border border-2 border-gray-300' key={columnId} style={{
                  backgroundColor: '#f4f5f7'
                }}>
                  <h1 className='text-left w-full text-sm font-semibold px-2 py-1' style={{
                    color: '#5e6c84'
                  }}>{column.name}</h1>
                  <div className='w-full'>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "#f4f5f7",
                              width: '100%',
                              minHeight: 500
                            }}
                          >
                            {column.items?.map((item, index) => {
                              return (
                                <Draggable
                                  style={{
                                    width: '100%'
                                  }}
                                  key={item.taskId}
                                  draggableId={columnId}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <Card
                                        className='mb-3 shadow-xl w-full border border-y-2 border-x-0'
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        title={item.taskName}
                                        bordered={false}
                                        style={{
                                          userSelect: "none",
                                          backgroundColor: snapshot.isDragging
                                            ? "#263B4A"
                                            : "#fff",
                                          borderRadius: '0',
                                          ...provided.draggableProps.style
                                        }}
                                        onClick={() => {
                                          dispatch(ShowEditTaskModal());
                                          dispatch(getTaskDetailAction(item.taskId));
                                        }}
                                      >
                                        <div className='flex justify-between items-center'>
                                          {
                                            renderTaskPriority(item.priorityTask.priority)
                                          }
                                          <Avatar.Group
                                            maxCount={1}
                                            maxPopoverTrigger="hover"
                                            size="default"
                                            maxStyle={{
                                              color: '#1677ff',
                                              backgroundColor: '#fde3cf',
                                              cursor: 'pointer',
                                            }}
                                          >
                                            {
                                              item.assigness.map(joiner => (
                                                <Avatar src={joiner.avatar} title={joiner.name} key={joiner.id} />
                                              ))
                                            }
                                          </Avatar.Group>
                                        </div>
                                      </Card>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div >
      </div >
      <EditTaskModal projectId={id} />
    </div >
  )
}

export default ProjectDetail