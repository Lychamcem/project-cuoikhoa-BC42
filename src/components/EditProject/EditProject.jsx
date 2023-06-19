import { Drawer } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { HIDE_SIDER } from '../../redux/reducers/ProjectManageReducer/ProjectManageTypes';
import { Editor } from '@tinymce/tinymce-react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateProjectAction } from '../../redux/reducers/ProjectManageReducer/ProjcetManageActions';

const schema = yup.object({
    projectName: yup
        .string()
        .required("*Required"),
    description: yup
        .string()
        .required("*Required"),
    categoryId: yup
        .number()
        .required("*Required")
})

function EditProject() {
    const { openSider, searchTerm, projectDetail } = useSelector(state => state.ProjectManageReducer);
    const [initialDescription, setInitialDescription] = useState('');
    const { allCategory } = useSelector(state => state.HelperReducer);
    const editorRef = useRef(null);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        setError,
        formState: { errors }
    } = useForm({
        defaultValues: {
            id: projectDetail?.id,
            projectName: projectDetail?.projectName,
            creator: projectDetail?.creator,
            description: projectDetail?.description,
            categoryId: projectDetail?.projectCategory?.id
        },
        mode: "onChange",
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        setValue('id', projectDetail?.id);
        setValue('projectName', projectDetail?.projectName);
        setValue('creator', projectDetail?.creator?.id);
        setValue('description', projectDetail?.description); setInitialDescription(projectDetail?.description);
        setValue('categoryId', projectDetail?.projectCategory?.id);
    }, [projectDetail]);

    const onSubmit = (values) => {
        if (+editorRef.current.getContent({ format: "text" }) === 0) {
            setError("description", {
                type: "",
                message: "*Required"
            })
        } else {
            dispatch(updateProjectAction(values.id, values, searchTerm, resetForm));
        }
    }

    const onErrors = (errors) => {
        console.log('errors: ', errors);
    }

    const onClose = () => {
        dispatch({
            type: HIDE_SIDER
        })
    };

    const resetForm = () => {
        reset();

        // reset content of editor
        setInitialDescription('');
    }

    return (
        <Drawer
            title={<h1 className='text-2xl font-bold'>Edit Project</h1>}
            placement={'right'}
            onClose={onClose}
            open={openSider}
        >
            <form className="space-y-10 ng-untouched ng-pristine ng-valid" onSubmit={handleSubmit(onSubmit, onErrors)}>
                <div className="space-y-4">
                    <div>
                        <label for="projectId" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Project ID</label>
                        <input {...register("id")} type="text" name="projectId" id="projectId" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-700 bg-white text-gray-400 cursor-not-allowed" value={projectDetail?.id} disabled />
                    </div>
                    <div>
                        <label for="projectName" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Project Name</label>
                        <input {...register("projectName")} type="text" name="projectName" id="projectName" className="w-full px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-700 bg-white text-black" />
                        {errors.projectName && <span className='sm:text-sm text-xs text-red-600'>{errors.projectName.message}</span>}
                    </div>
                    <div>
                        <label for="description" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Description</label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                required: '*Required'
                            }}
                            render={({ field: { onChange, onBlur } }) => (
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
                                    onBlur={onBlur}
                                />
                            )}
                        />
                        {errors.description && <span className='sm:text-sm text-xs text-red-600'>{errors.description.message}</span>}
                    </div>
                    <div>
                        <label for="categoryId" className="block mb-2 text-xs md:text-sm font-semibold text-gray-500">Project Category</label>
                        <select {...register("categoryId")} name="categoryId" id="categoryId" className="w-1/2 px-2 py-1 md:px-3 md:py-2 border rounded-md border-gray-700 bg-white text-black" >
                            {
                                allCategory?.map((category) => {
                                    return <option value={category.id} key={category.id}>{category.projectCategoryName}</option>
                                })
                            }
                        </select> <br />
                        {errors.categoryId && <span className='sm:text-sm text-xs text-red-600'>{errors.categoryId.message}</span>}
                    </div>
                </div>
                <div>
                    <button type='button' className='text-white bg-red-500 rounded-sm px-4 py-2 mr-2 hover:bg-red-700 transition-all duration-500' onClick={onClose}>Cancel</button>
                    <button type='submit' className='text-white bg-blue-500 rounded-sm px-4 py-2 hover:bg-blue-700 transition-all duration-500'>Save</button>
                </div>
            </form>
        </Drawer>
    )
}

export default EditProject