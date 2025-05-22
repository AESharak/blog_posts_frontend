import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { BlogPost, BlogPostFormData } from "../types";
import { useAuth } from "../contexts/AuthContext";

interface BlogFormProps {
  initialData?: Partial<BlogPost>;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  isLoading: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { user } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image || initialData?.image_url || null
  );
  const [removeImage, setRemoveImage] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<BlogPostFormData>({
    defaultValues: {
      title: initialData?.title || "",
      body: initialData?.body || "",
      image_url: initialData?.image_url || "",
      author_id: user?.id || 0,
      remove_image: false,
    },
  });

  const imageUrl = watch("image_url");

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setRemoveImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL change
  React.useEffect(() => {
    if (imageUrl && !previewImage && !removeImage) {
      setPreviewImage(imageUrl);
    }
  }, [imageUrl, previewImage, removeImage]);

  // Handle image removal
  const handleRemoveImage = () => {
    setPreviewImage(null);
    setRemoveImage(true);
    setValue("image", undefined);
    setValue("image_url", "");
    setValue("remove_image", true);
  };

  const handleFormSubmit = async (data: BlogPostFormData) => {
    if (user?.id) {
      data.author_id = user.id;
      // Set remove_image flag if needed
      if (removeImage) {
        data.remove_image = true;
      }
      await onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Title should be at least 5 characters",
            },
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <textarea
          id="body"
          rows={10}
          {...register("body", {
            required: "Content is required",
            minLength: {
              value: 10,
              message: "Content should be at least 10 characters",
            },
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.body && (
          <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="image_url"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL (optional)
        </label>
        <input
          id="image_url"
          type="text"
          disabled={removeImage}
          {...register("image_url")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Upload Image (optional)
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          disabled={removeImage}
          {...register("image", {
            onChange: handleFileChange,
          })}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
      </div>

      {previewImage && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Image Preview
            </label>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove Image
            </button>
          </div>
          <div className="h-64 w-full relative overflow-hidden rounded-lg">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setPreviewImage(null)}
            />
          </div>
        </div>
      )}

      {removeImage && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            The image will be removed when you save this post.
          </p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : initialData
            ? "Update Post"
            : "Create Post"}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
