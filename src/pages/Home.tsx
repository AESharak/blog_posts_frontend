import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import BlogCard from "../components/BlogCard";
import { blogAPI } from "../services/api";
import type { BlogPost } from "../types";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../contexts/AuthContext";
import { FaSearch, FaPen, FaLayerGroup, FaSpinner } from "react-icons/fa";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  const itemsPerPage = 9;
  const { ref, inView } = useInView();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: blogAPI.getAllPosts,
  });

  // Update posts state when data changes
  useEffect(() => {
    if (data) {
      setPosts(data.slice(0, itemsPerPage));
      setFilteredPosts(data);
    }
  }, [data, itemsPerPage]);

  // Filter posts based on search query
  useEffect(() => {
    if (data && searchQuery.trim() !== "") {
      const filtered = data.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
      setPosts(filtered.slice(0, itemsPerPage));
      setPage(1);
      setHasMore(filtered.length > itemsPerPage);
    } else if (data) {
      setFilteredPosts(data);
      setPosts(data.slice(0, itemsPerPage));
      setPage(1);
      setHasMore(data.length > itemsPerPage);
    }
  }, [searchQuery, data, itemsPerPage]);

  // Handle infinite scroll
  useEffect(() => {
    const loadMorePosts = () => {
      if (filteredPosts && page * itemsPerPage < filteredPosts.length) {
        const nextPage = page + 1;
        const startIndex = 0;
        const endIndex = nextPage * itemsPerPage;

        setPosts(filteredPosts.slice(startIndex, endIndex));
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    };

    if (inView && hasMore && !isLoading && filteredPosts) {
      loadMorePosts();
    }
  }, [inView, hasMore, isLoading, filteredPosts, page, itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogAPI.deletePost(slug);
        toast.success("Post deleted successfully");
        refetch();
      } catch {
        toast.error("Failed to delete post");
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white -mt-8 py-16 mb-12">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary-900 mb-6 leading-tight">
              Discover Stories, Share Inspirations
            </h1>
            <p className="text-lg md:text-xl text-secondary-600 mb-8 leading-relaxed">
              Explore a collection of thoughtful articles from our community or
              create your own to share with the world.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/create"
                  className="btn-primary px-8 py-3 text-base font-medium"
                >
                  <FaPen className="mr-2" /> Write a Story
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn-primary px-8 py-3 text-base font-medium"
                >
                  Join Our Community
                </Link>
              )}
              <a
                href="#blog-posts"
                className="btn-secondary px-8 py-3 text-base font-medium"
              >
                <FaLayerGroup className="mr-2" /> Explore Posts
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog-posts" className="mb-16">
        <div className="container-content">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-secondary-900 mb-2">
                Latest Blog Posts
              </h2>
              <p className="text-secondary-600">
                Explore the latest thoughts and ideas from our community.
              </p>
            </div>

            {/* Search bar */}
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="input pr-10 w-full md:w-64 lg:w-80"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center py-16">
              <FaSpinner className="h-10 w-10 text-primary-500 animate-spin" />
            </div>
          )}

          {isError && (
            <div className="text-center py-16 bg-red-50 rounded-lg">
              <p className="text-red-600">
                Failed to load posts. Please try again later.
              </p>
              <button onClick={() => refetch()} className="btn-primary mt-4">
                Try Again
              </button>
            </div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="text-center py-16 bg-secondary-50 rounded-lg">
              <p className="text-secondary-600 mb-4">
                {searchQuery
                  ? "No posts match your search."
                  : "No posts found. Be the first to create a blog post!"}
              </p>
              {isAuthenticated && (
                <Link to="/create" className="btn-primary">
                  Create a New Post
                </Link>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div ref={ref} className="flex justify-center py-10">
              <FaSpinner className="h-10 w-10 text-primary-500 animate-spin" />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
