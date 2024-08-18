import React, { memo, useState } from "react";
import { productInfoTabs } from "../ultils/contants";
import Votebar from "./Votebar";
import { renderStartFromNumber } from "../ultils/helper";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../store/app/appSlice";
import VoteOption from "./VoteOption";
import { apiRatings } from "../apis";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "../ultils/path";
import Comment from "./Comment";
const tabs = [
  "Description",
  "Warranty",
  "Delivery",
  "Payment",
  "Customer Reviews",
];

const ProductInfomation = ({ totalRatings,ratings,rerender, nameProduct, pid }) => {
  const [activedTab, setActivedTab] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const handleSubmitVoteOption = async ({ comment, score }) => {
    if (!comment || !pid || !score) {
      alert("Please vote when click submit");
      return;
    }
    await apiRatings({ star: score, comment, pid,updatedAt:Date.now() });
    dispatch(showModal({isShowModal: false,modalChildren: null}))
    rerender()
  };
  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: "Login to vote",
        cancelButtonText: "Cancel",
        confirmButtonText: "Go login",
        title: "Oops!",
        showCancelButton: true,
      }).then((rs) => {
        if (rs.isConfirmed) navigate(`/${path.LOGIN}`);
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <VoteOption
              nameProduct={nameProduct}
              handleSubmitVoteOption={handleSubmitVoteOption}
            />
          ),
        })
      );
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 relative bottom-[-1px]">
        {productInfoTabs.map((el) => (
          <span
            className={`py-2 cursor-pointer text-white uppercase px-4 ${
              activedTab === +el.id
                ? "bg-pink-500 border border-b-0"
                : "bg-main"
            }`}
            key={el.id}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="w-full p-4 border">
        {productInfoTabs.some((el) => el.id === activedTab) &&
          productInfoTabs.find((el) => el.id === activedTab)?.content}
      </div>
      <div>
          <div className="flex flex-col w-main py-8">
          <span
            className={`py-2 cursor-pointer text-white uppercase px-4 bg-pink-500 border border-b-0`}>
            CUSTOMER REVIEW
          </span>
            <div className="flex border border-main">
              <div className="flex-4 flex-col flex items-center justify-center">
                <span className="font-semibold text-3xl">{`${totalRatings}/5`}</span>
                <span className="flex items-center gap-1">
                  {renderStartFromNumber(totalRatings)?.map((el, index) => (
                    <span key={index}>{el}</span>
                  ))}
                </span>
                <span className="text-sm">{`${ratings?.length} reviewers and commentor`}</span>
              </div>
              <div className="flex-6 flex flex-col gap-2 p-4">
                {Array.from(Array(5).keys())
                  .reverse()
                  .map((el) => (
                    <Votebar
                      key={el}
                      number={el + 1}
                      ratingTotal={ratings?.length}
                      ratingCount={ratings?.filter(i => i.star === el +1)?.length}
                    />
                  ))}
              </div>
            </div>
            <div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
              <span>Do you review this product?</span>
              <Button handleOnClick={handleVoteNow}>Vote now!</Button>
            </div>
            <div className="flex flex-col gap-4">
              {ratings?.map(el => (
                <Comment
                  key={el._id}
                  comment={el.comment}
                  updatedAt={el.updatedAt}
                  star={el.star}
                  name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
                />
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default memo(ProductInfomation);
