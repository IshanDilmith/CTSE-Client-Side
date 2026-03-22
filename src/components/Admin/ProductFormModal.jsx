import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Trash2, ImagePlus, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categoryOptions = [
  "Earbuds",
  "Chargers",
  "Phone Cases",
  "Smart Watches",
  "Cables",
  "Speakers",
  "Gadgets",
];

export default function ProductFormModal({ isOpen, onClose, onSubmit, product, loading }) {
  const isEdit = !!product;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    weight: "",
  });

  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [showImageLimitAlert, setShowImageLimitAlert] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        price: product.price || "",
        stock: product.stock || "",
        weight: product.weight || "",
      });
      setImagesToDelete([]);
      setNewImages([]);
      setImagePreviews([]);
    } else {
      setFormData({ name: "", description: "", category: "", price: "", stock: "", weight: "" });
      setNewImages([]);
      setImagePreviews([]);
      setImagesToDelete([]);
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newImages.length > 5) {
      setShowImageLimitAlert(true);
      return;
    }
    setNewImages((prev) => [...prev, ...files]);

    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const markExistingImageForDeletion = (publicId) => {
    setImagesToDelete((prev) => [...prev, publicId]);
  };

  const undoDeleteExistingImage = (publicId) => {
    setImagesToDelete((prev) => prev.filter((id) => id !== publicId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("category", formData.category);
    fd.append("price", formData.price);
    fd.append("stock", formData.stock);
    fd.append("weight", formData.weight || 0);

    newImages.forEach((file) => {
      fd.append("images", file);
    });

    if (isEdit && imagesToDelete.length > 0) {
      imagesToDelete.forEach((id) => {
        fd.append("imagesToDelete[]", id);
      });
    }

    onSubmit(fd);
  };

  if (!isOpen) return null;

  const existingImages = product?.images?.filter(
    (img) => !imagesToDelete.includes(img.publicId)
  ) || [];

  const deletedExistingImages = product?.images?.filter(
    (img) => imagesToDelete.includes(img.publicId)
  ) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-store-text">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-store-text-muted mt-0.5">
              {isEdit ? "Update product details" : "Fill in the product information"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            id="close-product-modal"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="product-name" className="text-sm font-medium text-store-text">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="product-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., AirPods Pro Max"
              className="h-11 rounded-xl border-gray-200 focus:border-store-primary/30"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="product-description" className="text-sm font-medium text-store-text">
              Description
            </Label>
            <textarea
              id="product-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product features, specifications..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-store-primary/30 focus:outline-none focus:ring-1 focus:ring-store-primary/20 resize-none"
            />
          </div>

          {/* Category + Weight Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-category" className="text-sm font-medium text-store-text">
                Category
              </Label>
              <select
                id="product-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:border-store-primary/30 focus:outline-none focus:ring-1 focus:ring-store-primary/20 bg-white"
              >
                <option value="">Select category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-weight" className="text-sm font-medium text-store-text">
                Weight (grams)
              </Label>
              <Input
                id="product-weight"
                name="weight"
                type="number"
                min="0"
                value={formData.weight}
                onChange={handleChange}
                placeholder="0"
                className="h-11 rounded-xl border-gray-200 focus:border-store-primary/30"
              />
            </div>
          </div>

          {/* Price + Stock Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-price" className="text-sm font-medium text-store-text">
                Price (LKR) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="h-11 rounded-xl border-gray-200 focus:border-store-primary/30"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-stock" className="text-sm font-medium text-store-text">
                Stock Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="product-stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="h-11 rounded-xl border-gray-200 focus:border-store-primary/30"
                required
              />
            </div>
          </div>

          {/* Existing Images (Edit mode) */}
          {isEdit && product?.images?.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-store-text">Current Images</Label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img) => (
                  <div key={img.publicId} className="relative group">
                    <img
                      src={img.url}
                      alt="product"
                      className="h-20 w-20 rounded-xl object-cover border-2 border-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => markExistingImageForDeletion(img.publicId)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {deletedExistingImages.map((img) => (
                  <div key={img.publicId} className="relative">
                    <img
                      src={img.url}
                      alt="product"
                      className="h-20 w-20 rounded-xl object-cover border-2 border-red-200 opacity-40"
                    />
                    <button
                      type="button"
                      onClick={() => undoDeleteExistingImage(img.publicId)}
                      className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-xl text-xs font-medium text-red-600"
                    >
                      Undo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-store-text">
              {isEdit ? "Add New Images" : "Product Images"}{" "}
            </Label>

            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt="preview"
                      className="h-20 w-20 rounded-xl object-cover border-2 border-store-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label
              htmlFor="image-upload"
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-6 cursor-pointer hover:border-store-primary/30 hover:bg-store-bg/50 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-store-primary/10 flex items-center justify-center">
                <ImagePlus className="h-5 w-5 text-store-primary" />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-store-primary">Click to upload</span>
                <p className="text-xs text-store-text-muted mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border-gray-200"
              id="cancel-product-form"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-store-primary to-store-primary-light text-white shadow-lg shadow-store-primary/25 hover:shadow-store-primary/35 transition-all"
              id="submit-product-form"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </div>

      <AlertDialog open={showImageLimitAlert} onOpenChange={setShowImageLimitAlert}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              Maximum 5 images allowed per product. Please remove some images before adding more.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-store-primary hover:bg-store-primary/90 text-white rounded-xl">
              Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
