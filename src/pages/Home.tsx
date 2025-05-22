import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout";
import BlogCard from "../components/BlogCard";
import { blogAPI } from "../services/api";
import type { BlogPost } from "../types";
import { useInView } from "react-intersection-observer";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const itemsPerPage = 10;
  const { ref, inView } = useInView();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: blogAPI.getAllPosts,
  });

  // Update posts state when data changes
  useEffect(() => {
    if (data) {
      setPosts(data.slice(0, itemsPerPage));
    }
  }, [data, itemsPerPage]);

  // Handle infinite scroll
  useEffect(() => {
    const loadMorePosts = () => {
      if (data && page * itemsPerPage < data.length) {
        const nextPage = page + 1;
        const startIndex = 0;
        const endIndex = nextPage * itemsPerPage;

        setPosts(data.slice(startIndex, endIndex));
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    };

    if (inView && hasMore && !isLoading && data) {
      loadMorePosts();
    }
  }, [inView, hasMore, isLoading, data, page, itemsPerPage]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Latest Blog Posts</h1>
        <p className="text-gray-600 mt-2">
          Read the latest articles from our community.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {isError && (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Failed to load posts. Please try again later.
          </p>
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No posts found. Be the first to create a blog post!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            onDelete={handleDelete}
            showControls={true}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
