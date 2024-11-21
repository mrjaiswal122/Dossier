"use client ";
import { useAppDispatch, useAppSelector } from "@/app/_store/hooks";
import React, { Dispatch, useRef, useState } from "react";
import SurePrompt from "../SurePrompt";
import { FiTrash } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import {
  Delete,
  deleteParticularObjectAsync,
  updateSkillAsync,
} from "@/app/_features/portfolio/portfolioSlice";
import { IPortfolio } from "@/app/_models/portfolio";
import formatHeading from "@/app/_util/formatHeading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TiDeleteOutline } from "react-icons/ti";
const skillSchema: z.ZodType<NonNullable<IPortfolio["skills"]>[number]> =
  z.object({
    category: z.string().min(3, "Category is required"),
    skills: z.array(z.string()).nonempty("At least one skill is required"),
    proficiency: z.string().optional(),
  });
export type Skill = z.infer<typeof skillSchema>;
type Props = {};

export default function Skills({}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [updatingSkillIndex, setUpdatingSkillIndex] = useState<number | null>(
    null
  );
  const portfolio = useAppSelector((state) => state.portfolioSlice);

  return (
    <section className="csw md:pt-[150px] text-whites pb-24" id="skillSection">
      {/* checking if portfolio has any Skills  */}
      {portfolio.skills && portfolio.skills?.length > 0 ? (
        <div>
          <h1
            className=" text-xl md:text-2xl lg:text-4xl mb-6
       dark:text-theme text-black flex justify-between items-center "
          >
            Skills
            {portfolio.isOwner ? (
              <span
                className="text-xs  text-whites p-3 bg-gray-600 hover:bg-green-600  transition-all duration-200 ease-in-out rounded-xl hover:shadow-lg cursor-pointer"
                onClick={() => setShowForm(true)}
              >
                Add Category
              </span>
            ) : null}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {portfolio.skills.map((data, index) => (
              <SkillCard
                key={index}
                skillCategory={data}
                index={index}
                isOwner={portfolio.isOwner}
                setShowForm={setShowForm}
                setUpdatingSkillIndex={setUpdatingSkillIndex}
              />
            ))}
          </div>
        </div>
      ) : portfolio.isOwner ? (
        <section
          className="w-full border border-white bg-theme-dark dark:bg-theme-light text-black flex justify-center items-center rounded-lg  hover:shadow-xl hover:scale-105  cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() => setShowForm(true)}
        >
          <h2 className="text-xl p-5">
            <span className="text-2xl">+</span> Add Your Skills{" "}
          </h2>
        </section>
      ) : null}
      {showForm ? (
        <AddSkillForm
          setShowForm={setShowForm}
          updatingSkillIndex={updatingSkillIndex}
          setUpdatingSkillIndex={setUpdatingSkillIndex}
        />
      ) : null}
    </section>
  );
}

