import { useAppDispatch, useAppSelector } from "@/app/_store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { TiDeleteOutline } from "react-icons/ti";
import { z } from "zod";
import Img from "next/image";
import {
  Delete,
  deleteParticularObjectAsync,
  updateExistingProjectAsync,
  updateProjectAsync,
} from "@/app/_features/portfolio/portfolioSlice";
import { FaChevronDown, FaChevronUp, FaGithub } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import { MdDeleteForever } from "react-icons/md";
import SurePrompt from "../SurePrompt";
type Props = {};

export default function Projects({}: Props) {
  const [showAddProject, setShowAddProject] = useState(false);
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const [updatingProjectIndex, setUpdatingProjectIndex] = useState<
    number | null
  >(null);

  return (
    <section className="csw md:pt-[150px] text-whites pb-24" id="projectSection">
      {/* checking if portfolio has any projects */}
      {portfolio.projects && portfolio.projects?.length > 0 ? (
        <div>
          <h1
            className=" text-xl md:text-2xl lg:text-4xl mb-6
       dark:text-theme text-black flex justify-between items-center "
          >
            Projects
            {portfolio.isOwner ? (
              <span
                className="text-xs  text-whites p-3 bg-gray-600 hover:bg-green-600  transition-all duration-200 ease-in-out rounded-xl hover:shadow-lg cursor-pointer"
                onClick={() => setShowAddProject(true)}
              >
                Add Project
              </span>
            ) : null}
          </h1>
          <div className="flex flex-col gap-10">
            {portfolio.projects.map((data, index) => (
              <Cards
                key={index}
                project={data}
                index={index}
                isOwner={portfolio.isOwner}
                setShowAddProject={setShowAddProject}
                setUpdatingProjectIndex={setUpdatingProjectIndex}
              />
            ))}
          </div>
        </div>
      ) : portfolio.isOwner ? (
        <section
          className="w-full border border-white bg-theme-dark dark:bg-theme-light text-black flex justify-center items-center rounded-lg  hover:shadow-xl hover:scale-105  cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() => setShowAddProject(true)}
        >
          <h2 className="text-xl p-5">
            <span className="text-2xl">+</span> Add your first projects
          </h2>
        </section>
      ) : null}
      {showAddProject ? (
        <AddProject
          setShowAddProject={setShowAddProject}
          updatingProjectIndex={updatingProjectIndex}
          setUpdatingProjectIndex={setUpdatingProjectIndex}
        />
      ) : null}
    </section>
  );
}

