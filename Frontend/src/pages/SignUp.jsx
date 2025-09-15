import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import api from "../services/api";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import {
  FormControlLabel,
  Checkbox,
  FormHelperText,
  MenuItem,
} from "@mui/material";
import { useEffect } from "react";

const SignUp = () => {
  const navigate = useNavigate();

  // Idk how this works
  const containsID = (str) => {
    return /\d/.test(str);
  };

  const isFacultyEmail = (email) => {
    if (!email) return false;
    const username = email.split("@")[0];
    return !containsID(username); // Faculty emails DONT have numbers
  };

  const departments = ["CSE", "EEE", "BBA", "ME", "TE", "CE", "IPE", "ARCH"];
  const semesters = [
    "1.1",
    "1.2",
    "2.1",
    "2.2",
    "3.1",
    "3.2",
    "4.1",
    "4.2",
    "5.1",
    "5.2",
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    student_id: Yup.number()
      .typeError("ID must be a number")
      .required("ID is required"),
    department: Yup.string().required("Department is required"),
    semester: Yup.string().required("Semester is required"),
    phone: Yup.string().nullable(),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .test(
        "aust-email",
        "Email must end with @aust.edu",
        (value) => value && value.endsWith("@aust.edu")
      ),
    studentship: Yup.boolean().default(true),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  // AI blackmagic since idk how logic works apparently

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Prepare data without password confirmation
      const { password_confirmation, ...submitData } = values;

      let apiEndpoint = "/v1/students";
      let requestData = { ...submitData };

      if (!values.studentship) {
        // Non-student registration
        if (isFacultyEmail(values.email)) {
          // Faculty email (no numbers) - send to faculty endpoint
          apiEndpoint = "/faculty";
          // Rename student_id to faculty_id for faculty
          const { student_id, ...facultyData } = requestData;
          requestData = {
            ...facultyData,
            faculty_id: student_id, // Convert student_id to faculty_id
          };
        } else {
          // Non-faculty email (has numbers) - send to student endpoint
          apiEndpoint = "/v1/students";
          // Keep student_id as is for non-faculty non-students
        }
      } else {
        // Current student - send to student endpoint, keep student_id
        apiEndpoint = "/v1/students";
      }

      // Convert studentship to string for backend
      const processedValues = {
        ...requestData,
        studentship: values.studentship ? "true" : "false",
      };

      const response = await api.post(apiEndpoint, processedValues, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      toast.success("Registration successful! Please sign in.");
      navigate("/signin");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.errors) {
        const laravelErrors = {};
        Object.entries(error.response.data.errors).forEach(
          ([key, messages]) => {
            laravelErrors[key] = messages[0];
          }
        );
        setErrors(laravelErrors);
      }

      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LibraAust</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Registration</h2>
          <p className="text-gray-600 mt-2">Create your library account</p>
        </div>

        <Formik
          initialValues={{
            name: "",
            student_id: "",
            department: "",
            semester: "",
            phone: "",
            email: "",
            studentship: true,
            password: "",
            password_confirmation: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, setFieldValue, values }) => {
            // Automatically set semester to "NA" when studentship is false
            useEffect(() => {
              if (!values.studentship && values.semester !== "NA") {
                setFieldValue("semester", "NA");
              }
            }, [values.studentship, setFieldValue, values.semester]);

            return (
              <Form className="space-y-4">
                {/* Student Information */}
                <TextField
                  name="name"
                  label="Full Name *"
                  placeholder="Enter your full name"
                />

                <TextField
                  name="student_id"
                  label={
                    !values.studentship && isFacultyEmail(values.email)
                      ? "Faculty ID *"
                      : "Student ID *"
                  }
                  type="number"
                  placeholder={
                    !values.studentship && isFacultyEmail(values.email)
                      ? "Enter your faculty ID"
                      : "Enter your student ID"
                  }
                />

                <TextField name="department" label="Department *" select>
                  <MenuItem value="">Select Department</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  name="semester"
                  label="Semester *"
                  select
                  disabled={!values.studentship}
                >
                  <MenuItem value="">Select Semester</MenuItem>
                  {semesters.map((sem) => (
                    <MenuItem key={sem} value={sem}>
                      {sem}
                    </MenuItem>
                  ))}
                  {!values.studentship && (
                    <MenuItem value="NA">NA (Not Applicable)</MenuItem>
                  )}
                </TextField>

                <TextField
                  name="phone"
                  label="Phone Number (Optional)"
                  placeholder="Enter your phone number"
                />

                {/* Studentship Checkbox */}
                <div className="mt-4">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.studentship}
                        onChange={(e) =>
                          setFieldValue("studentship", e.target.checked)
                        }
                        name="studentship"
                        color="primary"
                      />
                    }
                    label="I am currently a student"
                  />
                  {touched.studentship && errors.studentship && (
                    <FormHelperText error>{errors.studentship}</FormHelperText>
                  )}
                </div>

                {/* User Account Information */}
                <TextField
                  name="email"
                  label="Email *"
                  type="email"
                  placeholder="Enter your @aust.edu email"
                />

                <PasswordField
                  name="password"
                  label="Password *"
                  placeholder="Create a password"
                />

                <PasswordField
                  name="password_confirmation"
                  label="Confirm Password *"
                  placeholder="Confirm your password"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </Form>
            );
          }}
        </Formik>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
