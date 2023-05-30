import React, { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Checkbox } from 'antd';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { SignInAction, resetError } from '../../redux/slices/UserSlice/UserSlice';

const schema = yup.object({
  email: yup
    .string()
    .required("*Required")
    .email("Email has to be in the right format"),
  password: yup
    .string()
    .required("*Required")
})

function SignIn() {
  const [isShowPass, setIsShowPass] = useState(false);
  const { user, error } = useSelector(state => state.UserSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: "onChange",
    resolver: yupResolver(schema)
  });

  // check state user trên store để xem đã đăng nhập chưa, thành công rồi thì back về trang trước
  if (user) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sign in successfully !',
      showConfirmButton: false,
      timer: 1500
    })

    const url = searchParams.get("redirectUrl") || '/';
    return <Navigate to={url} replace />
  }
  // đăng nhập không thành công
  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Sign in failed.',
      text: 'Check your email and password again or the admin might delete your account.',
      confirmButtonColor: "#1677ff"
    });

    dispatch(resetError());
  }
  const onSubmit = (values) => {
    dispatch(SignInAction(values));
  }
  const onErrors = (errors) => {
    console.log('errors: ', errors);
  }

  const handleChangeShowPass = () => {
    setIsShowPass(!isShowPass);
  };

  return (
    <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 border border-2 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="my-3 text-4xl font-bold">Sign in</h1>
        <p className="text-sm text-gray-400">Sign in to access your Jira account</p>
      </div>
      <form className="space-y-12 ng-untouched ng-pristine ng-valid" onSubmit={handleSubmit(onSubmit, onErrors)}>
        <div className="space-y-4">
          <div>
            <label for="email" className="block mb-2 text-sm font-semibold">Email</label>
            <input {...register("email")} type="email" name="email" id="email" placeholder="abc@gmail.com" className="w-full px-3 py-2 border rounded-md border-gray-700 bg-white text-black" />
            {errors.email && <span className='sm:text-sm text-xs text-red-600'>{errors.email.message}</span>}
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label for="password" className="text-sm font-semibold">Password</label>
              <a rel="noopener noreferrer" href="#" className="text-xs hover:underline text-gray-400">Forgot password?</a>
            </div>
            <input {...register("password")} type={isShowPass ? "text" : "password"} name="password" id="password" placeholder="*****" className="w-full px-3 py-2 border rounded-md border-gray-700 bg-white text-black" />
            <Checkbox onChange={handleChangeShowPass}>Show password</Checkbox>
            {errors.password && <span className='sm:text-sm text-xs text-red-600'>{errors.password.message}</span>}
          </div>
          <div className="my-6 space-y-4">
            <button aria-label="Login with Facebook" role="button" className="flex items-center justify-center w-full p-4 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-400 focus:ring-blue-400 text-black hover:text-gray-600">
              <i className="fab fa-facebook text-xl transition-all duration-500"></i>
              <p className='transition-all duration-500'>Login with Facebook</p>
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <button type="submit" className="w-full px-8 py-3 font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-900 transition-all duration-500">Sign in</button>
          </div>
          <p className="px-6 text-sm text-center text-gray-400">Don't have an account yet?
            <a rel="noopener noreferrer" href="#" className="hover:underline text-violet-400" onClick={() => navigate('/user/sign-up')}>Sign up</a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default SignIn