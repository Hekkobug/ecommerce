import React, { useCallback, useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb, InputSelect, Pagination, Product, SearchItem } from "../../components";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { sorts } from "../../ultils/contants";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const Products = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [sort, setSort] = useState('');
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const { category } = useParams();

  const fetchProductsByCategory = async (queries) => {
    if(category && category !== 'products') queries.category = category
    const response = await apiGetProducts(queries);
    if (response.success) setProducts(response);
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params])
    let priceQuery ={}
    if(queries.to && queries.from){
       priceQuery = {$and:[
        {price: {gte:queries.from}},
        {price: {lte:queries.to}}
      ]}
      delete queries.price
    }else{
      if(queries.from) queries.price = {gte: queries.from}
    if(queries.to) queries.price = {lte: queries.to}
    }
    delete queries.from
    delete queries.to
    fetchProductsByCategory({...priceQuery,...queries});
    window.scrollTo(0,0)
  }, [params]);
  const changeActiveFilter = useCallback(
    (name) => {
      if (activeClick === name) setActiveClick(null);
      else setActiveClick(name);
    },
    [activeClick]
  );
  const changeValue = useCallback((value) => {
    setSort(value);
  },[sort])
  useEffect(() => {
    if(sort){
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({sort}).toString(),
      });
    }
  },[sort])
  return (
    <div className="w-full">
      <div className="h-[81px] flex items-center justify-center bg-pink-100">
        <div className="w-main">
          <h3 className="font-semibold uppercase">{category}</h3>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className="w-main border p-4 flex justify-between mt-8 m-auto">
        <div className="w-4/5 flex-auto flex flex-col">
          <span className="font-semibold text-sm">Filter by</span>
          <div className="flex items-start gap-3">
            <SearchItem
              name="Price"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              type="input"
            />
            <SearchItem
              name="Color"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
            />
          </div>
        </div>
        <div className="w-1/5 flex flex-col gap-3">
        <span className="font-semibold text-sm">Sort by</span>
        <div>
          <InputSelect changValue={changeValue} value={sort} options={sorts}/>
        </div>
        </div>
      </div>
      <div className="mt-8 w-main m-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex mx-[-10px]"
          columnClassName="my-masonry-grid_column"
        >
          {products?.products?.map((el) => (
            <Product key={el._id} pid={el._id} productData={el} normal={true} />
          ))}
        </Masonry>
      </div>
      <div className="w-main m-auto my-4 flex justify-end">
          <Pagination totalCount={products?.counts}/>
      </div>
      <div className="w-full h-[500px]"></div>
    </div>
  );
};

export default Products;
