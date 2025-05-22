import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import type { IconType } from "react-icons";
import Layout from "../components/Layout";
import { blogAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

// Helper component to render icons properly with TypeScript
const Icon = ({
  icon: IconComponent,
  className,
}: {
  icon: IconType;
  className?: string;
}) => <IconComponent className={className} />;

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => blogAPI.getPostBySlug(slug || ""),
    enabled: !!slug,
  });

  const handleDelete = async () => {
    if (!slug) return;

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogAPI.deletePost(slug);
        toast.success("Post deleted successfully");
        navigate("/");
      } catch (_error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDelete();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isAuthor = post && user && post.author.id === user.id;

  return (
    <Layout>
      <Link
        to="/"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
      >
        <Icon icon={FaArrowLeft} className="mr-2" /> Back to all posts
      </Link>

      {isLoading && (
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
          {post.image || post.image_url ? (
            <div className="h-64 md:h-96 bg-gray-200 relative overflow-hidden">
              <img
                src={post.image || post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-6">
              <div>
                <p>Written by: {isAuthor ? "you" : post.author.username}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(post.created_at)}
                  {post.updated_at !== post.created_at &&
                    ` (Updated: ${formatDate(post.updated_at)})`}
                </p>
              </div>
            </div>

            <div className="prose max-w-none">
              {post.body.split("\n").map((paragraph, idx) => (
                <p key={idx} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {isAuthor && (
              <div className="mt-8 flex space-x-4">
                <Link
                  to={`/edit/${post.slug}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Icon icon={FaEdit} className="mr-2" /> Edit Post
                </Link>
                <button
                  onClick={handleDelete}
                  onKeyDown={handleKeyDown}
                  tabIndex={0}
                  aria-label="Delete post"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Icon icon={FaTrash} className="mr-2" /> Delete Post
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BlogDetail;
