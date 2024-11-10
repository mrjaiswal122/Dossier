import mongoose, { Model, Schema, Types } from "mongoose";

export type IPortfolio = {
  user: Types.ObjectId;
  personalInfo: {
    fullName: string;
    profilePicture?: string;
    title: string;
    location?: string;
    email: string;
    phone?: string;
    socialLinks?: {
      linkedIn?: string;
      instagram?: string;
      youtube?: string;
      facebook?: string;
      github?: string;
      twitter?: string;
     
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
    startDate: string;
    endDate?: string;
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
    image?: string;
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
  routeName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const portfolioSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  personalInfo: {
    fullName: { type: String, required: true },
    profilePicture: { type: String },
    title: { type: String, required: true },
    location: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    socialLinks: {
      linkedIn: { type: String },
      instagram: { type: String },
      youtube: { type: String },
      facebook: { type: String },
      github: { type: String },
      twitter: { type: String },
   
    },
  },
  summary: {
    aboutMe: { type: String },
    careerObjective: { type: String },
  },
  skills: [
    {
      category: { type: String, required: false },
      skills: [{ type: String }],
      proficiency: { type: String, required: false },
      _id: false
    },
  ],
  experience: [
    {
      jobTitle: { type: String, required: true },
      companyName: { type: String, required: true },
      companyLogo: { type: String },
      location: { type: String },
      startDate: { type: String, required: true },
      endDate: { type: String },
      responsibilities: { type: String },
      _id:false
    },
  ],
  education: [
    {
      degree: { type: String, required: true },
      institutionName: { type: String, required: true },
      institutionLogo: { type: String },
      location: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      achievements: { type: String },
    },
  ],
  projects: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      technologies: [{ type: String }],
      projectUrl: { type: String },
      githubUrl: { type: String },
      image: { type: String },
      _id: false
    },
  ],
  certifications: [
    {
      title: { type: String, required: true },
      organization: { type: String, required: true },
      dateEarned: { type: Date, required: true },
      certificateUrl: { type: String },
    },
  ],
  publications: [
    {
      title: { type: String, required: true },
      datePublished: { type: Date },
      description: { type: String },
      url: { type: String },
    },
  ],
  awards: [
    {
      title: { type: String, required: true },
      organization: { type: String, required: true },
      dateReceived: { type: Date },
      description: { type: String },
    },
  ],
  languages: [{ type: String, required: true }],
  interests: [{ type: String }],
  testimonials: [
    {
      name: { type: String },
      jobTitle: { type: String },
      company: { type: String },
      contactInfo: { type: String },
      testimonialText: { type: String },
    },
  ],
  contact: {
    email: { type: String },
    message: { type: String },
  },
  resume: {
    fileUrl: { type: String },
  },
  routeName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

// console.log(' I am in the portfolio model ->',mongoose.models.Portfolio);
let portfolioModel: Model<IPortfolio>;

try {
  // Try to get existing model
  portfolioModel = mongoose.model<IPortfolio>('Portfolio');
} catch {
  // If not exists, create new model
  portfolioModel = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
}

export default portfolioModel;