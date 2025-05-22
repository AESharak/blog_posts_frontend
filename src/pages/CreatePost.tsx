import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import type { IconType } from "react-icons";
import Layout from "../components/Layout";
import BlogForm from "../components/BlogForm";
import { blogAPI } from "../services/api";
import type { BlogPostFormData } from "../types";
import { useAuth } from "../contexts/AuthContext";

// Helper component to render icons properly with TypeScript
const Icon = ({
  icon: IconComponent,
  className,
}: {
  icon: IconType;
  className?: string;
}) => <IconComponent className={className} />;

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: BlogPostFormData) => {
    if (!user) {
      toast.error("You must be logged in to create a post");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Submitting form data:", data);
      const response = await blogAPI.createPost(data);
      toast.success("Post created successfully!");
      navigate(`/blog/${response.slug}`);
    } catch (error: unknown) {
      console.error("Create post error:", error);
      let errorMessage = "Failed to create post. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const errorObj = error as {
          response?: { data?: { detail?: string; [key: string]: unknown } };
        };
        console.error("Error response:", errorObj.response);

        if (errorObj.response?.data) {
          console.error("Error data:", errorObj.response.data);

          if (errorObj.response.data.detail) {
            errorMessage = errorObj.response.data.detail;
          } else {
            // Handle field-specific errors
            const fieldErrors = Object.entries(errorObj.response.data)
              .map(
                ([field, errors]) =>
                  `${field}: ${
                    Array.isArray(errors) ? errors.join(", ") : errors
                  }`
              )
              .join("; ");

            if (fieldErrors) {
              errorMessage = `Validation errors: ${fieldErrors}`;
            }
          }
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Link
        to="/"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
      >
        <Icon icon={FaArrowLeft} className="mr-2" /> Back to all posts
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Blog Post
          </h1>
          <BlogForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
