import { getSignedURL,deleteImage } from '@/app/_lib/s3';
import { createAppAsyncThunk } from '@/app/_store/hooks';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Types } from 'mongoose';


export enum PortfolioStatus {
  Ideal = 'ideal',
  Failed = 'failed',
  Succeeded = 'succeeded',
  Pending = 'pending',
}
// Define the Portfolio type
export type Portfolio = {
  _id:Types.ObjectId;
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
  status:PortfolioStatus,
  error:string,
  createdAt?: Date;
  updatedAt?: Date;
};
interface UploadImageArgs {
  portfolioId:string;
  image: Blob | undefined; // Base64-encoded image string
  key:string;
  oldUrl:string |undefined;
}

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
  status:PortfolioStatus.Ideal,
  isOwner:false,
  error:'',
  _id:'' as any
};

//async thunk 
const uploadImageAsync=createAppAsyncThunk<string,UploadImageArgs>('portfolio/uploadImageAsync',async({ portfolioId, image,key,oldUrl }: UploadImageArgs)=>{
 try {
      //uploading to aws
      if(!image)return '';
      const computeSHA256=async(image:Blob)=>{
        const buffer=await image.arrayBuffer();
        const hashBuffer=await crypto.subtle.digest('SHA-256',buffer);
        const hashArray=Array.from(new Uint8Array(hashBuffer));
        const hashHex=hashArray.map((b)=>b.toString(16).padStart(2,'0')).join('');
        return hashHex;
       
      }
      const checksum= await computeSHA256(image);
     const signedUrl=await getSignedURL(key,oldUrl,image.type,image.size,checksum,portfolioId);
     await axios.put(signedUrl,image,{
      headers: {
        'Content-Type':image?.type,
      },
    }); 

    
  
      // Prepare the form data to update the imageUrl in the DB
    const formData = new FormData();
    formData.append('portfolioId', portfolioId);
    formData.append('url',signedUrl.split('?')[0]);

      
 
      //calling the api for updation
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      
      // Return the uploaded image URL
      return signedUrl.split('?')[0];
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed');
    }
});
const deleteImageAsync=createAppAsyncThunk('portfolio/deleteImageAsync',async(url:string)=>{
 await deleteImage(url);
 return '';

});
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
    updateStatus:(state,action:PayloadAction<Partial<Portfolio['status']>>)=>{
      state.status=action.payload;
    } 
  },

  extraReducers: builder => {
    builder.addCase(uploadImageAsync.pending, (state, action) => {
        state.status =PortfolioStatus.Pending
      })
      .addCase(uploadImageAsync.fulfilled, (state, action) => {
        state.status = PortfolioStatus.Succeeded
        // Add any fetched posts to the array
        state.personalInfo.profilePicture=action.payload
      })
      .addCase(uploadImageAsync.rejected, (state, action) => {
        state.status = PortfolioStatus.Failed
        state.error = action.error.message ?? 'Unknown Error'
      })
      .addCase(deleteImageAsync.pending, (state, action) => {
        state.status =PortfolioStatus.Pending
      })
      .addCase(deleteImageAsync.fulfilled, (state, action) => {
        state.status = PortfolioStatus.Succeeded
        // Add any fetched posts to the array
        state.personalInfo.profilePicture=action.payload
      })
      .addCase(deleteImageAsync.rejected, (state, action) => {
        state.status = PortfolioStatus.Failed
        state.error = action.error.message ?? 'Unknown Error'
      })
  }
});

// Export actions
export const {updatePortfolio, updateIsOwner,updateStatus} = portfolioSlice.actions;
export {uploadImageAsync,deleteImageAsync};
// Export the reducer
export default portfolioSlice.reducer;
