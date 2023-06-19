import { Avatar, Button, Dropdown, Modal, Slider, Space, Tag } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { HideEditTaskModal, deleteCommentAction, deleteTaskAction, getAllCommentAction, getTaskDetailAction, resetEditTaskSuccess, resetListComment, updateCommentAction, updateStatusTaskAction, updateTaskAction } from '../../redux/slices/TaskManageSlice/TaskManageSlice';
import { Editor } from '@tinymce/tinymce-react';
import {
    LinkOutlined,
    SendOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { insertCommentAction } from '../../redux/slices/TaskManageSlice/TaskManageSlice';
import { getProjectDetailAction } from '../../redux/reducers/ProjectManageReducer/ProjcetManageActions';

const schema = yup.object({
    taskName: yup
        .string()
        .required("*Required"),
    description: yup
        .string()
        .required("*Required"),
    typeId: yup
        .number()
        .positive("*Required")
        .required("*Required"),
    statusId: yup
        .string()
        .required("*Required"),
    originalEstimate: yup
        .string()
        .required("*Required"),
    priorityId: yup
        .number()
        .positive("*Required")
        .required("*Required"),
});

function EditTaskModal({ projectId }) {
    const { allPriority, allStatus, allTaskType } = useSelector(state => state.HelperReducer);
    const { projectDetail } = useSelector(state => state.ProjectManageReducer);
    const { openEditTaskModal, editTaskSuccess, taskDetail, listComment } = useSelector(state => state.TaskManageSlice);
    const { user } = useSelector(state => state.UserSlice);
    const [showAddComment, setShowAddComment] = useState(false);
    const [listUserInProject, setListUserInProject] = useState(null);
    const [listUserChosen, setListUserChosen] = useState([]);
    const [initialDescription, setInitialDescription] = useState('');
    const [timeEstimate, setTimeEstimate] = useState({
        total: 0,
        spent: 0,
        remaining: 0
    });
    const [commentToEdit, setCommentToEdit] = useState({
        id: null,
        content: '',
    });
    const [commentToAdd, setCommentToAdd] = useState('');
    const [allowToDeleteTask, setAllowToDeleteTask] = useState(false);
    const editorRef = useRef(null);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            projectId: +projectId,
            taskId: 0,
            taskName: '',
            description: '',
            typeId: 0,
            statusId: '',
            originalEstimate: '',
            timeTrackingSpent: '',
            timeTrackingRemaining: '',
            priorityId: 0
        },
        mode: "onChange",
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        setListUserInProject(projectDetail?.members.map(member => (
            {
                id: member.userId,
                name: member.name
            }
        )));
        setListUserChosen(taskDetail?.assigness.map(assignee => (
            {
                id: assignee.id,
                name: assignee.name
            }
        )));

        setValue("taskId", taskDetail?.taskId);
        setValue("taskName", taskDetail?.taskName);
        setValue("description", taskDetail?.description);
        setValue("typeId", taskDetail?.typeId);
        setValue("statusId", +taskDetail?.statusId);
        setValue("originalEstimate", taskDetail?.originalEstimate);
        setValue("timeTrackingSpent", taskDetail?.timeTrackingSpent);
        setValue("timeTrackingRemaining", taskDetail?.timeTrackingRemaining);
        setValue("priorityId", taskDetail?.priorityId);

        setInitialDescription(taskDetail?.description);
        setTimeEstimate({
            total: taskDetail?.originalEstimate,
            spent: taskDetail?.timeTrackingSpent,
            remaining: taskDetail?.timeTrackingRemaining
        });

        setAllowToDeleteTask(true);

        //get comments
        if (taskDetail) {
            dispatch(getAllCommentAction(taskDetail.taskId));
        }
    }, [taskDetail, projectDetail]);

    const onSubmit = (values) => {
        const listUserAsign = listUserChosen?.map(user => user.id);
        values = {
            ...values,
            originalEstimate: +values.originalEstimate,
            timeTrackingSpent: +timeEstimate.spent,
            timeTrackingRemaining: +timeEstimate.remaining,
            listUserAsign
        }

        dispatch(updateTaskAction(values));
    }

    const onErrors = (errors) => {
        console.log('errors: ', errors);
    }

    const handleOk = () => {
        dispatch(getProjectDetailAction(projectDetail.id));
        dispatch(HideEditTaskModal());
    };
    const handleCancel = () => {
        dispatch(getProjectDetailAction(projectDetail.id));
        dispatch(HideEditTaskModal());
    };

    const resetFormFunction = () => {
        reset();

        setListUserChosen([]);
        setTimeEstimate({
            total: 0,
            spent: 0,
            remaining: 0
        });
        setAllowToDeleteTask(false);

        dispatch(resetListComment());
    }

    if (editTaskSuccess) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Update task successfully !',
            showConfirmButton: false,
            timer: 1500
        });

        dispatch(resetEditTaskSuccess());

        resetFormFunction();
    }

    return (
        <>
            <Modal width={'75%'} open={openEditTaskModal} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <form className="space-y-10 ng-untouched ng-pristine ng-valid" onSubmit={handleSubmit(onSubmit, onErrors)}>
                    <div className='grid grid-cols-12 gap-5'>
                        <div className='col-span-12 sm:col-span-7'>
                            <div className='flex items-center'>
                                <select {...register("typeId")} name="typeId" id="typeId" className="w-1/4 px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-xs lg:text-base text-black mr-2">
                                    {
                                        allTaskType?.map(type => (
                                            <option value={type.id} key={type.id}>
                                                {type.taskType}
                                            </option>
                                        ))
                                    }
                                </select>
                                <span>ID: {taskDetail?.taskId}</span> <br />
                                {errors.typeId && <span className='sm:text-sm text-xs text-red-600'>{errors.typeId.message}</span>}
                            </div>
                        </div>
                        <div className='col-span-12 sm:col-span-5 my-2'>
                            <div className='grid grid-cols-12 gap-2'>
                                <div className='col-span-9 grid grid-cols-2'>
                                    <Button className='col-span-2 lg:col-span-1 border-none font-semibold text-gray-500 text-xs lg:text-sm xl:text-lg flex items-center'>
                                        <SendOutlined className='mr-1' /> Give feedback
                                    </Button>
                                    <Button className='col-span-2 lg:col-span-1 border-none font-semibold text-gray-500 text-xs lg:text-sm xl:text-lg flex items-center'>
                                        <LinkOutlined className='mr-1' /> Copy Link
                                    </Button>
                                </div>
                                <div className='col-span-3'>
                                    <Button className='border-none font-semibold text-gray-500 text-lg flex items-center' title="Delete Task" disabled={!allowToDeleteTask} onClick={() => {
                                        dispatch(deleteTaskAction(taskDetail.taskId));
                                        dispatch(HideEditTaskModal());
                                        dispatch(getProjectDetailAction(projectId));
                                    }}>
                                        <DeleteOutlined />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-12 sm:col-span-7 my-2'>
                            <div className='my-1'>
                                <label for="taskName" className="w-full block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Task Name</label>
                                <input {...register("taskName")} type="text" name="taskName" id="taskName" className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-black" />
                                {errors.taskName && <span className='sm:text-sm text-xs text-red-600'>{errors.taskName.message}</span>}
                            </div>
                            <div className='my-1'>
                                <label for="description" className="block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Description</label>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{
                                        required: '*Required',
                                    }}
                                    render={({ field: { onChange } }) => (
                                        <Editor
                                            onInit={(evt, editor) => editorRef.current = editor}
                                            initialValue={initialDescription}
                                            init={{
                                                menubar: false,
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste code help wordcount',
                                                    'lists'
                                                ],
                                                block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3',
                                                style_formats: [
                                                    {
                                                        title: 'Headers', items: [
                                                            { title: 'Header 1', format: 'h1' },
                                                            { title: 'Header 2', format: 'h2' },
                                                            { title: 'Header 3', format: 'h3' },
                                                            { title: 'Header 4', format: 'h4' },
                                                            { title: 'Header 5', format: 'h5' },
                                                            { title: 'Header 6', format: 'h6' }
                                                        ]
                                                    },
                                                    {
                                                        title: 'Inline', items: [
                                                            { title: 'Bold', icon: 'bold', format: 'bold' },
                                                            { title: 'Italic', icon: 'italic', format: 'italic' },
                                                            { title: 'Underline', icon: 'underline', format: 'underline' },
                                                            { title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough' },
                                                            { title: 'Superscript', icon: 'superscript', format: 'superscript' },
                                                            { title: 'Subscript', icon: 'subscript', format: 'subscript' },
                                                            { title: 'Code', icon: 'code', format: 'code' }
                                                        ]
                                                    }
                                                ],
                                                toolbar: 'undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | indent outdent | bullist numlist | remove removeformat | wordcount',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                            }}
                                            onEditorChange={onChange}
                                        />
                                    )}
                                />
                                {errors.description && <span className='sm:text-sm text-xs text-red-600'>{errors.description.message}</span>}
                            </div>
                        </div>
                        <div className='col-span-12 sm:col-span-5 my-2'>
                            <div className='my-1'>
                                <label for="statusId" className="block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Status</label>
                                <select {...register("statusId")} name="statusId" id="statusId" className="w-full sm:w-1/3 px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-xs sm:text-base text-black mr-2">
                                    {
                                        allStatus?.map(status => (
                                            <option value={status.statusId} key={status.statusId}>{status.statusName}</option>
                                        ))
                                    }
                                </select> <br />
                                {errors.statusId && <span className='sm:text-sm text-xs text-red-600'>{errors.statusId.message}</span>}
                            </div>
                            <div className='my-1'>
                                <label for="listUserAssign" className="block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Assignees</label>
                                <Dropdown
                                    menu={
                                        {
                                            items: listUserInProject ? listUserInProject.map(member => {
                                                return {
                                                    key: member.id,
                                                    label: <button className='flex items-center w-full'
                                                        onClick={() => {
                                                            let index = listUserChosen?.findIndex(user => user.id === member.id);

                                                            if (index === -1) {
                                                                setListUserChosen([...listUserChosen, member])
                                                            } else {
                                                                Swal.fire({
                                                                    icon: 'error',
                                                                    text: 'This member was already assigned.',
                                                                    confirmButtonColor: "#1677ff"
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        {member.name}
                                                    </button>
                                                }
                                            }) : []
                                        }
                                    }
                                    placement="bottom" arrow
                                >
                                    <div name="listUserAsign" id="listUserAsign" className="w-full border py-2 px-4 border-gray-700 bg-white text-black">
                                        <Space size={[0, 'middle']} wrap>
                                            {
                                                listUserChosen?.map(member => (
                                                    <Tag key={member.id} bordered={true} closable onClose={() => {
                                                        const newListUserChosen = listUserChosen.filter(user => user.id !== member.id);

                                                        setListUserChosen(newListUserChosen);
                                                    }}>
                                                        {member.name}
                                                    </Tag>
                                                ))
                                            }
                                        </Space>
                                    </div>
                                </Dropdown>
                            </div>
                            <div className='my-1'>
                                <label for="priorityId" className="block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Priority</label>
                                <select {...register("priorityId")} name="priorityId" id="priorityId" className="w-full sm:w-1/4 px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-xs sm:text-base text-black mr-2">
                                    {
                                        allPriority?.map(statusType => (
                                            <option value={statusType.priorityId} key={statusType.priorityId}>{statusType.priority}</option>
                                        ))
                                    }
                                </select> <br />
                                {errors.statusId && <span className='sm:text-sm text-xs text-red-600'>{errors.statusId.message}</span>}
                            </div>
                            <div className='my-1'>
                                <label for="originalEstimate" className="w-full block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Original Estimate (hours)</label>
                                <input {...register("originalEstimate")} type="number" name="originalEstimate" id="originalEstimate" min={0} className="w-1/4 px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-xs sm:text-base text-black" onChange={(event) => {
                                    setTimeEstimate({
                                        total: event.target.value,
                                        spent: 0,
                                        remaining: event.target.value
                                    });
                                }} />
                                {errors.originalEstimate && <span className='sm:text-sm text-xs text-red-600'>{errors.originalEstimate.message}</span>}
                            </div>
                            <div className='my-1'>
                                <label for="timeTracking" className="block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Time Tracking</label>
                                <Slider
                                    defaultValue={0}
                                    min={0}
                                    max={timeEstimate.total}
                                    value={timeEstimate.spent}
                                    tooltip={{
                                        formatter: (value) => `${value}`,
                                    }}
                                    onChange={(value) => {
                                        setTimeEstimate({
                                            ...timeEstimate,
                                            spent: value,
                                            remaining: timeEstimate.total - value
                                        });
                                    }}
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-2 my-1'>
                                <div>
                                    <label for="timeTrackingSpent" className="block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Time Tracking Spent</label>
                                    <input {...register("timeTrackingSpent")} type="number" name="timeTrackingSpent" id="timeTrackingSpent" min={0} className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-black" value={timeEstimate.spent} onChange={(event) => {
                                        setTimeEstimate({
                                            ...timeEstimate,
                                            spent: event.target.value,
                                            remaining: timeEstimate.total - event.target.value
                                        })
                                    }} />
                                </div>
                                <div>
                                    <label for="timeTrackingRemaining" className="block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Time Tracking Remaining</label>
                                    <input {...register("timeTrackingRemaining")} type="number" name="timeTrackingRemaining" id="timeTrackingRemaining" min={0} className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-black" value={timeEstimate.remaining} onChange={(event) => {
                                        setTimeEstimate({
                                            ...timeEstimate,
                                            spent: timeEstimate.total - event.target.value,
                                            remaining: event.target.value
                                        })
                                    }} />
                                </div>
                            </div>
                        </div>
                        <div className='col-span-12 sm:col-span-7 my-2'>
                            <label for="comments" className="block mb-2 text-xs sm:text-sm font-semibold text-gray-500">Comments</label>
                            <div className='flex flex-col justify-center'>
                                {
                                    listComment?.map(comment => (
                                        <div key={comment.id}>
                                            <div className='font-semibold text-xs sm:text-sm lg:text-base'>
                                                <Avatar className='mr-1' size={"small"} src={comment.user.avatar} />
                                                {comment.user.name}
                                            </div>
                                            {
                                                comment.id === commentToEdit.id ? <div>
                                                    <textarea type="text" name="comment" id="comment" className="w-full mt-2 px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-black" value={commentToEdit.content} onChange={(event) => {
                                                        setCommentToEdit({
                                                            ...commentToEdit,
                                                            content: event.target.value
                                                        });
                                                    }}>
                                                    </textarea>
                                                    <div className='flex justify-end'>
                                                        <Button htmlType='button' className='mr-1' size='small' onClick={() => {
                                                            setCommentToEdit({
                                                                id: null,
                                                                content: ''
                                                            });
                                                        }}>Cancel</Button>
                                                        <Button htmlType='button' danger size='small' onClick={async () => {
                                                            if (!commentToEdit) {
                                                                await dispatch(deleteCommentAction(comment.id));
                                                                dispatch(getAllCommentAction(taskDetail.taskId));
                                                            } else {
                                                                await dispatch(updateCommentAction({
                                                                    id: comment.id,
                                                                    commentContent: commentToEdit.content
                                                                }));
                                                                await setCommentToEdit({
                                                                    id: null,
                                                                    content: ''
                                                                });
                                                                dispatch(getAllCommentAction(taskDetail.taskId));
                                                            }

                                                        }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                </div> : <div className='flex items-center ml-7'>
                                                    <div className='text-sm mr-2'>
                                                        {comment.contentComment}
                                                    </div>
                                                    <div className='flex'>
                                                        {
                                                            comment.user.userId === user.id &&
                                                            <>
                                                                <button type='button' key={1} className="mr-1 text-sm flex justify-center items-center" onClick={() => setCommentToEdit({
                                                                    id: comment.id,
                                                                    content: comment.contentComment
                                                                })}>
                                                                    <EditOutlined style={{ color: 'blue' }} />
                                                                </button>
                                                                <button type='button' key={2} className="text-sm flex justify-center items-center">
                                                                    <DeleteOutlined style={{ color: 'red' }} onClick={async () => {
                                                                        await dispatch(deleteCommentAction(comment.id));
                                                                        dispatch(getAllCommentAction(taskDetail.taskId));
                                                                    }} />
                                                                </button>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                            <Button htmlType='button' className='my-2' onClick={() => setShowAddComment(true)}>Add Comment</Button>
                            {
                                showAddComment && <div className='mt-2'>
                                    <textarea type="text" name="comment" id="comment" className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-black" value={commentToAdd} onChange={(event) => setCommentToAdd(event.target.value)}>
                                    </textarea>
                                    <div className='flex justify-end'>
                                        <Button htmlType='button' className='mr-1' size='small' onClick={() => {
                                            setCommentToAdd('');
                                            setShowAddComment(false);
                                        }}>Cancel</Button>
                                        <Button htmlType='button' danger size='small' onClick={async () => {
                                            await dispatch(insertCommentAction({
                                                taskId: taskDetail.taskId,
                                                contentComment: commentToAdd
                                            }));
                                            dispatch(getAllCommentAction(taskDetail.taskId));
                                            setCommentToAdd('');
                                            setShowAddComment(false);
                                        }}>Add</Button>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='col-span-12'>
                            <button type='button' className='text-white bg-red-500 rounded-sm px-4 py-2 mr-2 hover:bg-red-700 transition-all duration-500' onClick={() => dispatch(HideEditTaskModal())}>Cancel</button>
                            <button type='submit' className='text-white bg-blue-500 rounded-sm px-4 py-2 hover:bg-blue-700 transition-all duration-500'>Save</button>
                        </div>
                    </div>
                </form>
            </Modal >
        </>
    )
}

export default EditTaskModal