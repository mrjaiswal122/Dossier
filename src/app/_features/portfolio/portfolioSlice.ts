import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Types } from 'mongoose';

// Define the Portfolio type
export type Portfolio = {
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
    endDate?: Date;
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
    images?: string[];
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
  isOwner:boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

// Initial state
const initialState: Portfolio = {
  user: '' as any, // Placeholder, replace with actual Types.ObjectId type if needed
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
  },
  languages: [],
  routeName: '',
  isOwner:false
};

// Create a slice
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    // Update the entire portfolio
    updatePortfolio: (state, action: PayloadAction<Partial<Portfolio>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    
     updateIsOwner:(state,action:PayloadAction<Partial<Portfolio['isOwner']>>)=>{
      
       state.isOwner = action.payload;
    
     },
    
   

    // Add other reducers similarly...
  },
});

// Export actions
export const {
  updatePortfolio,
 updateIsOwner
} = portfolioSlice.actions;

// Export the reducer
export default portfolioSlice.reducer;
