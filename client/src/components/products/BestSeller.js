import React, { memo, useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/product";
import {Product,CustomSliders} from "..";
import { useDispatch, useSelector } from "react-redux";
import { getNewProducts } from "../../store/products/asyncAction";
import clsx from "clsx";

const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "New Arrivals" },
];

const BestSeller = () => {
  const [betSellers, setBetSellers] = useState(null);
  const [activedTab, setActivedTab] = useState(1);
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch()
  const {newProducts} = useSelector(state => state.products)
  const {isShowModal} = useSelector(state => state.app)

  const fetchProduct = async () => {
    const response = await apiGetProducts({ sort: "-sold" })
    if (response.success){
      setBetSellers(response.products);
      setProducts(response.products)
    } 
  };

  useEffect(() => {
    fetchProduct();
    dispatch(getNewProducts())
  }, []);
  useEffect(() => {
    if(activedTab === 1 ) setProducts(betSellers)
    if(activedTab === 2 ) setProducts(newProducts)

  }, [activedTab]);
  return (
    <>
      <div className={clsx(isShowModal? 'hidden':'')}>
        <div className="flex text-[20px] ml-[-32px]">
          {tabs.map((el) => (
            <span
              key={el.id}
              onClick={() => setActivedTab(el.id)}
              className={`font-semibold cursor-pointer uppercase px-8 border-r text-gray-400 ${
                activedTab === el.id ? "text-pink-300" : ""
              }`}
            >
              {el.name}
            </span>
          ))}
        </div>
        <div className="mt-4 border-t-2 border-main mx-[-10px] pt-4">
          <CustomSliders products={products} activedTab={activedTab}/>
        </div>
        <div className="flex gap-4 mt-4">
          <img src="https://file.hstatic.net/200000837185/file/800x360_pc_asus_1650.png" alt="Banner" className="flex-1 object-fill w-[421px] h-[140px]"></img>
          <img src="https://file.hstatic.net/200000837185/file/1200x540_a38bbe12f89e4ab2a7408fab1a2ec970.png" alt="Banner" className="flex-1 object-fill w-[421px] h-[140px]"></img>
        </div>
      </div>
    </>
  );
};

export default memo(BestSeller);
