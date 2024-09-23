import userModel from "./user";
import mongoose from "mongoose";

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
        images: [{ type: String }],  // Array of URLs to screenshots/images
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






const portfolioModel=mongoose.models.Portfolio||mongoose.model('Portfolio',portfolioSchema);

export default portfolioModel;