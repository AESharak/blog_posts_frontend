import React from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../types";
import {
  FaEdit,
  FaTrash,
  FaRegClock,
  FaRegUser,
  FaArrowRight,
} from "react-icons/fa";
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

  // Get a snippet of the post body with a word limit
  const getBodySnippet = (text: string, wordLimit = 20) => {
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <article className="card group transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        {post.image || post.image_url ? (
          <img
            src={post.image || post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-secondary-100 flex items-center justify-center">
            <span className="text-secondary-400 text-lg">No image</span>
          </div>
        )}

        {/* Category tag could go here */}
        <div className="absolute top-4 left-4">
          <span className="bg-primary-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-md">
            Blog
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Meta info */}
        <div className="flex items-center text-xs text-secondary-500 mb-3 space-x-4">
          <div className="flex items-center">
            <FaRegClock className="mr-1" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center">
            <FaRegUser className="mr-1" />
            <span>{isAuthor ? "You" : post.author.username}</span>
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/blog/${post.slug}`}
          className="group-hover:text-primary-600 transition-colors"
        >
          <h2 className="font-serif font-bold text-xl mb-3 text-secondary-900 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-secondary-600 line-clamp-3 mb-5">
          {getBodySnippet(post.body)}
        </p>

        {/* Action area */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-secondary-100">
          <Link
            to={`/blog/${post.slug}`}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            Read more
            <FaArrowRight className="ml-1.5 text-xs" />
          </Link>

          {showControls && isAuthor && (
            <div className="flex space-x-2">
              <Link
                to={`/edit/${post.slug}`}
                className="p-2 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors"
                aria-label="Edit post"
              >
                <Icon icon={FaEdit} />
              </Link>
              <button
                onClick={handleDelete}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                aria-label="Delete post"
                className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
              >
                <Icon icon={FaTrash} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
