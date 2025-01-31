import { Button, InputForm } from "components";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import avatar from "assets/avatar_default.png";
import { apiUpdateCurrent } from "apis";
import { getCurrent } from "store/user/asyncAction";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import withBaseComponent from "hocs/withBaseComponent";

const Personal = ({ navigate }) => {
  const {
    register,
    formState: { errors, isDirty },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const { current } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      email: current?.email,
      mobile: current?.mobile,
      avatar: current?.avatar,
      address: current?.address,
    });
  }, [current]);
  const handleUpdateInfor = async (data) => {
    const formData = new FormData();
    if (data.avatar?.length > 0) formData.append("avatar", data.avatar[0]);
    delete data.avatar;
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);
    const response = await apiUpdateCurrent(formData);
    if (response.success) {
      dispatch(getCurrent());
      toast.success(response.mes);
      if (searchParams.get("redirect")) navigate(searchParams.get("redirect"));
    } else toast.error(response.mes);
  };

  return (
    <div className="w-full relative px-4">
      <header className="text-3xl font-semibold text-pink-500 py-4 border-b border-b-main">
        Personal
      </header>
      <form
        onSubmit={handleSubmit(handleUpdateInfor)}
        className="w-3/5 mx-auto py-8 flex-col gap-4 flex"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <label htmlFor="file">
            <img
              src={current?.avatar || avatar}
              alt="avatar"
              className="w-20 h-20 object-cover rounded-full"
            />
          </label>
          <input type="file" id="file" {...register("avatar")} hidden />
        </div>
        <InputForm
          label="Firstname"
          register={register}
          errors={errors}
          id="firstname"
          validate={{
            required: "Need fill this field",
          }}
        />
        <InputForm
          label="Lastname"
          register={register}
          errors={errors}
          id="lastname"
          validate={{
            required: "Need fill this field",
          }}
        />
        <InputForm
          label="Email address"
          register={register}
          errors={errors}
          id="email"
          validate={{
            required: "Need fill this field",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email Invalid",
            },
          }}
        />
        <InputForm
          label="Phone Number"
          register={register}
          errors={errors}
          id="mobile"
          validate={{
            required: "Need fill this field",
            pattern: {
              value: /^(03|05|07|08|09|01[2|6|8|9])\d{8}$/,
              message: "Phone Invalid",
            },
          }}
        />
        <InputForm
          label="Address"
          register={register}
          errors={errors}
          id="address"
          validate={{
            required: "Need fill this field",
          }}
        />
        <div className="flex items-center gap-2">
          <span className="font-medium">Account status:</span>
          <span>{current?.isBlocked ? "Blocked" : "Actived"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Role:</span>
          <span>{+current?.role === 777 ? "Admin" : "User"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Created At:</span>
          <span>{moment(current?.createdAt).fromNow()}</span>
        </div>
        {isDirty && (
          <div className="w-full flex justify-end">
            <Button type="submit">Update Infomation</Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default withBaseComponent(Personal);
