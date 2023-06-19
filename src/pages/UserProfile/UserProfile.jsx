import { Button, Checkbox } from 'antd';
import React, { useState } from 'react'
import { USER_LOGIN } from '../../util/settings/Config';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SignInAction, editUserAction, resetEditUserSuccess } from '../../redux/slices/UserSlice/UserSlice';
import Swal from 'sweetalert2';
import { useEffect } from 'react';

const schema = yup.object({
  email: yup
    .string()
    .required("*Required")
    .email("Email has to be in the right format"),
  password: yup
    .string()
    .required("*Required")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Password must have at least 8 characters, including at least 1 alphabet, 1 digit and 1 special character"),
  name: yup
    .string()
    .required("*Required")
    .matches(/^[A-Za-z ]+$/, "Name only contains alphabets"),
  phoneNumber: yup
    .string()
    .required("*Required")
    .matches(/^\d{10,}$/, "Phone number has only digits, at least 10 digits")
});

function UserProfile() {
  const [allowUpdate, setAllowUpdate] = useState(false);
  const [isShowPass, setIsShowPass] = useState(false);
  const { user, editUserSuccess } = useSelector(state => state.UserSlice);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      id: user?.id,
      email: user?.email,
      password: user?.password,
      name: user?.name,
      phoneNumber: user?.phoneNumber
    },
    mode: "onChange",
    resolver: yupResolver(schema)
  });
  const dispatch = useDispatch();

  const onSubmit = (values) => {
    dispatch(editUserAction(values));
  }
  const onErrors = (errors) => {
    console.log('errors: ', errors);
  }

  const handleCancel = () => {
    setAllowUpdate(false);

    setValue("email", user.email);
    setValue("name", user.name);
    setValue("password", user.password);
    setValue("phoneNumber", user.phoneNumber);
  }

  const handleChangeShowPass = () => {
    setIsShowPass(!isShowPass);
  };

  if (editUserSuccess) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Update profile successfully !',
      showConfirmButton: false,
      timer: 1500
    });

    setValue("email", user.email);
    setValue("name", user.name);
    setValue("password", user.password);
    setValue("phoneNumber", user.phoneNumber);

    dispatch(SignInAction({
      email: user.email,
      password: user.password
    }));
    dispatch(resetEditUserSuccess());

    setAllowUpdate(false);
  }

  return <div className='w-1/2'>
    <form className="space-y-10 ng-untouched ng-pristine ng-valid" onSubmit={handleSubmit(onSubmit, onErrors)}>
      <div className="space-y-4">
        <div>
          <label for="userId" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">User ID</label>
          <input type="text" name="userId" id="userId" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-400 bg-white text-gray-400 cursor-not-allowed" value={user?.id} disabled />
        </div>
        <div>
          <label for="name" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Name</label>
          <input {...register("name")} type="text" name="name" id="name" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-400 bg-white text-black" disabled={!allowUpdate} />
          {errors.name && <span className='sm:text-sm text-xs text-red-600'>{errors.name.message}</span>}
        </div>
        <div>
          <label for="email" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Email</label>
          <input {...register("email")} type="email" name="email" id="email" placeholder="abc@gmail.com" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-400 bg-white text-black" disabled={!allowUpdate} />
          {errors.email && <span className='sm:text-sm text-xs text-red-600'>{errors.email.message}</span>}
        </div>
        <div>
          <label for="phoneNumber" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Phone Number</label>
          <input {...register("phoneNumber")} type="text" name="phoneNumber" id="phoneNumber" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-400 bg-white text-black" disabled={!allowUpdate} />
          {errors.phoneNumber && <span className='sm:text-sm text-xs text-red-600'>{errors.phoneNumber.message}</span>}
        </div>
        <div>
          <label for="password" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Password</label>
          <input {...register("password")} type={isShowPass ? "text" : "password"} name="password" id="password" placeholder="*****" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-400 bg-white text-black" disabled={!allowUpdate} />
          <Checkbox onChange={handleChangeShowPass}>Show password</Checkbox> <br />
          {errors.password && <span className='sm:text-sm text-xs text-red-600'>{errors.password.message}</span>}
        </div>
      </div>
      <div>
        {
          !allowUpdate ? <Button onClick={() => setAllowUpdate(true)}>Update</Button> : <>
            <button type='button' className='text-white bg-red-500 rounded-sm px-4 py-2 mr-2 hover:bg-red-700 transition-all duration-500' onClick={() => handleCancel()}>Cancel</button>
            <button type='submit' className='text-white bg-blue-500 rounded-sm px-4 py-2 hover:bg-blue-700 transition-all duration-500'>Save</button>
          </>
        }
      </div>
    </form>
  </div>
}

export default UserProfile