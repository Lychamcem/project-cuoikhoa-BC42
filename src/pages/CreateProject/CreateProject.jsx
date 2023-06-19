import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createProjectAction } from '../../redux/reducers/ProjectManageReducer/ProjcetManageActions';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  projectName: yup
    .string()
    .required("*Required"),
  alias: yup
    .string()
    .required("*Required"),
  description: yup
    .string()
    .required("*Required"),
  categoryId: yup
    .number()
    .test("choose-category", "*Required", function (value) {
      return value !== -1;
    })
    .required("*Required")
})

function CreateProject() {
  const { allCategory } = useSelector(state => state.HelperReducer);
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      projectName: '',
      alias: '',
      description: '',
      categoryId: -1
    },
    mode: "onChange",
    resolver: yupResolver(schema)
  });

  const onSubmit = (values) => {
    dispatch(createProjectAction(values, reset));
  }

  const onErrors = (errors) => {
    console.log('errors: ', errors);
  }
  console.log("allCategory: ", allCategory);
  return (
    <div style={{
      width: '70%'
    }}>
      <h1 className='text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-left'>Create Project</h1>
      <form className="space-y-10 ng-untouched ng-pristine ng-valid" onSubmit={handleSubmit(onSubmit, onErrors)}>
        <div className="space-y-4">
          <div>
            <label for="projectName" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Project Name</label>
            <input {...register("projectName")} type="text" name="projectName" id="projectName" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-700 bg-white text-black" />
            {errors.projectName && <span className='sm:text-sm text-xs text-red-600'>{errors.projectName.message}</span>}
          </div>
          <div>
            <label for="alias" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Alias</label>
            <input {...register("alias")} type="text" name="alias" id="alias" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-700 bg-white text-black" />
            {errors.alias && <span className='sm:text-sm text-xs text-red-600'>{errors.alias.message}</span>}
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
          <div>
            <label for="categoryId" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Project Category</label>
            <select {...register("categoryId")} name="categoryId" id="categoryId" className="w-1/2 px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-700 bg-white text-black">
              {
                allCategory?.map((category) => {
                  return <option value={category.id} key={category.id}>{category.projectCategoryName}</option>
                })
              }
            </select>
            <br />
            {errors.categoryId && <span className='sm:text-sm text-xs text-red-600'>{errors.categoryId.message}</span>}
          </div>
        </div>
        <div>
          <button type='button' className='text-white bg-red-500 rounded-sm px-4 py-2 mr-2 hover:bg-red-700 transition-all duration-500' onClick={() => navigate(-1)}>Cancel</button>
          <button type='submit' className='text-white bg-blue-500 rounded-sm px-4 py-2 hover:bg-blue-700 transition-all duration-500'>Save</button>
        </div>
      </form>
    </div>
  )
}

export default CreateProject