import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import type { LoginFormData } from "../types";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data.username, data.password);
    } catch (err: unknown) {
      console.error(err);
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "detail" in err.response.data
      ) {
        setError(err.response.data.detail as string);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-secondary-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-secondary-600">
            Sign in to continue to your account
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-card p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
              <div className="flex-1">{error}</div>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-secondary-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="input pl-10"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-secondary-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-secondary-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="input pl-10"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5 text-base font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
