import { Dropdown, Modal, Slider, Space, Tag } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { HideCreateTaskModal, createTaskAction, resetCreateTaskSuccess } from '../../redux/slices/TaskManageSlice/TaskManageSlice';
import { Editor } from '@tinymce/tinymce-react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getProjectDetailAction, setListProjectsAction } from '../../redux/reducers/ProjectManageReducer/ProjectManageActions';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const schema = yup.object({
    projectId: yup
        .number()
        .positive("*Required")
        .required("*Required"),
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

function CreateTaskModal() {
    const { user } = useSelector(state => state.UserSlice);
    const { openCreateTaskModal, createTaskSuccess } = useSelector(state => state.TaskManageSlice);
    const { listProjects, projectDetail } = useSelector(state => state.ProjectManageReducer);
    const { allPriority, allStatus, allTaskType } = useSelector(state => state.HelperReducer);
    const [listUserInProject, setListUserInProject] = useState(null);
    const [listUserChosen, setListUserChosen] = useState([]);
    const [timeEstimate, setTimeEstimate] = useState({
        total: 0,
        spent: 0,
        remaining: 0
    });
    const editorRef = useRef(null);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            projectId: 0,
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
        dispatch(setListProjectsAction());
    }, []);

    useEffect(() => {
        setListUserInProject(projectDetail?.members);
    }, [projectDetail]);

    const handleOk = () => {
        dispatch(HideCreateTaskModal());
    };
    const handleCancel = () => {
        dispatch(HideCreateTaskModal());
    };

    const onSubmit = (values) => {
        const listUserAsign = listUserChosen?.map(user => user.userId);
        values = {
            ...values,
            originalEstimate: +values.originalEstimate,
            timeTrackingSpent: +timeEstimate.spent,
            timeTrackingRemaining: +timeEstimate.remaining,
            listUserAsign
        }

        dispatch(createTaskAction(values));
    }

    const onErrors = (errors) => {
        console.log('errors: ', errors);
    }

    const resetFormFunction = () => {
        reset();
        setListUserChosen([]);
        setTimeEstimate({
            total: 0,
            spent: 0,
            remaining: 0
        });
    }

    if (createTaskSuccess) {
        resetFormFunction();

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Create task successfully !',
            showConfirmButton: false,
            timer: 1500
        });

        dispatch(resetCreateTaskSuccess());

        //update project
        dispatch(getProjectDetailAction(projectDetail.id));
    }

    return (
        <>
            <Modal width={'60%'} title={<h1 className='text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-left'>Create Task</h1>} open={openCreateTaskModal} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <form className="space-y-10 ng-untouched ng-pristine ng-valid" onSubmit={handleSubmit(onSubmit, onErrors)}>
                    <div className="space-y-4">
                        <div>
                            <label for="projectId" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Project Name</label>
                            <select {...register("projectId")} name="projectId" id="projectId" className="w-full px-2 py-1 md:px-3 md:py-2 border  border-gray-700 bg-white text-black" onChange={(event) => {
                                dispatch(getProjectDetailAction(event.target.value));
                            }}>
                                {
                                    listProjects?.filter(project => project.creator.id === user?.id).map(project => (
                                        <option value={project.id} key={project.id}>{project.projectName}</option>
                                    ))
                                }
                            </select>
                            {errors.projectId && <span className='sm:text-sm text-xs text-red-600'>{errors.projectId.message}</span>}
                        </div>
                        <div>
                            <label for="taskName" className="w-full block mb-2 text-xs md:text-sm font-semibold text-gray-500">Task Name</label>
                            <input {...register("taskName")} type="text" name="taskName" id="taskName" className="w-full px-2 py-1 md:px-3 md:py-2 border  border-gray-700 bg-white text-black" />
                            {errors.taskName && <span className='sm:text-sm text-xs text-red-600'>{errors.taskName.message}</span>}
                        </div>
                        <div>
                            <label for="description" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Description</label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{
                                    required: '*Required',
                                }}
                                render={({ field: { onChange } }) => (
                                    <Editor
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        initialValue=""
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
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-1'>
                            <div>
                                <label for="typeId" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Task Type</label>
                                <select {...register("typeId")} name="typeId" id="typeId" className="w-full px-2 py-1 md:px-3 md:py-2 border  border-gray-700 bg-white text-black">
                                    {
                                        allTaskType?.map(type => (
                                            <option value={type.id} key={type.id}>
                                                {type.taskType}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.typeId && <span className='sm:text-sm text-xs text-red-600'>{errors.typeId.message}</span>}
                            </div>
                            <div>
                                <label for="statusId" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Status</label>
                                <select {...register("statusId")} name="statusId" id="statusId" className="w-full px-2 py-1 md:px-3 md:py-2 border  border-gray-700 bg-white text-black" >
                                    {
                                        allStatus?.map(status => (
                                            <option value={status.statusId} key={status.statusId}>{status.statusName}</option>
                                        ))
                                    }
                                </select>
                                {errors.statusId && <span className='sm:text-sm text-xs text-red-600'>{errors.statusId.message}</span>}
                            </div>
                            <div>
                                <label for="originalEstimate" className="w-full block mb-2 text-xs md:text-sm font-semibold text-gray-500">Original Estimate (hours)</label>
                                <input {...register("originalEstimate")} type="number" name="originalEstimate" id="originalEstimate" min={0} className="w-full px-2 py-1 md:px-3 md:py-2 border  border-gray-700 bg-white text-black" onChange={(event) => {
                                    setTimeEstimate({
                                        total: event.target.value,
                                        spent: 0,
                                        remaining: event.target.value
                                    });
                                }} />
                                {errors.originalEstimate && <span className='sm:text-sm text-xs text-red-600'>{errors.originalEstimate.message}</span>}
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2'>
                            <div className='border-2 border-l-0 border-y-0 pr-4'>
                                <div className='mb-1'>
                                    <label for="priorityId" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Priority</label>
                                    <select {...register("priorityId")} name="priorityId" id="priorityId" className="w-full px-2 py-1 md:px-3 md:py-2 border  border-gray-700 bg-white text-black" >
                                        {
                                            allPriority?.map(statusType => (
                                                <option value={statusType.priorityId} key={statusType.priorityId}>{statusType.priority}</option>
                                            ))
                                        }
                                    </select>
                                    {errors.priorityId && <span className='sm:text-sm text-xs text-red-600'>{errors.priorityId.message}</span>}
                                </div>
                                <div>
                                    <label for="listUserAsign" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Assignees</label>
                                    <Dropdown
                                        menu={
                                            {
                                                items: listUserInProject ? listUserInProject.map(member => {
                                                    return {
                                                        key: member.userId,
                                                        label: <button className='flex items-center w-full'
                                                            onClick={() => {
                                                                let index = listUserChosen?.findIndex(user => user.userId === member.userId);

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
                                                        <Tag key={member.userId} bordered={true} closable onClose={() => {
                                                            const newListUserChosen = listUserChosen.filter(user => user.userId !== member.userId);

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
                            </div>
                            <div className='mt-3 md:mt-0 md:pl-4'>
                                <div>
                                    <label for="timeTracking" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Time Tracking</label>
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
                                <div className='grid grid-cols-2 gap-2'>
                                    <div>
                                        <label for="timeTrackingSpent" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Time Tracking Spent</label>
                                        <input {...register("timeTrackingSpent")} type="number" name="timeTrackingSpent" id="timeTrackingSpent" min={0} className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-black" value={timeEstimate.spent} onChange={(event) => {
                                            setTimeEstimate({
                                                ...timeEstimate,
                                                spent: event.target.value,
                                                remaining: timeEstimate.total - event.target.value
                                            })
                                        }} />
                                    </div>
                                    <div>
                                        <label for="timeTrackingRemaining" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Time Tracking Remaining</label>
                                        <input {...register("timeTrackingRemaining")} type="number" name="timeTrackingRemaining" id="timeTrackingRemaining" min={0} className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-700 bg-white text-black" value={timeEstimate.remaining} onChange={(event) => {
                                            setTimeEstimate({
                                                ...timeEstimate,
                                                spent: timeEstimate.total - event.target.value,
                                                remaining: event.target.value
                                            });
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type='button' className='text-white bg-red-500 rounded-sm px-4 py-2 mr-2 hover:bg-red-700 transition-all duration-500' onClick={handleCancel}>Cancel</button>
                        <button type='submit' className='text-white bg-blue-500 rounded-sm px-4 py-2 hover:bg-blue-700 transition-all duration-500'>Save</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default CreateTaskModal