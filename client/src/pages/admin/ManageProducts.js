import { apiDeleteProduct, apiGetProducts } from "apis";
import { CustomizeVarriants, InputForm, Pagination } from "components";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ManageProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [products, setProducts] = useState([]);
  const [counts, setCounts] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  const [customizeVarriant, setCustomizeVarriant] = useState(false);

  const render = useCallback(() => {
    setUpdate((prev) => !prev);
  }, []);

  const fetchProducts = async (params) => {
    try {
      const response = await apiGetProducts({
        ...params,
        limit: process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        setProducts(response.products);
        setCounts(response.counts);
      }
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const queryDebounce = useDebounce(watch("q"), 800);

  useEffect(() => {
    const searchParams = queryDebounce ? { q: queryDebounce } : {};
    navigate({
      pathname: location.pathname,
      search: createSearchParams(searchParams).toString(),
    });
  }, [queryDebounce, navigate, location.pathname]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProducts(searchParams);
  }, [params, update]);

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to remove this product?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiDeleteProduct(pid);
          if (response.success) {
            toast.success(response.mes);
            render();
          } else {
            toast.error(response.mes);
          }
        } catch (error) {
          toast.error("Failed to delete product.");
        }
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      {editProduct && (
        <div className="absolute inset-0 min-h-screen bg-pink-700 z-50">
          <UpdateProduct
            editProduct={editProduct}
            render={render}
            setEditProduct={setEditProduct}
          />
        </div>
      )}
      {customizeVarriant && (
        <div className="absolute inset-0 min-h-screen bg-pink-700 z-50">
          <CustomizeVarriants
            customizeVarriant={customizeVarriant}
            render={render}
            setCustomizeVarriant={setCustomizeVarriant}
          />
        </div>
      )}
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full flex justify-between items-center px-4 fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
      </div>
      <div className="flex w-full justify-end items-center">
        <form className="w-[45%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWidth
            placeholder="Search products by title, description, etc."
          />
        </form>
      </div>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr className="border bg-main py-2">
            <th className="text-center py-2">Order</th>
            <th className="text-center py-2">Thumb</th>
            <th className="text-center py-2">Title</th>
            <th className="text-center py-2">Brand</th>
            <th className="text-center py-2">Category</th>
            <th className="text-center py-2">Price</th>
            <th className="text-center py-2">Quantity</th>
            <th className="text-center py-2">Sold</th>
            <th className="text-center py-2">Color</th>
            <th className="text-center py-2">Ratings</th>
            <th className="text-center py-2">Varriants</th>
            <th className="text-center py-2">Updated At</th>
            <th className="text-center py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((el, idx) => (
            <tr
              key={el._id}
              className="border-b text-pink-700 bg-green-400"
            >
              <td className="text-center">
                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  idx +
                  1}
              </td>
              <td className="text-center">
                <img
                  src={el.thumb}
                  alt="thumb"
                  className="w-12 h-12 object-cover"
                />
              </td>
              <td className="text-center py-2">{el.title}</td>
              <td className="text-center py-2">{el.brand}</td>
              <td className="text-center py-2">{el.category}</td>
              <td className="text-center py-2">{el.price}</td>
              <td className="text-center py-2">{el.quantity}</td>
              <td className="text-center py-2">{el.sold}</td>
              <td className="text-center py-2">{el.color}</td>
              <td className="text-center py-2">{el.totalRatings}</td>
              <td className="text-center py-2">{el?.varriants?.length || 0}</td>
              <td className="text-center py-2">
                {moment(el.updatedAt).format("DD/MM/YYYY")}
              </td>
              <td className="text-center py-2">
                <span
                  onClick={() => setEditProduct(el)}
                  className="px-1 text-orange-500 hover:underline cursor-pointer inline-block hover:text-white"
                >
                  <CiEdit size={20} />
                </span>
                <span
                  onClick={() => handleDeleteProduct(el._id)}
                  className="px-1 text-orange-500 hover:underline cursor-pointer inline-block hover:text-white"
                >
                  <RiDeleteBin5Line size={20} />
                </span>
                <span
                  onClick={() => setCustomizeVarriant(el)}
                  className="px-1 text-orange-500 hover:underline cursor-pointer inline-block hover:text-white"
                >
                  <MdOutlineDashboardCustomize size={20} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default ManageProducts;
