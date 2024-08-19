import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Axiosconfig/Axiosconfig";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [specification, setSpecification] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [loading, setLoading] = useState(false);

  // Validation error states
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [educationError, setEducationError] = useState<string | null>(null);
  const [specificationError, setSpecificationError] = useState<string | null>(null);
  const [zipCodeError, setZipCodeError] = useState<string | null>(null);

  const handleCancel = () => {
    navigate("/userProfile");
  };

  const validateName = (value: string) => {
    if (value=== "") {
      setNameError("Name is required");
      return false;
    } else if (value.length < 3 || value.length > 15) {
      setNameError("Name must be between 3 and 15 characters long");
      return false;
    } else if (!/^[a-zA-Z\s]*$/.test(value)) {
      setNameError("Name cannot contain numbers or special characters");
      return false;
    } else {
      setNameError(null);
      return true;
    }
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9_]+@gmail\.com$/;
    if (value=== "") {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(value)) {
      setEmailError("Valid email is required");
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  const validateMobile = (value: string) => {
    if (value === "") {
      setMobileError("Mobile number is required");
      return false;
    } else if (!/^[6-9]\d{9}$/.test(value)) {
      setMobileError("Invalid mobile number format. Must start with a digit from 6 to 9 and be 10 digits long");
      return false;
    } else {
      setMobileError(null);
      return true;
    }
  };

  const validateAddress = (value: string) => {
    if (value=== "") {
      setAddressError("Address is required");
      return false;
    } else {
      setAddressError(null);
      return true;
    }
  };

  const validateSkills = (value: string) => {
    if (value === "") {
      setSkillsError("Skills are required");
      return false;
    } else {
      setSkillsError(null);
      return true;
    }
  };

  const validateEducation = (value: string) => {
    if (value=== "") {
      setEducationError("Education is required");
      return false;
    } else {
      setEducationError(null);
      return true;
    }
  };

  const validateSpecification = (value: string) => {
    if (value=== "") {
      setSpecificationError("Specification is required");
      return false;
    } else {
      setSpecificationError(null);
      return true;
    }
  };

  const validateZipCode = (value: string) => {
    if (value === "" || !/^\d{5,6}$/.test(value)) {
      setZipCodeError("Valid Zip Code is required");
      return false;
    } else {
      setZipCodeError(null);
      return true;
    }
  };

  const handleSubmit = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isMobileValid = validateMobile(mobile);
    const isAddressValid = validateAddress(address);
    const isSkillsValid = validateSkills(skills);
    const isEducationValid = validateEducation(education);
    const isSpecificationValid = validateSpecification(specification);
    const isZipCodeValid = validateZipCode(zipCode);

    if (
      isNameValid &&
      isEmailValid &&
      isMobileValid &&
      isAddressValid &&
      isSkillsValid &&
      isEducationValid &&
      isSpecificationValid &&
      isZipCodeValid
    ) {
      try {
        setLoading(true);

        const data = {
          name,
          email,
          mobile,
          address,
          skills,
          education,
          specification,
          zipCode,
        };

        const response = await axiosInstance.post(
          "/api/auth/updateProfile",
          data
        );

        setLoading(false);

        if (response.data.data) {
          toast.success("Successfully Updated");
          localStorage.setItem("User", JSON.stringify(response.data));
        } else {
          toast.error("Error updating profile");
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error("An error occurred while updating the profile");
      }
    }
  };

  useEffect(() => {
 
    const timer = setTimeout(() => {
      setNameError(null);
      setEmailError(null);
      setMobileError(null);
      setAddressError(null);
      setSkillsError(null);
      setEducationError(null);
      setSpecificationError(null);
      setZipCodeError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [nameError, emailError, mobileError, addressError, skillsError, educationError, specificationError, zipCodeError]);

  useEffect(() => {
    const profileData = JSON.parse(localStorage.getItem("user") || "{}");

    const storedName = profileData.data?.name || "";
    const storedEmail = profileData.data?.email || "";
    const storedMobile = profileData.data?.mobile || "";
    const storedAddress = profileData.data?.address?.[0] || {};
    const storedStreet = storedAddress.street || "";
    const storedCity = storedAddress.city || "";
    const storedState = storedAddress.state || "";
    const fullAddress = `${storedStreet}, ${storedCity}, ${storedState}`;
    const storedSkills = profileData.data?.skills || "";
    const storedEducation = profileData.data?.education || "";
    const storedSpecification = profileData.data?.specification || "";
    const storedZipCode = storedAddress.zipCode || "";
    const storedRole=profileData.data?.role || "";
    

    setName(storedName);
    setEmail(storedEmail);
    setMobile(storedMobile);
    setAddress(fullAddress);
    setSkills(storedSkills);
    setEducation(storedEducation);
    setSpecification(storedSpecification);
    setZipCode(storedZipCode);
    setRole(storedRole);
    
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 mb-6 w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">{role}-Profile</h1>
        <div className="grid gap-6 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 flex flex-col items-center">
            <p className="font-medium text-lg text-gray-800">Personal Details</p>
            <div className="relative mt-4">
          
              <img
                src="images/profile.avif"
                alt="Profile"
                className="object-cover h-64 rounded-full sm:h-72"
              />
            </div>
            {/* <div className="mt-4">
              <p className="text-gray-600 text-center">
                Want to change your password?{" "}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => navigate("/changePassword")}
                >
                  Click here
                </button>
              </p>
            </div> */}
          </div>

          <div className="lg:col-span-2">
            <div className="grid gap-4 text-sm grid-cols-1 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-slate-500" htmlFor="full_name">
                  Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  className={`h-10 border mt-1 rounded px-4 w-full ${
                    nameError ? "border-red-500" : "bg-gray-50"
                  }`}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-500" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`h-10 border mt-1 rounded px-4 w-full ${
                    emailError ? "border-red-500" : "bg-gray-50"
                  }`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                />
                {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-500" htmlFor="mobile">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  id="mobile"
                  className={`h-10 border mt-1 rounded px-4 w-full ${
                    mobileError ? "border-red-500" : "bg-gray-50"
                  }`}
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                {mobileError && (
                  <p className="text-red-500 text-xs">{mobileError}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-500" htmlFor="address">
                  Address
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-500" htmlFor="skills">
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  className={`h-10 border mt-1 rounded px-4 w-full ${
                    skillsError ? "border-red-500" : "bg-gray-50"
                  }`}
                  placeholder="Enter your skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                {skillsError && (
                  <p className="text-red-500 text-xs">{skillsError}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-500" htmlFor="education">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  id="education"
                  className={`h-10 border mt-1 rounded px-4 w-full ${
                    educationError ? "border-red-500" : "bg-gray-50"
                  }`}
                  placeholder="Enter your education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
                {educationError && (
                  <p className="text-red-500 text-xs">{educationError}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-500" htmlFor="specification">
                  Specification
                </label>
                <input
                  type="text"
                  name="specification"
                  id="specification"
                  className={`h-10 border mt-1 rounded px-4 w-full ${
                    specificationError ? "border-red-500" : "bg-gray-50"
                  }`}
                  placeholder="Enter your specification"
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                />
                {specificationError && (
                  <p className="text-red-500 text-xs">{specificationError}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-500" htmlFor="zipCode">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  className={`h-10 border mt-1 rounded px-4 w-full ${
                    zipCodeError ? "border-red-500" : "bg-gray-50"
                  }`}
                  placeholder="Enter your zip code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
                {zipCodeError && (
                  <p className="text-red-500 text-xs">{zipCodeError}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none disabled:bg-gray-300"
                onClick={handleSubmit}
                disabled={loading}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
