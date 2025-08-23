import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const SignUp = () => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // This will be replaced with actual API call later
      console.log("Signup values:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        "Account created successfully! Please check your email to verify."
      );

      // Store email for verification (will be replaced with actual API response)
      localStorage.setItem("verificationEmail", values.email);

      // Navigate to verification page (you'll need to create this)
      // navigate('/verify');
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
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
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-600 mt-2">
            Join your university library system
          </p>
        </div>

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <TextField
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
              />

              <TextField
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
              />

              <PasswordField
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              <PasswordField
                name="confirmPassword"
                label="Confirm Password"
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
          )}
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
