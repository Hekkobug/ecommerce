import { Breadcrumb, Button, OrderItem } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import React from "react";
import { useSelector } from "react-redux";
import { createSearchParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { formatMoney } from "ultils/helper";
import path from "ultils/path";

const DetailCart = ({ location, navigate }) => {
  const { currentCart, current } = useSelector((state) => state.user);
  const handleSubmit = () => {
    if (!current?.address)
      return Swal.fire({
        icon: "info",
        title: "Almost!",
        text: "Please update your address before checkout",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Go update",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed)
          navigate({
            pathname: `/${path.MEMBER}/${path.PERSONAL}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
      });
    else window.open(`/${path.CHECKOUT}`, "_blank");
  };
  console.log(currentCart)

  return (
    <div className="w-full">
      <div className="h-[81px] flex items-center justify-center bg-cyan-300">
        <div className="w-main">
          <h3 className="font-semibold text-2xl uppercase">My Cart</h3>
        </div>
      </div>
      <div className="flex flex-col border w-main mx-auto my-8">
        <div className="w-main bg-main text-white opacity-70 mx-auto font-bold py-3 grid grid-cols-10">
          <span className="col-span-6 w-full text-center">Products</span>
          <span className="col-span-1 w-full text-center">Quantity</span>
          <span className="col-span-3 w-full text-center">Price</span>
        </div>
        {currentCart?.map((el) => (
          <OrderItem
            key={el._id}
            dfQuantity={el.quantity}
            color={el.color}
            title={el.title}
            thumbnail={el.thumbnail}
            price={el.price}
            pid={el.product?._id}
          />
        ))}
      </div>
      <div className="w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3">
        <span className="flex items-center gap-8 text-sm">
          <span>Subtotal:</span>
          <span className="text-main font-bold">{`${formatMoney(
            currentCart?.reduce((sum, el) => +el.price * el.quantity + sum, 0)
          )} VNĐ`}</span>
        </span>
        <span className="text-xs italic">
          Shipping, taxes, and discounts calculated at checkout.
        </span>
        <Button handleOnClick={handleSubmit}>Checkout</Button>
      </div>
    </div>
  );
};

export default withBaseComponent(DetailCart);
