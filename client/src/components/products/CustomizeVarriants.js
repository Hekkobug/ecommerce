import { apiAddVarriant } from "apis";
import Button from "components/buttons/Button";
import Loading from "components/common/Loading";
import InputForm from "components/inputs/InputForm";
import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import Swal from "sweetalert2";
import { getBase64 } from "ultils/helper";

const CustomizeVarriants = ({
  customizeVarriant,
  setCustomizeVarriant,
  render,
}) => {
  const dispatch = useDispatch();
  const [preview, setPreview] = useState({
    thumb: "",
    images: "",
  });

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  useEffect(() => {
    reset({
      title: customizeVarriant?.title,
      price: customizeVarriant?.price,
      color: customizeVarriant?.color,
    });
  }, [customizeVarriant]);

  const handleAddVarriant = async (data) => {
    if (data.color === customizeVarriant.color) {
      Swal.fire("Oops!", "Color not changed", "info");
    } else {
      const formData = new FormData();
      for (let i of Object.entries(data)) {
        formData.append(i[0], i[1]);
      }
      if (data.thumb) formData.append("thumb", data.thumb[0]);
      if (data.images) {
        for (let image of data.images) {
          formData.append("images", image);
        }
      }
      const response = await apiAddVarriant(formData, customizeVarriant._id);
      if (response.success) {
        toast.success(response.mes);
        reset();
        setPreview({ thumb: "", images: [] });
        render();
      } else {
        toast.error(response.mes);
      }
    }
  };

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
    if (watch("images") instanceof FileList && watch("images").length > 0) {
      handlePreviewImages(Array.from(watch("images")));
    }
  }, [watch("images")]);

  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex justify-between items-center right-0 left-[327px] px-4 fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Customize Varriants Of Products
        </h1>
        <span
          className="hover:underline cursor-pointer"
          onClick={() => setCustomizeVarriant(null)}
        >
          Back
        </span>
      </div>
      <form
        onSubmit={handleSubmit(handleAddVarriant)}
        className="p-4 flex flex-col gap-4"
      >
        <div className="flex gap-4 items-center w-full">
          <InputForm
            label="Original name"
            register={register}
            errors={errors}
            id="title"
            fullWidth
            style="flex-auto"
            validate={{
              required: "Need fill this field",
            }}
            placeholder="Title of varriant"
          />
        </div>
        <div className="flex gap-4 items-center w-full">
          <InputForm
            label="Price varriant"
            register={register}
            errors={errors}
            id="price"
            validate={{
              required: "Need fill this field",
            }}
            fullWidth
            placeholder="Price of new varriant"
            type="number"
            style="flex-auto"
          />
          <InputForm
            label="Color varriant"
            register={register}
            errors={errors}
            id="color"
            validate={{
              required: "Need fill this field",
            }}
            fullWidth
            placeholder="Color of new varriant"
            style="flex-auto"
          />
        </div>
        <div className="flex flex-col gap-2 mt-8">
          <label htmlFor="thumb" className="font-semibold">
            Upload Thumb
          </label>
          <input
            type="file"
            id="thumb"
            {...register("thumb", { required: "Need fill" })}
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
          <label htmlFor="images" className="font-semibold">
            Upload Image Of Product
          </label>
          <input
            type="file"
            id="images"
            multiple
            {...register("images", { required: "Need fill" })}
          />
          {errors["images"] && (
            <small className="text-xs text-main">
              {errors["images"]?.message}
            </small>
          )}
        </div>
        {preview.images.length > 0 && (
          <div className="my-4 flex w-full gap-3 flex-wrap">
            {preview.images.map((el, idx) => (
              <div key={idx} className="w-fit relative">
                <img
                  src={el}
                  alt="product"
                  className="w-[200px] object-contain"
                />
              </div>
            ))}
          </div>
        )}
        <div className="my-6">
          <Button type="submit">Add Varriant</Button>
        </div>
      </form>
    </div>
  );
};

export default memo(CustomizeVarriants);
