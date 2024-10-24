import userModel from "./user";
import mongoose from "mongoose";
import { Types } from 'mongoose';

// TypeScript interface for the Portfolio schema
export type IPortfolio= {
  user: Types.ObjectId; // Reference to the user
  personalInfo: {
    fullName: string;
    profilePicture?: string; // Optional field for profile picture URL
    title: string;
    location?: string;
    email: string;
    phone?: string;
    socialLinks?: {
      linkedIn?: string;
      instagram?:string;
      youtube?:string;
      facebook?:string;
      github?: string;
      twitter?: string;
      personalWebsite?: string;
    };
  };
  summary?: {
    aboutMe?: string;
    careerObjective?: string;
  };
  skills?: Array<{
    category?: string;
    skills?: string[];
    proficiency?: string;
  }>;
  experience?: Array<{
    jobTitle: string;
    companyName: string;
    companyLogo?: string;
    location?: string;
    startDate: Date;
    endDate?: Date; // Optional for current job
    responsibilities?: string;
  }>;
  education?: Array<{
    degree: string;
    institutionName: string;
    institutionLogo?: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    achievements?: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies?: string[];
    projectUrl?: string;
    githubUrl?: string;
    images?: string;
  }>;
  certifications?: Array<{
    title: string;
    organization: string;
    dateEarned: Date;
    certificateUrl?: string;
  }>;
  publications?: Array<{
    title: string;
    datePublished?: Date;
    description?: string;
    url?: string;
  }>;
  awards?: Array<{
    title: string;
    organization: string;
    dateReceived?: Date;
    description?: string;
  }>;
  languages: string[];
  interests?: string[];
  testimonials?: Array<{
    name?: string;
    jobTitle?: string;
    company?: string;
    contactInfo?: string;
    testimonialText?: string;
  }>;
  contact?: {
    email?: string;
    message?: string;
  };
  resume?: {
    fileUrl?: string;
  };
  routeName: string; // Unique route name for the portfolio
  createdAt?: Date; // Timestamp automatically generated by Mongoose
  updatedAt?: Date; // Timestamp automatically generated by Mongoose
}

const portfolioSchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,required:true,ref:'userModel'},//user reference
    personalInfo: {
      fullName: { type: String, required: true },
      profilePicture: { type: String },  // URL to the profile picture
      title: { type: String, required: true },  // Professional title
      location: { type: String },
      email: { type: String, required: true },
      phone: { type: String },
      socialLinks: {
        linkedIn: { type: String },
        github: { type: String },
        twitter: { type: String },
        personalWebsite: { type: String },
      },
    },
    summary: {
      aboutMe: { type: String },  // Introduction or personal statement
      careerObjective: { type: String },
    },
    skills: [
      {
        category: { type: String },  // e.g., Programming, Design
        skills: [{ type: String },], // e.g., JavaScript, React
        proficiency: { type: String },  // e.g., Beginner, Intermediate, Advanced
      },
    ],
    experience: [
      {
        jobTitle: { type: String, required: true },
        companyName: { type: String, required: true },
        companyLogo: { type: String },  // URL to company logo (optional)
        location: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },  // Null if current
        responsibilities: { type: String },  // Job description
      },
    ],
    education: [
      {
        degree: { type: String, required: true },
        institutionName: { type: String, required: true },
        institutionLogo: { type: String },  // URL to institution logo
        location: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        achievements: { type: String },  // Optional achievements/activities
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        technologies: { type: [String] },  // Array of technologies used
        projectUrl: { type: String },  // URL to live project
        githubUrl: { type: String },  // GitHub repository link
        image: { type: String },  // Array of URLs to screenshots/images
        _id:false
      },
    ],
    certifications: [
      {
        title: { type: String, required: true },
        organization: { type: String, required: true },
        dateEarned: { type: Date, required: true },
        certificateUrl: { type: String },  // Optional link to the certification
      },
    ],
    publications: [
      {
        title: { type: String, required: true },
        datePublished: { type: Date },
        description: { type: String },  // Abstract/Description
        url: { type: String },  // Link to publication
      },
    ],
    awards: [
      {
        title: { type: String, required: true },
        organization: { type: String, required: true },
        dateReceived: { type: Date },
        description: { type: String },  // Optional
      },
    ],
    languages: [{ type: String, required: true }, ],
    interests: [{ type: String }],  // Optional list of interests
    testimonials: [
      {
        name: { type: String },
        jobTitle: { type: String },
        company: { type: String },
        contactInfo: { type: String },  // Optional
        testimonialText: { type: String },  // Testimonial text
      },
    ],
    contact: {
      email: { type: String },
      message: { type: String },  // Custom message for contact form
    },
    resume: {
      fileUrl: { type: String },  // URL to uploaded resume PDF
    },
    routeName:{
      type:String,
      required:true,
      unique:true,
      trim:true
    }
  },{timestamps:true});






const portfolioModel=mongoose.models.Portfolio||mongoose.model<IPortfolio>('Portfolio',portfolioSchema);

export default portfolioModel;