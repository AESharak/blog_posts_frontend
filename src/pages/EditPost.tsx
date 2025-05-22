import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

const EditPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: post,
    isLoading: isPostLoading,
    isError,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => blogAPI.getPostBySlug(slug || ""),
    enabled: !!slug,
  });

  const handleSubmit = async (data: BlogPostFormData) => {
    if (!slug) return;

    if (!user) {
      toast.error("You must be logged in to edit a post");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const response = await blogAPI.updatePost(slug, data);
      toast.success("Post updated successfully!");
      navigate(`/blog/${response.slug}`);
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = "Failed to update post. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const errorObj = error as { response?: { data?: { detail?: string } } };
        if (errorObj.response?.data?.detail) {
          errorMessage = errorObj.response.data.detail;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not the author
  React.useEffect(() => {
    if (post && user && post.author.id !== user.id) {
      toast.error("You do not have permission to edit this post");
      navigate(`/blog/${slug}`);
    }
  }, [post, user, slug, navigate]);

  return (
    <Layout>
      <Link
        to={`/blog/${slug}`}
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
      >
        <Icon icon={FaArrowLeft} className="mr-2" /> Back to post
      </Link>

      {isPostLoading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {isError && (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Failed to load post. It may have been removed or you have entered an
            incorrect URL.
          </p>
        </div>
      )}

      {post && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Blog Post
            </h1>
            <BlogForm
              initialData={post}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditPost;
