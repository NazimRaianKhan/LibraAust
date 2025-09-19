import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as Yup from "yup";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../state/AuthContext";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignIn = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const result = await login(values);

    if (result.success) {
      navigate("/"); // Redirect on successful login
    }

    setSubmitting(false);
  };

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LibraAust</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Sign in to access your library account
          </p>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={SignInSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
