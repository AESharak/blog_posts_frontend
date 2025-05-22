import React from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../types";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import type { IconType } from "react-icons";

interface BlogCardProps {
  post: BlogPost;
  onDelete?: (slug: string) => void;
  showControls?: boolean;
}

// Helper component to render icons properly with TypeScript
const Icon = ({ icon: IconComponent }: { icon: IconType }) => <IconComponent />;

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onDelete,
  showControls = true,
}) => {
  const { user } = useAuth();
  const isAuthor = post.author.id === user?.id;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.slug);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onDelete) {
      onDelete(post.slug);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.image || post.image_url ? (
        <div className="h-48 bg-gray-200 relative overflow-hidden">
          <img
            src={post.image || post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-lg">No image</span>
        </div>
      )}

      <div className="p-6">
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4">
          {post.body.substring(0, 150)}
          {post.body.length > 150 ? "..." : ""}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            <span>Written by: {isAuthor ? "you" : post.author.username}</span>
            <div className="text-xs text-gray-400 mt-1">
              {formatDate(post.created_at)}
            </div>
          </div>

          {showControls && isAuthor && (
            <div className="flex space-x-2">
              <Link
                to={`/edit/${post.slug}`}
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
                aria-label="Edit post"
              >
                <Icon icon={FaEdit} />
              </Link>
              <button
                onClick={handleDelete}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                aria-label="Delete post"
                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200"
              >
                <Icon icon={FaTrash} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