interface AddSkillFormProps {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  updatingSkillIndex: number | null;
  setUpdatingSkillIndex: React.Dispatch<React.SetStateAction<number | null>>;
}
function AddSkillForm({
  setShowForm,
  updatingSkillIndex,
  setUpdatingSkillIndex,
}: AddSkillFormProps) {
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const skillRef = useRef<HTMLInputElement>(null);

  const getDefaultValues = (): NonNullable<IPortfolio["skills"]>[number] => {
    if (updatingSkillIndex !== null && portfolio.skills) {
      return portfolio.skills[updatingSkillIndex];
    }
    return {
      category: "",
      skills: [],
      proficiency: "",
    };
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    watch,
    setError,
  } = useForm<Skill>({
    resolver: zodResolver(skillSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });
  const handleFormClick = (e: React.MouseEvent<HTMLElement>) => {
    const section = e.target as HTMLElement;
    if (section.id === "addSkill") {
      setShowForm(false);
      setUpdatingSkillIndex(null);
    }
  };
  const handleSkillClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent default action on button click

    // Check if skillRef.current exists before accessing its value
    if (skillRef.current) {
      const skill = skillRef.current.value.trim(); // Ensure skill is trimmed and non-empty

      if (skill) {
        const currentSkills = watch("skills"); // Get the current list of technologies

        setValue("skills", [...(currentSkills ?? []), skill]);
        // Add the new skill to the list
        skillRef.current.value = ""; // Clear the input field after adding the skill
        clearErrors("skills"); // Clear any existing errors
      } else {
        // Set an error if the input is empty
        setError("skills", {
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
        const currentSkills = watch("skills");
        setValue("skills", [...(currentSkills ?? []), skill]);

        e.currentTarget.value = "";
        clearErrors(`skills`);
        return;
      }
      // event.currentTarget.value=''
      setError("skills", {
        type: "custom",
        message: "Technologie should'nt be empty",
      });
    }
  };
  const deleteSkill = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    skilled: string
  ) => {
    const skills = watch("skills") || [""]; // Ensure we have an array
    const updatedSkills = skills.filter((skill) => skill !== skilled);
    setValue("skills", updatedSkills);
  };
  const onSubmit = async (data: Skill) => {
    const index = updatingSkillIndex ?? (portfolio.skills?.length || 0);
    console.log("Form Data:", data);
    await dispatch(updateSkillAsync({data,routeName:portfolio.routeName,index}))

    setShowForm(false);
    setUpdatingSkillIndex(null);
  };
  return (
    <section
      className="fixed w-full h-full top-0 left-0 dark:bg-black dark:bg-opacity-90 bg-theme-light bg-opacity-65 z-20"
      id="addSkill"
      onClick={handleFormClick}
    >
      <section className="fixed top-[50%] left-[50%] csw  max-h-[80vh] overflow-y-auto border translate-x-[-50%] -translate-y-[50%]  bg-theme-dark dark:bg-black rounded-lg flex flex-col justify-between dark:text-whites ">
        {/* Head of the form */}
        <div className=" sticky top-0  w-full flex justify-between items-center px-4 py-2 text-lg md:text-xl dark:text-theme bg-theme-dark dark:bg-black border-b bg-opacity-65">
          {updatingSkillIndex != null
            ? "Edit Skill Category"
            : "Add Skill Category"}
          <span
            onClick={() => {
              setShowForm(false);
              setUpdatingSkillIndex(null);
            }}
          >
            <TiDeleteOutline className="scale-150 dark:text-white cursor-pointer hover:text-reds" />
          </span>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div>
            <label htmlFor="category" className="block text-sm ">
              Category :
              <input
                {...register("category")}
                id="category"
                type="text"
                className="w-full p-2 border rounded"
              />
            </label>

            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="skils" className="">
              Skills:
              <span className="flex gap-2 flex-wrap mb-2">
                {watch("skills")?.map((skill, skillIndex) => (
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
                  onChange={() => clearErrors("skills")}
                  className="w-full p-2 border rounded"
                  placeholder="Press Enter To Add"
                />
                <span
                  className="rounded-lg py-1 px-2 bg-greens absolute top-[50%] translate-y-[-50%] right-2 text-xs"
                  onClick={(e) => handleSkillClick(e)}
                >
                  Add
                </span>
              </div>
            </label>
            {errors.skills && (
              <span className="text-red-500">{errors.skills.message}</span>
            )}
          </div>
          <div>
            <label className="flex flex-col" htmlFor="proficiency">
               Proficieny :
              <select 
              {...register('proficiency')} id="proficiency" className="cursor-pointer border w-full">
                 <option value=""  className="hover:bg-gray-600 cursor-pointer">Select Proficiency</option>
                <option value="Beginner"  className="hover:bg-gray-600 cursor-pointer">Beginner</option>
                <option value="Intermediate" className="hover:bg-gray-600 cursor-pointer">Intermediate</option>
                <option value="Advanced" className="hover:bg-gray-600 cursor-pointer">Advanced</option>
              </select>
            </label>
          </div>
          <button disabled={JSON.stringify(watch())==JSON.stringify(getDefaultValues())} type="submit" className="py-2 px-3 bg-blue-muted rounded-lg w-full mx-auto">Submit</button>
        </form>
      </section>
    </section>
  );
}

interface SkillCardProps {
  skillCategory: NonNullable<IPortfolio["skills"]>[number];
  index: number;
  isOwner: boolean;
  setShowForm: Dispatch<React.SetStateAction<boolean>>;
  setUpdatingSkillIndex: Dispatch<React.SetStateAction<number | null>>;
}

function SkillCard({
  skillCategory,
  index,
  isOwner,
  setShowForm,
  setUpdatingSkillIndex,
}: SkillCardProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const portfolio = useAppSelector((state) => state.portfolioSlice);

  //fix this
  const handleDelete = () => {
    dispatch(
      deleteParticularObjectAsync({
        from: Delete.Skills,
        index,
        routeName: portfolio.routeName,
      })
    );
  };

  return (
    <div className="bg-grays bg-opacity-15 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 px-6 py-3 relative z-0 group border-l border-theme">
      <div className="text-xl py-3 text-black dark:text-theme">
        {skillCategory.category && formatHeading(skillCategory.category)}
      </div>
      <div className="flex flex-wrap gap-3">
        {skillCategory.skills?.map((data, index) => (
          <div className="text-xs py-1 px-3 rounded-xl bg-gray-600" key={index}>
            {data}
          </div>
        ))}
      </div>
      <div className="my-3 text-grays">{skillCategory.proficiency}</div>
      {isOwner && (
        <div className="absolute z-0 bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Edit"
            onClick={() => {
              setUpdatingSkillIndex(index);
              setShowForm(true);
            }}
          >
            <GoPencil size={16} />
          </button>
          <button
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            aria-label="Delete"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <FiTrash size={16} />
          </button>
        </div>
      )}
      {isOpen && (
        <SurePrompt
          msg="Are you sure, you want to delete?"
          action={handleDelete}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}
