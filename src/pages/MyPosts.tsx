import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import type { IconType } from "react-icons";
import Layout from "../components/Layout";
import BlogCard from "../components/BlogCard";
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

const MyPosts: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["my-posts"],
    queryFn: blogAPI.getMyPosts,
    enabled: isAuthenticated,
  });

  const handleDelete = async (slug: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogAPI.deletePost(slug);
        toast.success("Post deleted successfully");
        refetch();
      } catch (_error) {
        toast.error("Failed to delete post");
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Blog Posts</h1>
          <p className="text-gray-600 mt-2">Manage your personal blog posts.</p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Icon icon={FaPlus} className="mr-2" /> Create New Post
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {isError && (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Failed to load your posts. Please try again later.
          </p>
        </div>
      )}

      {!isLoading && posts && posts.length === 0 && (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            You haven't written any posts yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first blog post to share your thoughts with the world!
          </p>
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Icon icon={FaPlus} className="mr-2" /> Create Your First Post
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts &&
          posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              showControls={true}
            />
          ))}
      </div>
    </Layout>
  );
};

export default MyPosts;
