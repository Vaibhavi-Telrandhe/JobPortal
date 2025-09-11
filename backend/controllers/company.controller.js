import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const registerCompany = async (req, res) => {
  try {
    console.log('Full request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('req.body type:', typeof req.body);
    console.log('req.body is null:', req.body === null);
    console.log('req.body is undefined:', req.body === undefined);
    
    // Add safety check
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing or empty",
        success: false,
      });
    }
    
    const { companyName,name } = req.body;
    const finalName=companyName || name;
    if (!finalName) {
      return res.status(400).json({
        message: "Company name is required. Received body: " + JSON.stringify(req.body),
        success: false,
      });
    }

    let company = await Company.findOne({ name: finalName });
    if (company) {
      return res.status(400).json({
        message: "Company already exists",
        success: false,
      });
    }

    company = await Company.create({
      name: finalName,
       userId: req.id,  //Fixed: changed userID to userId for consistency
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId }); // Fixed: typo in variable name
    
    if (!companies || companies.length === 0) {
      return res.status(404).json({ // Fixed: typo ststus -> status
        message: "Companies not found",
        success: false,
      });
    }

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//get company by id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({ // Fixed: typo ststus -> status
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    let logo;

    // Only process file if it exists
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    // Build updateData object conditionally
    const updateData = { name, description, website, location };
    if (logo) updateData.logo = logo;

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};