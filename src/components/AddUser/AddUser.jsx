import React from 'react'
import {
    PlusOutlined
} from '@ant-design/icons';
import { Avatar, Button, Popover, Select } from 'antd';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { getUserAction } from '../../redux/reducers/UsersManageReducer/UserManageActions';
import { useSelector } from 'react-redux';
import { assignUserProjectAction } from '../../redux/reducers/ProjectManageReducer/ProjectManageActions';
import "./AddUser.scss"

const title = <p className='border border-b-1 border-t-0 border-x-0'>Add members</p>;

function AddUser({ currentMembers, userId, creatorId, projectId, searchTerm }) {
    const { userList } = useSelector(state => state.UsersManageReducer);
    const dispatch = useDispatch();


    const onChange = (value) => {
        dispatch(assignUserProjectAction({
            projectId,
            userId: value,
        }, searchTerm));
    };

    const content = (
        <Select
            className='w-full'
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option,) =>
                (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={userList?.map(member => {
                return {
                    value: member.userId,
                    name: member.name,
                    title: member.name,
                    label: <button className='flex items-center' onClick={() => {
                        let index = currentMembers ? currentMembers.findIndex(user => user.userId === member.userId) : -1;

                        if (index !== -1) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Add member failed.',
                                text: 'This user was already added to the project.',
                                confirmButtonColor: "#1677ff"
                            });
                        }
                    }}>
                        <Avatar size={'small'} className='mr-2' title={member.name} src={member.avatar} key={member.userId} />
                        <span className='text-xs md:text-sm lg:text-base'>{member.name}</span>
                    </button>
                }
            })}
        />
    );

    return (
        <Popover placement="bottomRight" title={title} content={content} trigger="click" >
            <Button className='bg-blue-600 text-white flex justify-center items-center addUser-btn' shape="circle" icon={<PlusOutlined />} title='Add members' onClick={() => {
                if (userId !== creatorId) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Add members failed.',
                        text: 'You are not allowed to add members in this project',
                        confirmButtonColor: "#1677ff"
                    });
                } else {
                    // get all users
                    dispatch(getUserAction());
                }
            }}>
            </Button>
        </Popover >

    )
}

export default AddUser