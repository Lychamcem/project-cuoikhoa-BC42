import { Checkbox } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SignUpAction, resetError, resetSignUpSuccess } from '../../redux/slices/UserSlice/UserSlice';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

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

function SignUp() {
  const { signUpSuccess, error } = useSelector(state => state.UserSlice);
  const navigate = useNavigate();
  const [isShowPass, setIsShowPass] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phoneNumber: ''
    },
    mode: "onChange",
    resolver: yupResolver(schema)
  });

  const onSubmit = (values) => {
    dispatch(SignUpAction(values));
  }
  const onErrors = (errors) => {
    console.log('errors: ', errors);
  }

  // đăng ký thành công -> chuyển hướng sang trang đăng nhập đồng thời reset thuộc tính success trên store
  if (signUpSuccess) {
    dispatch(resetSignUpSuccess());

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sign up successfully !',
      showConfirmButton: false,
      timer: 1500
    });

    reset();

    navigate("/user/sign-in");
  }
  // đăng ký không thành công
  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Sign up failed.',
      text: 'Please try again !',
      confirmButtonColor: "#1677ff"
    });

    dispatch(resetError());
  }

  const handleChangeShowPass = () => {
    setIsShowPass(!isShowPass);
  };

  return (
    <div className="flex flex-col w-4/5 max-w-md p-6 rounded-md sm:p-10 border border-2 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="my-3 text-2xl md:text-3xl lg:text-4xl font-bold">Sign up</h1>
        <p className="text-xs sm:text-sm text-gray-400">Sign up to use Jira services</p>
      </div>
      <form className="space-y-12 ng-untouched ng-pristine ng-valid" onSubmit={handleSubmit(onSubmit, onErrors)}>
        <div className="space-y-4">
          <div>
            <label for="email" className="block mb-2 text-xs md:text-sm font-semibold">Email</label>
            <input {...register("email")} type="email" name="email" id="email" placeholder="abc@gmail.com" className="w-full px-3 py-2 border rounded-md border-gray-700 bg-white text-black" />
            {errors.email && <span className='sm:text-sm text-xs text-red-600'>{errors.email.message}</span>}
          </div>
          <div>
            <label for="password" className="text-xs md:text-sm font-semibold">Password</label>
            <input {...register("password")} type={isShowPass ? "text" : "password"} name="password" id="password" placeholder="*****" className="w-full px-3 py-2 border rounded-md border-gray-700 bg-white text-black" />
            <Checkbox onChange={handleChangeShowPass}>Show password</Checkbox> <br />
            {errors.password && <span className='sm:text-sm text-xs text-red-600'>{errors.password.message}</span>}
          </div>
          <div>
            <label for="name" className="block mb-2 text-xs md:text-sm font-semibold">Name</label>
            <input {...register("name")} type="text" name="name" id="name" placeholder="Full name" className="w-full px-3 py-2 border rounded-md border-gray-700 bg-white text-black" />
            {errors.name && <span className='sm:text-sm text-xs text-red-600'>{errors.name.message}</span>}
          </div>
          <div>
            <label for="phoneNumber" className="block mb-2 text-xs md:text-sm font-semibold">Phone number</label>
            <input {...register("phoneNumber")} type="text" name="phoneNumber" id="phoneNumber" placeholder="0123456789" className="w-full px-3 py-2 border rounded-md border-gray-700 bg-white text-black" />
            {errors.phoneNumber && <span className='sm:text-sm text-xs text-red-600'>{errors.phoneNumber.message}</span>}
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <button type="submit" className="w-full px-8 py-3 font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-900 transition-all duration-500">Sign up</button>
          </div>
          <p className="px-6 text-xs md:text-sm text-center text-gray-400">You already have account?
            <a rel="noopener noreferrer" href="#" className="hover:underline text-violet-400" onClick={() => navigate('/user/sign-in')}>Sign in</a>.
          </p>
        </div>
      </form>
    </div>
  )
}

export default SignUp