import { useAppSelector } from '@/app/_store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { TiDeleteOutline } from 'react-icons/ti'
import { z } from 'zod'
import Img , { getImageProps } from 'next/image'
type Props = {}

export default function Projects({}: Props) {
  const [showAddProject,setShowAddProject]=useState(false)
  const portfolio=useAppSelector((state)=>state.portfolioSlice)

  return (
    <section className='csw md:pt-[150px] text-whites '>
      {/* checking if portfolio has any projects */}
      {portfolio.projects && portfolio.projects?.length>0?(<div>

      <h1 className='px-6 text-xl text-theme'>Projects</h1>
      {portfolio.projects.map((data,index)=>(
        
        
        <Cards key={index}/>
        
      ))
      
    }
    </div>):(
        portfolio.isOwner ? (
          <section className='w-full border border-white bg-theme-dark dark:bg-theme-light text-black flex justify-center items-center rounded-lg  hover:shadow-xl hover:scale-105  cursor-pointer transition-all duration-300 ease-in-out'  onClick={()=>setShowAddProject(true)}>
            <h2 className='text-xl p-5'><span className='text-2xl'>+</span> Add your first projects</h2>
          </section>
        ) : null
      )
  }
    {showAddProject?<AddProject setShowAddProject={setShowAddProject}/>:null}
    </section>
  )
}

//Project Cards............................||||||||||||||||||||||||
function Cards(){
return(
  <>
     <div>
      testing
     </div>
  </>
)
}



type AddProjectProps = {
  setShowAddProject: Dispatch<SetStateAction<boolean>>;
};

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z.array(z.string()).nonempty('At one technology is required'),
  projectUrl: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .default(""),
  githubUrl: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .default(""),
  image: z.instanceof(File).optional(),
});

export type ProjectData = z.infer<typeof projectSchema>;

function AddProject({ setShowAddProject }: AddProjectProps) {
  const [image,setImage]=useState<File>()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    setError,
    clearErrors
  } = useForm<ProjectData>({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      technologies: [],
      projectUrl: '',
      githubUrl: '',
      image: undefined,
    },
  });
    // const {fields:skillFields,remove:removeSkill,append:appendSkill}=useFieldArray({
    //         control,
    //        name:''
    //     })
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to store the image preview
  const [imageDimensions,setImageDimensions]=useState({width:0,height:0});
 
  
 

  const handleFormClick = (e: React.MouseEvent<HTMLElement>) => {
    const section = e.target as HTMLElement;
    if (section.id === 'addProjects') setShowAddProject(false);
  };

  const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
       const img = new Image();
       const imgURL = URL.createObjectURL(file);
        img.src = imgURL;

      img.onload = () => {
        // Set image dimensions dynamically
        setImageDimensions({ width: img.width, height: img.height });
      };
      setImagePreview(imgURL); // Generate a preview URL for the selected image
       await setImage(file);
      setValue('image',image)
    }
  };

  const onSubmit = (data: ProjectData) => {
    console.log("Form Data:", data);
    // Handle form submission logic here
    setShowAddProject(false); // Close modal after submission
  };
useEffect(
  ()=>{
    console.log(errors);
    
  },[errors]
)
 const handleSkill = (
            event: React.KeyboardEvent<HTMLInputElement>,
            // index: number
          ) => {
            if (event.key === "Enter") {
              event.preventDefault();
              let input = event.currentTarget.value;
              const skill = input.trim();
           
        
              if (skill) {
                const currentSkills = watch('technologies');
                setValue(`technologies`, [...currentSkills, skill]);
                event.currentTarget.value = "";
                clearErrors(`technologies`);
                return;
              }
              // event.currentTarget.value=''
              setError('technologies', {
                type: "custom",
                message: "Technologies must have one elemenet",
              });
            }
          };
          const deleteSkill = (
            e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            skilled: string
          ) => {
            const skills = watch('technologies') || ['']; // Ensure we have an array
            const updatedSkills = skills.filter((skill) => skill !== skilled);
          
           
           if(updatedSkills.length>0){
            
            setValue('technologies', updatedSkills);
           }
          };
          
          
  return (
    <section
      className='fixed w-full h-full top-0 left-0 dark:bg-black dark:bg-opacity-90 bg-theme-light bg-opacity-65'
      id='addProjects'
      onClick={handleFormClick}
    >
      <section className='fixed top-[50%] left-[50%] w-[80vw] md:w-[60vw] lg:w-[40vw] max-h-[80vh] overflow-scroll overflow-x-hidden border translate-x-[-50%] translate-y-[-50%] bg-theme-dark dark:bg-black rounded-lg flex flex-col justify-between'>
        {/* Head of the form */}
        <div className='flex justify-between items-center p-4 text-lg md:text-2xl dark:text-theme'>
          Add Project
          <span onClick={() => setShowAddProject(false)}>
            <TiDeleteOutline className='scale-150 dark:text-white cursor-pointer' />
          </span>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='p-4 space-y-4'>
          <div>
            <label className='block mb-2'>Project Title</label>
            <input
              type='text'
              {...register('title')}
              className='w-full p-2 border rounded'
            />
            {errors.title && <span className='text-red-500'>{errors.title.message}</span>}
          </div>

          <div>
            <label className='block mb-2'>Description</label>
            <textarea
              {...register('description')}
              className='w-full p-2 border rounded'
            />
            {errors.description && <span className='text-red-500'>{errors.description.message}</span>}
          </div>

          <div>
            <label className='block mb-2'>Technologies</label>
            <span className='flex gap-2 flex-wrap mb-2'>{watch('technologies').map( (skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className=" px-2 py-1 text-black dark:text-gray-400 flex justify-center items-center gap-3 rounded-md bg-theme dark:bg-black-bg2"
                >
                  {skill}
                  <span
                    className="text-xl cursor-pointer"
                    onClick={(e) => deleteSkill(e, skill)}
                  >
                    x
                  </span>
                </div>
              ))}</span>
            <input
              type='text'
               onKeyDown={(e) => handleSkill(e, )}
              className='w-full p-2 border rounded'
              placeholder="Press Enter To Add"
            />
            {errors.technologies && <span className='text-red-500'>{errors.technologies.message}</span>}
          </div>

          <div>
            <label className='block mb-2'>Project URL</label>
            <input
              type='text'
              {...register('projectUrl')}
              className='w-full p-2 border rounded'
            />
            {errors.projectUrl && <span className='text-red-500'>{errors.projectUrl.message}</span>}
          </div>

          <div>
            <label className='block mb-2'>GitHub URL</label>
            <input
              type='text'
              {...register('githubUrl')}
              className='w-full p-2 border rounded'
            />
            {errors.githubUrl && <span className='text-red-500'>{errors.githubUrl.message}</span>}
          </div>

          <div>
            <label className='block mb-2'>Project Image</label>
            <input
              type='file'
              accept='image/*'
              
              className='w-full p-2 border rounded'
              onChange={handleImageChange} // Handle file change to preview the image
            />
            {errors.image && <span className='text-red-500'>{errors.image.message}</span>}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className='mt-4'>
              <label className='block mb-2'>Image Preview:</label>
              <Img
                src={imagePreview}
                width={imageDimensions.width}
                height={imageDimensions.height}
                alt="Selected Preview"
                className='w-full h-48 object-cover rounded'
                
              ></Img>
          
            </div>
          )}

          <button
            type='submit'
            className='w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Add Project
          </button>
        </form>
      </section>
    </section>
  );
}


