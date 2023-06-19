import { Button, Checkbox, Drawer, Table, Input } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { adminEditUserAction, deleteUserAction, getUserAction } from '../../../redux/reducers/UsersManageReducer/UserManageActions';
import { useRef } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
const { Search } = Input;

const schema = yup.object({
    email: yup
        .string()
        .required("*Required")
        .email("Email has to be in the right format"),
    // password: yup
    //     .string()
    //     .required("*Required")
    //     .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Password must have at least 8 characters, including at least 1 alphabet, 1 digit and 1 special character"),
    name: yup
        .string()
        .required("*Required")
        .matches(/^[A-Za-z ]+$/, "Name only contains alphabets"),
    phoneNumber: yup
        .string()
        .required("*Required")
        .matches(/^\d{10,}$/, "Phone number has only digits, at least 10 digits")
});

function UserManagement() {
    const columns = [
        {
            title: <span className='text-xs md:text-sm lg:text-base'>ID</span>,
            dataIndex: 'userId',
            key: 'userId',
            sorter: (a, b) => a.userId - b.userId,
            sortDirections: ['ascend', 'descend'],
            width: '10%'
        },
        {
            title: <span className='text-xs md:text-sm lg:text-base'>Email</span>,
            dataIndex: 'email',
            key: 'email',
            render: (text, user) => {
                return user.email;
            },
            width: '25%'
        },
        {
            title: <span className='text-xs md:text-sm lg:text-base'>Name</span>,
            dataIndex: 'name',
            key: 'name',
            render: (text, user) => {
                return user.name
            },
            width: '25%'
        },
        {
            title: <span className='text-xs md:text-sm lg:text-base'>Phone number</span>,
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text, user) => {
                return user.phoneNumber
            },
            width: '20%'
        },
        {
            title: <span className='text-xs md:text-sm lg:text-base'>Action</span>,
            key: 'action',
            render: (text, user) => {
                return <div className='flex justify-center items-center'>
                    <Button className='mr-2' type="primary" size='small' ghost onClick={() => {
                        setOpenSider(true);
                        setUserSelected(user);
                    }}>
                        Edit
                    </Button>
                    <Button type="primary" size='small' danger ghost onClick={() => {
                        dispatch(deleteUserAction(user.userId, searchTerm));
                    }}>
                        Delete
                    </Button>
                </div>
            },
            width: '20%'
        },
    ];

    const [openSider, setOpenSider] = useState(false);
    // const [isShowPass, setIsShowPass] = useState(false);
    const [userSelected, setUserSelected] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { userList } = useSelector(state => state.UsersManageReducer);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            id: '',
            email: '',
            name: '',
            phoneNumber: ''
        },
        mode: "onChange",
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        dispatch(getUserAction());
    }, []);

    useEffect(() => {
        setValue("id", userSelected?.userId);
        setValue("email", userSelected?.email);
        setValue("name", userSelected?.name);
        setValue("phoneNumber", userSelected?.phoneNumber);
    }, [userSelected]);

    const onSubmit = (values) => {
        dispatch(adminEditUserAction(values, searchTerm, reset));
    }
    const onErrors = (errors) => {
        console.log('errors: ', errors);
    }

    const timerRef = useRef();
    const handleChange = (event) => {
        clearTimeout(timerRef);

        timerRef.current = setTimeout(() => {
            dispatch(getUserAction(event.target.value));
            setSearchTerm(event.target.value);
        }, 1000);
    }

    // const handleChangeShowPass = () => {
    //     setIsShowPass(!isShowPass);
    // };

    const onClose = () => {
        setOpenSider(false);
    };

    return (
        <>
            <h1 className='text-3xl font-bold mb-4'>List Of Users</h1>
            <div className='flex flex-col items-end'>
                <Search placeholder="Input user's name" allowClear onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        dispatch(getUserAction(event.target.value));
                    }
                }} onChange={handleChange} style={{ width: 200 }} />
            </div>
            <Table
                scroll={{ x: 400 }}
                columns={columns}
                pagination={{
                    position: ['bottomRight'],
                }}
                dataSource={userList}
                rowKey={'id'}
            />
            <Drawer
                title={<h1 className='text-2xl font-bold'>Edit User</h1>}
                placement={'right'}
                onClose={onClose}
                open={openSider}
            >
                <form className="space-y-10 ng-untouched ng-pristine ng-valid" onSubmit={handleSubmit(onSubmit, onErrors)}>
                    <div className="space-y-4">
                        <div>
                            <label for="id" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">User ID</label>
                            <input {...register("id")} type="text" name="id" id="id" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-400 bg-white text-gray-400 cursor-not-allowed" disabled />
                        </div>
                        <div>
                            <label for="name" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Name</label>
                            <input {...register("name")} type="text" name="name" id="name" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-400 bg-white text-black" />
                            {errors.name && <span className='sm:text-sm text-xs text-red-600'>{errors.name.message}</span>}
                        </div>
                        <div>
                            <label for="email" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Email</label>
                            <input {...register("email")} type="email" name="email" id="email" placeholder="abc@gmail.com" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-400 bg-white text-black" />
                            {errors.email && <span className='sm:text-sm text-xs text-red-600'>{errors.email.message}</span>}
                        </div>
                        <div>
                            <label for="phoneNumber" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Phone Number</label>
                            <input {...register("phoneNumber")} type="text" name="phoneNumber" id="phoneNumber" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-400 bg-white text-black" />
                            {errors.phoneNumber && <span className='sm:text-sm text-xs text-red-600'>{errors.phoneNumber.message}</span>}
                        </div>
                    </div>
                    <div>
                        <button type='button' className='text-white bg-red-500 rounded-sm px-4 py-2 mr-2 hover:bg-red-700 transition-all duration-500' onClick={onClose}>Cancel</button>
                        <button type='submit' className='text-white bg-blue-500 rounded-sm px-4 py-2 hover:bg-blue-700 transition-all duration-500'>Save</button>
                    </div>
                </form>
            </Drawer>
        </>
    )
}

export default UserManagement