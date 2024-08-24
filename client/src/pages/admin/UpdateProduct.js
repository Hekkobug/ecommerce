import { apiUpdateProduct } from "apis";
import { Button, InputForm, Loading, MarkdownEditor, Select } from "components";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import { getBase64, validate } from "ultils/helper";

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
  const { categories } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const [payload, setPayload] = useState({
    description: "",
  });
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });

  useEffect(() => {
    reset({
      title: editProduct?.title || "",
      price: editProduct?.price || "",
      quantity: editProduct?.quantity || "",
      color: editProduct?.color || "",
      category: editProduct?.category || "",
      brand: editProduct?.brand?.toLowerCase() || "",
    });
    setPayload({
      description:
        Array.isArray(editProduct?.description)
          ? editProduct?.description?.join(",")
          : editProduct?.description || "",
    });
    setPreview({
      thumb: editProduct?.thumb || "",
      images: Array.isArray(editProduct?.images) ? editProduct.images : [],
    });
  }, [editProduct, reset]);

  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handlePreviewImages = async (files) => {
    if (!files || !Array.isArray(files)) return;
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push(base64);
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0) {
      handlePreviewThumb(watch("thumb")[0]);
    }
  }, [watch("thumb")]);

  useEffect(() => {
    const images = watch("images");
    if (images instanceof FileList && images.length > 0) {
      handlePreviewImages(images);
    }
  }, [watch("images")]);

  const handleUpdateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category) {
        const categoryData = categories?.find((el) => el.title === data.category);
        if (categoryData) {
          data.category = categoryData.title;
        } else {
          toast.error("Category not found!");
          return;
        }
      }

      const finalPayload = { ...data, ...payload };

      if (!watch("thumb") || !(watch("thumb") instanceof FileList)) {
        finalPayload.thumb = editProduct?.thumb || "";
      }

      if (!watch("images") || !(watch("images") instanceof FileList)) {
        finalPayload.images = Array.isArray(editProduct?.images) ? editProduct.images : [];
      }

      const formData = new FormData();

      for (let [key, value] of Object.entries(finalPayload)) {
        if (key === "thumb") {
          if (value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]);
          } else if (typeof value === "string") {
            formData.append(key, value);
          }
        } else if (key === "images" && value instanceof FileList) {
          for (let image of value) {
            formData.append("images", image);
          }
        } else {
          formData.append(key, value);
        }
      }

      const response = await apiUpdateProduct(formData, editProduct?._id);

      if (response.success) {
        toast.success(response.mes);
        render();
        setEditProduct(null);
      } else {
        toast.error(response.mes);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex justify-between items-center right-0 left-[327px] px-4 fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Update Products</h1>
        <span className="hover:underline cursor-pointer" onClick={() => setEditProduct(null)}>
          Cancel
        </span>
      </div>
      <div className="p-4 bg-pink-700">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
            label="Name product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need fill this field",
            }}
            fullWidth
            placeholder="Name of new product"
          />
          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Price"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Need fill this field",
              }}
              style="flex-auto"
              placeholder="Price of new product"
              type="number"
            />
            <InputForm
              label="Quantity"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Need fill this field",
              }}
              style="flex-auto"
              placeholder="Quantity of new product"
              type="number"
            />
            <InputForm
              label="Color"
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: "Need fill this field",
              }}
              style="flex-auto"
              placeholder="Color of new product"
            />
          </div>
          <div className="w-full my-6 flex gap-4">
            <Select
              label="Category"
              register={register}
              options={categories?.map((el) => ({
                code: el.title,
                value: el.title,
              }))}
              id="category"
              validate={{
                required: "Need fill this field",
              }}
              style="flex-auto"
              errors={errors}
              fullWidth
            />
            <Select
              label="Brand (Optional)"
              register={register}
              options={categories
                ?.find((el) => el.title === watch("category"))
                ?.brand?.map((el) => ({ code: el.toLowerCase(), value: el }))}
              id="brand"
              style="flex-auto"
              errors={errors}
              fullWidth
            />
          </div>
          <div>
            <MarkdownEditor
              name="description"
              changeValue={changeValue}
              label="Description"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.description}
            />
            <div className="flex flex-col gap-2 mt-8">
              <label htmlFor="thumb" className="font-semibold">
                Upload Thumb
              </label>
              <input
                type="file"
                id="thumb"
                {...register("thumb")}
              />
              {errors["thumb"] && (
                <small className="text-xs text-main">
                  {errors["thumb"]?.message}
                </small>
              )}
            </div>
            {preview.thumb && (
              <div className="my-4">
                <img
                  src={preview.thumb}
                  alt="thumbnail"
                  className="w-[200px] object-contain"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 mt-8">
              <label htmlFor="images" className="font-semibold">Upload Image Of Product</label>
              <input
                type="file"
                id="images"
                multiple
                {...register("images")}
              />
              {errors["images"] && (
                <small className="text-xs text-main">{errors["images"]?.message}</small>
              )}
            </div>
            {preview.images.length > 0 && (
              <div className="my-4 flex w-full gap-3 flex-wrap">
                {preview.images.map((el, idx) => (
                  <div key={idx} className="w-fit relative">
                    <img src={el} alt="product" className="w-[200px] object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Update Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProduct);