//Project Cards............................||||||||||||||||||||||||
type CardsProps = {
  project: {
    title: string;
    description: string;
    technologies: string[];
    projectUrl?: string;
    githubUrl?: string;
    image?: string;
  };
  index: number;
  isOwner: boolean;
  setShowAddProject: Dispatch<React.SetStateAction<boolean>>;
  setUpdatingProjectIndex: Dispatch<React.SetStateAction<number | null>>;
};
function Cards({
  project,
  index,
  isOwner,
  setShowAddProject,
  setUpdatingProjectIndex,
}: CardsProps) {
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const [isOpen,setIsOpen]=useState(false)
  const capitalizeText = (text: string) => {
    return text
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the words back into a string
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [descHeight, setDescHeight] = useState(0);
  const isEven = index % 2 === 0;
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    if (descriptionRef.current) {
      setDescHeight(descriptionRef.current.scrollHeight);
    }
  }, []);
  const handleDelete = () => {
    dispatch(
      deleteParticularObjectAsync({
        from: Delete.Project,
        index,
        routeName: portfolio.routeName,
      })
    );
  };
  return (
    <>
      <div className="bg-grays rounded-lg shadow-md overflow-hidden transition-transform duration-100 ease-out hover:scale-105 bg-opacity-15 w-full mx-auto">
        <div
          className={`flex flex-col ${
            isEven ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          <div className="relative w-full md:w-2/5 h-48 md:h-auto">
            <Img
              src={project.image ? project.image : "/project.webp"}
              alt={project.title}
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-300 hover:opacity-80"
            />
          </div>
          <div className="p-4 md:w-3/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-black dark:text-theme-dark">
                {capitalizeText(project.title)}
              </h3>

              <div
                className={`relative ${
                  isExpanded ? "" : "h-12 overflow-hidden"
                }`}
              >
                <p
                  ref={descriptionRef}
                  className="text-black mb-2 text-sm leading-relaxed dark:text-grays"
                >
                  {project.description}
                </p>
                {descHeight > 46 && !isExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#84d6f4] dark:from-[#232c3f] to-transparent"></div>
                )}
              </div>
              {descHeight > 46 && (
                <button
                  onClick={toggleDescription}
                  className="text-blue-muted hover:text-blue-800 mt-1 focus:outline-none flex items-center text-xs font-medium"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? "Show Less" : "Show More"}
                  {isExpanded ? (
                    <FaChevronUp className="ml-1 h-3 w-3" />
                  ) : (
                    <FaChevronDown className="ml-1 h-3 w-3" />
                  )}
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
              <div className="flex gap-3">
                {project.projectUrl && (
                  <Link
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grays font-semibold hover:scale-105 flex items-center text-xs "
                  >
                    <FaExternalLinkAlt className="mr-1 h-3 w-3" />
                    Visit
                  </Link>
                )}
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grays font-semibold hover:scale-105 flex items-center text-xs "
                  >
                    <FaGithub className="mr-1 h-3 w-3" />
                    GitHub
                  </Link>
                )}
              </div>
              {isOwner && (
                <div className="flex gap-3 text-sm md:text-base">
                  <div
                    className="cursor-pointer px-3 py-2 bg-gray-600 rounded-lg"
                    onClick={() => {
                      setUpdatingProjectIndex(index);
                      setShowAddProject(true);
                    }}
                  >
                    Edit{" "}
                  </div>
                  <div
                    className="cursor-pointer px-3 py-2  bg-reds rounded-lg"
                    onClick={()=>setIsOpen(true)}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isOpen&& <SurePrompt msg="Are you sure, You want to delete?" action={handleDelete} setIsOpen={setIsOpen}/>}
    </>
  );
}

// add project form !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

type AddProjectProps = {
  setShowAddProject: Dispatch<SetStateAction<boolean>>;
  updatingProjectIndex: number | null;
  setUpdatingProjectIndex: Dispatch<SetStateAction<number | null>>;
};

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required"),
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
  image: z.instanceof(File).or(z.string()).optional(),
});

export type ProjectData = z.infer<typeof projectSchema>;

function AddProject({
  setShowAddProject,
  updatingProjectIndex,
  setUpdatingProjectIndex,
}: AddProjectProps) {
  const [image, setImage] = useState<File>();
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const getDefaultValues = () => {
    if (updatingProjectIndex !== null && portfolio.projects) {
      return (
        portfolio.projects[updatingProjectIndex] || {
          title: "",
          description: "",
          technologies: [],
          projectUrl: "",
          githubUrl: "",
          image: "",
        }
      );
    }
    return {
      title: "",
      description: "",
      technologies: [],
      projectUrl: "",
      githubUrl: "",
      image: "",
    };
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<ProjectData>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  const [imagePreview, setImagePreview] = useState(""); // State to store the image preview
  const skillRef = useRef<HTMLInputElement>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 600,
    height: 400,
  });

  const handleFormClick = (e: React.MouseEvent<HTMLElement>) => {
    const section = e.target as HTMLElement;
    if (section.id === "addProjects") {
      setShowAddProject(false);
      setUpdatingProjectIndex(null);
    }
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

  useEffect(() => {
    setValue("image", image);
  }, [image, setValue]);

  useEffect(() => {
    if (updatingProjectIndex !== null) {
      setImagePreview(portfolio.projects?.[updatingProjectIndex].image!);
      setValue("image", portfolio.projects?.[updatingProjectIndex].image!);
    }
  }, [updatingProjectIndex, portfolio.projects, setValue]);
  const handleSkillClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent default action on button click

    // Check if skillRef.current exists before accessing its value
    if (skillRef.current) {
      const skill = skillRef.current.value.trim(); // Ensure skill is trimmed and non-empty

      if (skill) {
        const currentSkills = watch("technologies"); // Get the current list of technologies
        setValue("technologies", [...currentSkills, skill]); // Add the new skill to the list
        skillRef.current.value = ""; // Clear the input field after adding the skill
        clearErrors("technologies"); // Clear any existing errors
      } else {
        // Set an error if the input is empty
        setError("technologies", {
          type: "custom",
          message: "Technology shouldn't be empty",
        });
      }
    }
  };

  const handleSkill = (
    e: React.KeyboardEvent<HTMLInputElement>
    // index: number
  ) => {
    if (
      e.key === "Enter" ||
      e.key === "Done" ||
      e.key === "Go" ||
      e.keyCode === 13
    ) {
      e.preventDefault();
      let input = e.currentTarget.value;
      const skill = input.trim();

      if (skill) {
        const currentSkills = watch("technologies");
        setValue(`technologies`, [...currentSkills, skill]);
        e.currentTarget.value = "";
        clearErrors(`technologies`);
        return;
      }
      // event.currentTarget.value=''
      setError("technologies", {
        type: "custom",
        message: "Technologie should'nt be empty",
      });
    }
  };
  const deleteSkill = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    skilled: string
  ) => {
    const skills = watch("technologies") || [""]; // Ensure we have an array
    const updatedSkills = skills.filter((skill) => skill !== skilled);
    setValue("technologies", updatedSkills);
  };

  const onSubmit = async (data: ProjectData) => {
    console.log("Form Data:", data);
    if (updatingProjectIndex == null) {
      // Handle form submission logic here
      const totalNumbersOfProjests = portfolio.projects?.length || 0;
      await dispatch(
        updateProjectAsync({
          data,
          routename: portfolio.routeName,
          pathname:
            portfolio.routeName +
            "_ProjectImage_" +
            totalNumbersOfProjests +
            "_" +
            Date.now(),
          oldProjectImage: portfolio.projects?.[totalNumbersOfProjests]?.image,
        })
      );
    } else {
      const oldUrl =
        portfolio.projects && portfolio.projects[updatingProjectIndex]
          ? portfolio.projects[updatingProjectIndex].image
          : "";
      //while updating the project
      await dispatch(
        updateExistingProjectAsync({
          data,
          index: updatingProjectIndex,
          routeName: portfolio.routeName,
          key:
            portfolio.routeName +
            "_ProjectImage_" +
            updatingProjectIndex +
            "_" +
            Date.now(),
          oldUrl,
        })
      );
    }

    setShowAddProject(false);
    setUpdatingProjectIndex(null);
  };
  return (
    <section
      className="fixed z-10 w-full h-full top-0 left-0 dark:bg-black dark:bg-opacity-90 bg-theme-light bg-opacity-65"
      id="addProjects"
      onClick={handleFormClick}
    >
      <section className="fixed top-[80px] left-[50%] csw max-h-[80vh] overflow-y-auto border translate-x-[-50%]  bg-theme-dark dark:bg-black rounded-lg flex flex-col justify-between dark:text-whites bg-opacity-65">
        {/* Head of the form */}
        <div className="sticky top-0 z-10 border-b bg-theme-dark dark:bg-black flex justify-between items-center px-4 py-2 text-lg md:text-xl dark:text-theme">
          {updatingProjectIndex != null ? "Edit Project" : "Add Project"}
          <span
            onClick={() => {
              setShowAddProject(false);
              setUpdatingProjectIndex(null);
            }}
          >
            <TiDeleteOutline className="scale-150 dark:text-white cursor-pointer hover:text-reds" />
          </span>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-3 text-sm ">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Project Title*</label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full p-2 border rounded"
                />
                {errors.title && (
                  <span className="text-red-500">{errors.title.message}</span>
                )}
              </div>

              <div>
                <label className="block mb-2">Technologies Used*</label>
                <span className="flex gap-2 flex-wrap mb-2">
                  {watch("technologies").map((skill, skillIndex) => (
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
                  ))}
                </span>
                <div className="relative">
                  <input
                    type="text"
                    ref={skillRef}
                    onKeyDown={(e) => handleSkill(e)}
                    className="w-full p-2 border rounded"
                    placeholder="Press Enter To Add"
                  />
                  <span
                    className="rounded-lg py-2 px-3 bg-greens absolute top-[50%] translate-y-[-50%] right-2 text-xs"
                    onClick={(e) => handleSkillClick(e)}
                  >
                    Add
                  </span>
                </div>
                {errors.technologies && (
                  <span className="text-red-500">
                    {errors.technologies.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col  ">
                <label className="block mb-2">Description*</label>
                <textarea
                  {...register("description")}
                  className="w-full p-2 border rounded h-32 overflow-auto"
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Project URL</label>
                <input
                  type="text"
                  {...register("projectUrl")}
                  className="w-full p-2 border rounded"
                />
                {errors.projectUrl && (
                  <span className="text-red-500">
                    {errors.projectUrl.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-2">GitHub URL</label>
                <input
                  type="text"
                  {...register("githubUrl")}
                  className="w-full p-2 border rounded"
                />
                {errors.githubUrl && (
                  <span className="text-red-500">
                    {errors.githubUrl.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-2">Project Image</label>
                <input
                  type="file"
                  accept="image/*"
                  title="projectImage"
                  placeholder="Select Image"
                  className="w-full p-2 border rounded"
                  onChange={handleImageChange} // Handle file change to preview the image
                />
                {errors.image && (
                  <span className="text-red-500">{errors.image.message}</span>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <label className="block mb-2">Image Preview:</label>
                  <div className="relative">
                    <Img
                      src={imagePreview}
                      width={imageDimensions.width}
                      height={imageDimensions.height}
                      alt="Selected Preview"
                      className="w-full  object-cover rounded"
                    ></Img>
                    <span
                      className="absolute top-3 right-3  bg-reds rounded-full cursor-pointer hover:scale-105"
                      onClick={() => {
                        setImagePreview("");
                        setValue("image", undefined);
                      }}
                    >
                      <MdDeleteForever className="m-2 scale-125" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 mt-3"
          >
            {updatingProjectIndex == null ? "Add Project" : "Update Project"}
          </button>
        </form>
      </section>
    </section>
  );
}
