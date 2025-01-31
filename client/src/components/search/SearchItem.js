import React, { memo, useEffect, useState } from "react";
import icons from "ultils/icons";
import { colors } from "ultils/contants";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apiGetProducts } from "apis/product";
import useDebounce from "hooks/useDebounce";
const { AiOutlineDown } = icons;

const SearchItem = ({
  name,
  activeClick,
  changeActiveFilter,
  type = "checkbox",
}) => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [params] = useSearchParams()
  const [selected, setSelected] = useState([]);
  const [bestPrice, setBestPrice] = useState({from:'',to:''});
  const [price, setPrice] = useState([0,0]);

  const handleSelect = (e) => {
    setSelected((prevSelected) => {
      const alreadyEl = prevSelected.find((el) => el === e.target.value);
      if (alreadyEl) {
        return prevSelected.filter((el) => el !== e.target.value);
      } else {
        return [...prevSelected, e.target.value];
      }
    });
    changeActiveFilter(null);
  };

  const fetchBestPriceProduct = async () => {
    const response = await apiGetProducts({ sort: "-price", limit: 1 });
    if (response.success) setBestPrice(response.products[0]?.price);
  };
  useEffect(() => {
    let param = []
    for (let i of params.entries()) param.push(i);
    const queries = {}
    for (let i of param) queries[i[0]] = i[1];
    if (selected.length > 0) {
    if(selected) queries.color = selected.join(',')
    queries.page = 1
    }else delete queries.color
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [selected]);

  useEffect(() => {
    if(price.from > price.to && price.from && price.to) alert('From price cannot be greater than To price')
  },[price])

  useEffect(() => {
    if (type === "input") fetchBestPriceProduct();
  }, [type]);
  const deboucePriceFrom = useDebounce(price.from, 500);
  const deboucePriceTo = useDebounce(price.to, 500);
  useEffect(() => {
    let param = []
    for (let i of params.entries()) param.push(i);
    const queries = {}
    for (let i of param) queries[i[0]] = i[1];
    if(Number(price.from) >0) queries.from = price.from
    else delete queries.from
    if(Number(price.to) >0) queries.to = price.to
    else delete queries.to
    queries.page = 1
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [deboucePriceFrom,deboucePriceTo]);
  return (
    <div
      onClick={() => changeActiveFilter(name)}
      className="p-3 cursor-pointer text-main text-xs gap-6 relative border border-pink-300 flex justify-between items-center"
    >
      <span>{name}</span>
      <AiOutlineDown />
      {activeClick === name && (
        <div className="absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-pink-200 min-w-[150px]">
          {type === "checkbox" && (
            <div className="p-2">
              <div className="p-4 items-center flex justify-between gap-8 border-b">
                <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected([]);
                    changeActiveFilter(null)
                  }}
                  className="underline cursor-pointer hover:text-main"
                >
                  Reset
                </span>
              </div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-3 mt-4"
              >
                {colors.map((el, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      value={el}
                      onChange={handleSelect}
                      id={el}
                      name={el}
                      checked={selected.some(
                        (selectedItem) => selectedItem === el
                      )}
                      className="form-checkbox"
                    />
                    <label className="capitalize text-gray-700" htmlFor={el}>
                      {el}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "input" && (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="p-4 items-center flex justify-between gap-8 border-b">
                <span className="whitespace-nowrap">{`The highest price is ${Number(
                  bestPrice
                ).toLocaleString()} VNĐ`}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrice({ from: "", to: "" });
                    changeActiveFilter(null)
                  }}
                  className="underline cursor-pointer hover:text-main"
                >
                  Reset
                </span>
              </div>
              <div className="flex items-center gap-2 p-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="from">From</label>
                  <input
                    className="form-input"
                    type="number"
                    id="from"
                    value={price.from}
                    onChange={(e) =>
                      setPrice(prev => ({...prev,from: e.target.value}))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="to">To</label>
                  <input
                    className="form-input"
                    type="number"
                    id="to"
                    value={price.to}
                    onChange={(e) =>
                      setPrice(prev => ({...prev,to: e.target.value}))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SearchItem);
