import React, { memo, useState } from "react";
import { formatMoney, renderStartFromNumber } from "ultils/helper";
import label from "assets/label.png";
import icons from "ultils/icons";
import SelectOption from "components/search/SelectOption";
import withBaseComponent from "hocs/withBaseComponent";
import { showModal } from "store/app/appSlice";
import { DetailProduct } from "pages/public";
import { FaCartPlus } from "react-icons/fa";
import { apiUpdateCart } from "apis";
import { toast } from "react-toastify";
import { getCurrent } from "store/user/asyncAction";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "ultils/path";
import { BsCartCheckFill } from "react-icons/bs";
import { createSearchParams } from "react-router-dom";
const { FaEye, FaHeart } = icons;

const Product = ({ productData, isNew, normal, navigate, dispatch,location }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  const { current } = useSelector((state) => state.user);

  const handleClickOptions = async (e, flag) => {
    e.stopPropagation();
    if (flag === "CART") {
        if (!current) {
          return Swal.fire({
            title: "Almost...",
            text: "Please login first!",
            icon: "info",
            cancelButtonText: "Not now!",
            showCancelButton: true,
            confirmButtonText: "Go login page!",
          }).then((rs) => {
            if (rs.isConfirmed) navigate({
              pathname: `/${path.LOGIN}`,
              state: createSearchParams({ redirect: location.pathname }).toString(),
            });
          });
        }
      
        const response = await apiUpdateCart({
          pid: productData?._id,
          color: productData?.color,
          quantity:1,
          price: productData?.price,
          thumbnail: productData?.thumb,  
          title: productData?.title,
        });
      
        if (response.success) {
          toast.success(response.mes);
          dispatch(getCurrent());
        } else toast.error(response.mes);
      };
    if (flag === "WISHLIST") console.log("WISHLIST");
    if (flag === "QUICK_VIEW") {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <DetailProduct
              data={{ pid: productData?._id, category: productData?.category }}
              isQuickView
            />
          ),
        })
      );
    }
  };

  return (
    <div className="w-full flex-auto text-base px-[10px]">
      <div
        className="w-full border p-[15px] flex-flex-col items-center"
        onClick={() =>
          navigate(
            `/${productData?.category?.toLowerCase()}/${productData?._id}/${
              productData?.title
            }`
          )
        }
        onMouseEnter={() => setIsShowOption(true)}
        onMouseLeave={() => setIsShowOption(false)}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
              <span
                title="Add to Wishlist"
                onClick={(e) => handleClickOptions(e, "WISHLIST")}
              >
                <SelectOption icon={<FaHeart color="purple" />} />
              </span>
              {current?.cart?.some(
                (el) => el.product === productData._id
              ) ? (
                <span
                  title="Added to Cart"
                  onClick={(e) => handleClickOptions(e, "CART")}
                >
                  <SelectOption icon={<BsCartCheckFill color="green" />} />
                </span>
              ) : (
                <span
                  title="Add to Cart"
                  onClick={(e) => handleClickOptions(e, "CART")}
                >
                  <SelectOption icon={<FaCartPlus color="purple" />} />
                </span>
              )}
              <span
                title="Quick View"
                onClick={(e) => handleClickOptions(e, "QUICK_VIEW")}
              >
                <SelectOption icon={<FaEye color="purple" />} />
              </span>
            </div>
          )}
          <img
            src={productData?.thumb || ""}
            alt="https://conversion.mycareersfuture.gov.sg/Portal/img/ImageNotFound.jpg?1458"
            className="w-[274px] h-[274px] object-cover"
          />
          {!normal && (
            <>
              <img
                src={label}
                alt=""
                className="absolute top-[-20px] left-[-19px] w-[70px] h-[56px] object-cover"
              />
              <span className="font-bold top-[-5px] left-[2px] text-pink-300 absolute">
                {isNew ? "New" : "Hot"}
              </span>
            </>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="flex h-4">
            {renderStartFromNumber(productData?.totalRatings)?.map(
              (el, index) => (
                <span key={index}>{el}</span>
              )
            )}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(Product));
