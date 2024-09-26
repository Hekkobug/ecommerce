import { apiDeleteUser, apiGetUsers, apiUpdateUser } from "apis";
import clsx from "clsx";
import { Button, InputField, InputForm, Pagination, Select } from "components";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { blockStatus, roles } from "ultils/contants";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoReturnDownBack } from "react-icons/io5";

const ManageUser = () => {
  const [users, setUsers] = useState(null);
  const [editElm, setEditElm] = useState(null);
  const [update, setUpdate] = useState(false);
  const [queries, setQueries] = useState({ q: "" });
  const [params] = useSearchParams();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    mobile: "",
    isBlocked: "",
  });

  const fetchUsers = async (queries) => {
    try {
      const response = await apiGetUsers({
        ...queries,
        limit: process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        setUsers(response);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("An error occurred while fetching users");
    }
  };

  const queriesDebounce = useDebounce(queries.q, 800);

  const render = useCallback(() => {
    setUpdate(prev => !prev);
  }, []);

  const handleUpdate = async (data) => {
    try {
      const response = await apiUpdateUser({
        ...data,
        phone: data.mobile,
      }, editElm?._id);
      if (response.success) {
        setEditElm(null);
        render();
        toast.success(response.mes);
      } else {
        toast.error(response.mes);
      }
    } catch (error) {
      toast.error("An error occurred while updating user");
    }
  };

  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this user?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiDeleteUser(uid);
          if (response.success) {
            render();
            toast.success(response.mes);
          } else {
            toast.error(response.mes);
          }
        } catch (error) {
          toast.error("An error occurred while deleting user");
        }
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const queriesObj = Object.fromEntries([...params]);
      if (queriesDebounce) queriesObj.q = queriesDebounce;
      await fetchUsers(queriesObj);
    };
    fetchData();
  }, [queriesDebounce, params, update]);

  useEffect(() => {
    if (editElm) {
      reset({
        email: editElm.email,
        firstname: editElm.firstname,
        lastname: editElm.lastname,
        role: editElm.role,
        mobile: editElm.mobile,
        isBlocked: editElm.isBlocked,
      });
    }
  }, [editElm, reset]);
  console.log(users?.counts)

  return (
    <div className={clsx("w-full", editElm && "pl-16")}>
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Manage users</span>
      </h1>
      <div className="w-full p-4">
        <div className="flex justify-end py-4 text-main">
          <InputField
            nameKey="q"
            value={queries.q}
            setValue={setQueries}
            style="w500"
            isShowLabel
            placeholder="Search name or mail user..."
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {editElm && (
            <div className="pl-6">
              <Button type="submit">Update</Button>
            </div>
          )}
          <table className="table-auto mb-6 text-left w-full">
            <thead className="font-bold bg-main text-[13px]">
              <tr className="border border-pink-200">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Email address</th>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.users?.map((el, idx) => (
                <tr
                  key={el.id}
                  className="border border-pink-200 text-white bg-purple-400"
                >
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id="email"
                        defaultValue={editElm?.email}
                        validate={{
                          required: "Require fill.",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id="firstname"
                        defaultValue={editElm?.firstname}
                        validate={{ required: "Require fill." }}
                      />
                    ) : (
                      <span>{el.firstname}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id="lastname"
                        defaultValue={editElm?.lastname}
                        validate={{ required: "Require fill." }}
                      />
                    ) : (
                      <span>{el.lastname}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <Select 
                        register={register}
                        fullWidth
                        errors={errors}
                        id="role"
                        defaultValue={+el.role}
                        validate={{ required: "Require fill." }}
                        options={roles}
                      />
                    ) : (
                      <span>
                        {roles.find(role => +role.code === +el.role)?.value}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id="mobile"
                        defaultValue={editElm?.mobile}
                        validate={{
                          required: "Require fill.",
                          pattern: {
                            value: /^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/,
                            message: "Invalid mobile number",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <Select 
                        register={register}
                        fullWidth
                        errors={errors}
                        id="isBlocked"
                        defaultValue={el.isBlocked}
                        validate={{ required: "Require fill." }}
                        options={blockStatus}
                      />
                    ) : (
                      <span>{el.isBlocked ? "Blocked" : "Active"}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <span
                        onClick={() => setEditElm(null)}
                        className="px-2 text-amber-200 hover:underline hover:text-white cursor-pointer inline-block"
                      >
                        <IoReturnDownBack size={20}/>
                      </span>
                    ) : (
                      <span
                        onClick={() => setEditElm(el)}
                        className="px-2 text-amber-200 hover:underline hover:text-white cursor-pointer inline-block"
                      >
                        <CiEdit size={20}/>
                      </span>
                    )}
                    <span
                      onClick={() => handleDeleteUser(el._id)}
                      className="px-2 text-amber-200 hover:underline hover:text-white cursor-pointer inline-block"
                    >
                      <RiDeleteBin5Line size={20}/>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users?.counts > process.env.REACT_APP_LIMIT && (
            <div className="flex justify-end">
              <Pagination totalCount={users?.counts} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ManageUser;
