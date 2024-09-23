import React from "react";
import {
    Control,
    FieldErrors,
    useFieldArray,
    UseFormClearErrors,
    UseFormRegister,
    UseFormSetError,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";
import { FormData } from "@/app/create-portfolio/page";
import { MdOutlineDeleteForever } from "react-icons/md";
type props = {
    control: Control<FormData>;
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    prevStep: () => void;
    nextStep: () => void;
    watch: UseFormWatch<FormData>;
    setValue: UseFormSetValue<FormData>;
    setError: UseFormSetError<FormData>;
    clearErrors: UseFormClearErrors<FormData>;
};
export default function Projects({
    control,
    register,
    errors,
    prevStep,
    nextStep,
    watch,
    setValue,
    setError,
    clearErrors,
}: props) {
    const {
        fields: projectFields,
        remove: removeProject,
        append: appendProject,
    } = useFieldArray({
        control,
        name: "projects",
    });
    const handleTechnology = (
        event: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            let input = event.currentTarget.value;
            const skill = input.trim();

            if (skill) {
                const currentSkills = watch(`projects.${index}.technologies`);
                setValue(`projects.${index}.technologies`, [...currentSkills, skill]);
                event.currentTarget.value = "";
                clearErrors(`projects.${index}.technologies`);
                return;
            }
            // event.currentTarget.value=''
            setError(`projects.${index}.technologies`, {
                type: "custom",
                message: "Skill can't be empty",
            });
        }
    };
    const deleteTechnology = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        index: number,
        skilled: string
    ) => {
        const skills = watch(`projects.${index}.technologies`);
        setValue(
            `projects.${index}.technologies`,
            skills.filter((skill, i) => skills[i] !== skilled)
        );
    };
    return (
        <div className="portfolio">
            <h2>Projects</h2>
            {/* You would typically use array fields here */}
            {projectFields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2">
                    <input {...register(`projects.${index}.title`)} placeholder="Title" />
                    {errors.projects?.[index]?.title &&(
                            <span>{errors.projects?.[index]?.title.message}</span>
                        )}
                    <input
                        {...register(`projects.${index}.description`)}
                        placeholder="Description"
                    />
                   {errors.projects?.[index]?.description &&(
                            <span>{errors.projects?.[index]?.description.message}</span>
                        )}
                    <div>
                        <div className="flex gap-3 mb-2 flex-wrap">
                            {watch(`projects.${index}.technologies`).map(
                                (skill, skillIndex) => (
                                    <div
                                        key={skillIndex}
                                        className=" px-2 py-1 text-gray-400 flex justify-center items-center gap-3 rounded-md bg-black-bg2"
                                    >
                                        {skill}
                                        <span
                                            className="text-xl cursor-pointer"
                                            onClick={(e) => deleteTechnology(e, index, skill)}
                                        >
                                            x
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                        <input
                            placeholder="Technologies Used"
                            onKeyDown={(e) => handleTechnology(e, index)}
                            className="w-full"
                        />
                        {errors.projects?.[index]?.technologies && (
                            <span>{errors.projects?.[index]?.technologies.message}</span>
                        )}
                    </div>
                     <input {...register(`projects.${index}.githubUrl`)} placeholder="Github Url" />
                     <input {...register(`projects.${index}.projectUrl`)}   placeholder="Project Url"/>
                     <input {...register(`projects.${index}.image`)} placeholder="Project Image Url"/>

                    <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="deleteExp text-red-600"
                    >
                        <MdOutlineDeleteForever />
                    </button>
                </div>
            ))}

            <div className="buttons">
                <button
                    type="button"
                    className="border px-3 py-1 text-lg "
                    onClick={() =>
                        appendProject({
                            title: "",
                            description: "",
                            technologies: [],
                            projectUrl: "",
                            githubUrl: "",
                            image: "",
                        })
                    }
                >
                    +
                </button>
                <button type="button" onClick={prevStep} className="nav">
                    Previous
                </button>
                <button type="button" onClick={nextStep} className="nav">
                    Next
                </button>
            </div>
        </div>
    );
}
