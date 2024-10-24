import { useAppDispatch, useAppSelector } from '@/app/_store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TiDeleteOutline } from 'react-icons/ti'
import { z } from 'zod'
import Img from 'next/image'
import { PortfolioStatus, updateProjectAsync, updateStatus } from '@/app/_features/portfolio/portfolioSlice'
import { FaChevronDown, FaChevronUp, FaGithub, FaSquareGithub } from 'react-icons/fa6'
import { FaExternalLinkAlt } from 'react-icons/fa'
type Props = {}

export default function Projects({}: Props) {
  const [showAddProject,setShowAddProject]=useState(false)
  const portfolio=useAppSelector((state)=>state.portfolioSlice)

  return (
    <section className='csw md:pt-[150px] text-whites pb-24'>
      {/* checking if portfolio has any projects */}
      {portfolio.projects && portfolio.projects?.length>0?(<div>

      <h1 className=' text-xl md:text-2xl lg:text-4xl mb-6
       dark:text-theme text-black flex justify-between items-center '>Projects
         {portfolio.isOwner?<span className='text-xs hover:text-sm text-whites p-3 bg-gray-600 hover:bg-green-600 hover:scale-105 transition-all duration-200 ease-in-out rounded-xl hover:shadow-lg cursor-pointer' onClick={()=>setShowAddProject(true)}>Add Project</span>:null}
      </h1>
      <div className='flex flex-col gap-10'>

      {portfolio.projects.map((data,index)=>(
        
        
        <Cards key={index} project={data} index={index} isOwner={portfolio.isOwner}/>
        
      ))
      
    }
    </div>
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
type CardsProps={
  project:{
    title: string;
    description: string;
    technologies: string[];
    projectUrl?: string;
    githubUrl?: string;
    image?: string;
  },
  index:number
  isOwner:boolean
}
function Cards({project,index,isOwner}: CardsProps){
  const  capitalizeText=(text:string)=> {
    return text
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join the words back into a string
    }
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef=useRef<HTMLDivElement>(null)
  const [descHeight,setDescHeight]=useState(0)
  const isEven = index % 2 === 0;
    const toggleDescription = () => {
    setIsExpanded(!isExpanded)
  }
  useEffect(()=>{
    if(descriptionRef.current){
      setDescHeight(descriptionRef.current.scrollHeight)
    }
  },[])
return(
  <>
  <div className="bg-grays rounded-lg shadow-md overflow-hidden transition-transform duration-100 ease-out hover:scale-105 bg-opacity-15 w-full mx-auto">
      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        <div className="relative w-full md:w-2/5 h-48 md:h-auto">
       

          <Img
          src={project.image?project.image:'/project.webp'}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300 hover:opacity-80"
          />
      
        </div>
        <div className="p-4 md:w-3/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-black dark:text-theme-dark">{capitalizeText(project.title)}</h3>
            <div className={`relative ${isExpanded ? '' : 'h-12 overflow-hidden'}`}>
              <p ref={descriptionRef} className="text-black mb-2 text-sm leading-relaxed dark:text-grays">{project.description}</p>
              {descHeight > 46 && !isExpanded &&(
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#84d6f4] dark:from-[#232c3f] to-transparent"></div>
              )}
            </div>
            {descHeight > 46 && (
              <button
                onClick={toggleDescription}
                className="text-blue-muted hover:text-blue-800 mt-1 focus:outline-none flex items-center text-xs font-medium"
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
                {isExpanded ? <FaChevronUp  className="ml-1 h-3 w-3" /> : <FaChevronDown className="ml-1 h-3 w-3" />}
              </button>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {project.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-2 py-1 bg-gray-600 text-whites   rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-3">
            <div className='flex gap-3'>

            {project.projectUrl && (
              <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-grays font-semibold hover:scale-105 flex items-center text-xs "
              >
                <FaExternalLinkAlt className="mr-1 h-3 w-3" />View Project
              </a>
            )}
            {project.githubUrl && (
              <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-grays font-semibold hover:scale-105 flex items-center text-xs "
              >
                <FaGithub className="mr-1 h-3 w-3" />GitHub
              </a>
            )}
            </div>
            {isOwner&&

              <div className='flex gap-3 text-sm md:text-base'> 
                <div>Edit </div>
                <div>Delete</div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
    
  
  </>
)
}


// add project form !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


type AddProjectProps = {
  setShowAddProject: Dispatch<SetStateAction<boolean>>;
};

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z.array(z.string()).min(1,'At least one technology is required'),
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
  const dispatch=useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
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
   
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to store the image preview
  const [imageDimensions,setImageDimensions]=useState({width:0,height:0});
 const portfolio=useAppSelector((state)=>state.portfolioSlice)
  
 

  const handleFormClick = (e: React.MouseEvent<HTMLElement>) => {
    const section = e.target as HTMLElement;
    if (section.id === 'addProjects') setShowAddProject(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
       const img = new Image();
       const imgURL = URL.createObjectURL(file);
        img.src = imgURL;

      img.onload = () => {
        // Set image dimensions dynamically
        setImageDimensions({ width: img.width, height: img.height });
      };
      setImagePreview(imgURL); 
      //image is not set yet so use Effect will take care when image gets updated
        setImage(file);
    }
  };

useEffect(()=>{
    setValue('image',image)
},[image,setValue])


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
                message: "Technologie should\'nt be empty",
              });
            }
          };
          const deleteSkill = (
            e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            skilled: string
          ) => {
            const skills = watch('technologies') || ['']; // Ensure we have an array
            const updatedSkills = skills.filter((skill) => skill !== skilled);
            setValue('technologies', updatedSkills);
          };
          
          
          const onSubmit =async (data: ProjectData) => {
            console.log("Form Data:", data);
            // Handle form submission logic here
            const totalNumbersOfProjests=portfolio.projects?.length || 0;
            await dispatch(updateProjectAsync({data,portfolioId:portfolio._id.toString(),pathname:portfolio.routeName+'_ProjectImage_'+(totalNumbersOfProjests)+'_'+(Date.now()),oldProjectImage:portfolio.projects?.[totalNumbersOfProjests]?.image}))
            setShowAddProject(false); 
       

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
            <label className='block mb-2'>Technologies Used</label>
            <span className='flex gap-2 flex-wrap mb-2'>{watch('technologies').map( (skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className=" px-2 py-1 text-black dark:text-gray-400 flex justify-center items-center gap-3 rounded-md bg-theme dark:bg-black-bg2"
                >
                  {skill.toUpperCase()}
                  <span
                    className="text-xl cursor-pointer hover:text-reds"
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


