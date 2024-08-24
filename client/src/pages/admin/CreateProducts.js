import { apiCreateProduct } from "apis";
import { Button, InputForm, Loading, MarkdownEditor, Select } from "components";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import { getBase64, validate } from "ultils/helper";

const CreateProducts = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const { categories } = useSelector((state) => state.app);
  const dispatch = useDispatch()

  const [payload, setPayload] = useState({
    description: "",
  });
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );
  // const [hoverElm, setHoverElm] = useState(null);
  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64 });
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  useEffect(() => {
    handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  useEffect(() => {
    handlePreviewImages(watch("images"));
  }, [watch("images")]);

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category) {
        data.category = categories?.find(el => el._id === data.category)?.title
      }

      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) {
        formData.append(i[0],i[1]);
      }
      if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
      if (finalPayload.images) {
        for (let image of finalPayload.images) {
          formData.append("images", image);
        }
      }
      // dispatch(showModal({isShowModal: true,modalChildren: <Loading/>}));
      const response = await apiCreateProduct(formData);
      // dispatch(showModal({isShowModal: false,modalChildren: null}));
      if (response.success) {
        toast.success(response.mes);
        reset(); 
        setPayload({ thumb: "", image: [] }); 
      } else {
        toast.error(response.mes);
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Create New Product</span>
      </h1>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
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
                code: el._id,
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
                ?.find((el) => el._id === watch("category"))
                ?.brand?.map((el) => ({ code: el, value: el }))}
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
            />
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
                {preview.images?.map((el, idx) => (
                  <div
                    // onMouseEnter={() => setHoverElm(el.name)}
                    // onMouseLeave={() => setHoverElm(null)}
                    key={idx}
                    className="w-fit relative"
                  >
                    <img
                      src={el.path}
                      alt="product"
                      className="w-[200px] object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="my-6">
              <Button type="submit">Create new product</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
