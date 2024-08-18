import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts } from "../../apis";
import Breadcrumb from "../../components/Breadcrumb";
import Slider from "react-slick";
import ReactImageMagnify from "react-image-magnify";
import {
  formatMoney,
  formatPrice,
  renderStartFromNumber,
} from "../../ultils/helper";
import {
  Button,
  CustomSliders,
  ProductExtraInfoItem,
  ProductInfomation,
  SelectQuantity,
} from "../../components";
import { productExtraInformation } from "../../ultils/contants";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const DetailProduct = () => {
  const { pid, title, category } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [update, setUpdate] = useState(false);

  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) {
      setProduct(response.productData);
      setCurrentImage(response.productData?.thumb);
    }
  };

  const fetchProducts = async () => {
    const response = await apiGetProducts({ category });
    if (response.success) setRelatedProducts(response.products);
  };

  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
    window.scrollTo(0, 0);
  }, [pid]);

  useEffect(() => {
    if (pid) fetchProductData();
  }, [update]);

  const rerender = useCallback(() => {
    setUpdate(!update)
  },[update])
  const handleQuantity = useCallback((number) => {
    const parsedNumber = parseInt(number, 10);
    if (!parsedNumber || parsedNumber < 1) {
      return;
    } else {
      setQuantity(parsedNumber);
    }
  }, []);

  const handleChangeQuantity = useCallback((flag) => {
    setQuantity((prevQuantity) => {
      let newQuantity = parseInt(prevQuantity, 10);
      if (flag === "minus" && newQuantity === 1) return newQuantity;
      if (flag === "minus") newQuantity -= 1;
      if (flag === "plus") newQuantity += 1;
      return newQuantity;
    });
  }, []);
  const handleClickImage = (e, el) => {
    e.stopPropagation();
    setCurrentImage(el);
  };

  return (
    <div className="w-full">
      <div className="h-[81px] flex items-center justify-center bg-pink-100">
        <div className="w-main">
          <h3 className="font-semibold">{title}</h3>
          <Breadcrumb title={title} category={category} />
        </div>
      </div>
      <div className="w-main m-auto mt-4 flex">
        <div className="flex flex-col gap-4 w-2/5">
          <div className="h-[458px] w-[458px] border overflow-hidden">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Wristwatch by Ted Baker London",
                  isFluidWidth: true,
                  src: currentImage,
                },
                largeImage: {
                  src: currentImage,
                  width: 916,
                  height: 916,
                },
              }}
            />
          </div>
          <div className="w-[458px]">
            <Slider
              className="image-slider flex gap-2 justify-between "
              {...settings}
            >
              {product?.images?.map((el) => (
                <div className="flex-1" key={el}>
                  <img
                    onClick={(e) => handleClickImage(e, el)}
                    src={el}
                    alt="sub-product"
                    className="h-[143px] cursor-pointer border object-contain"
                  ></img>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="w-2/5 pr-[24px] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-semibold">{`${formatMoney(
              formatPrice(product?.price)
            )} VNĐ`}</h2>
            <span className="text-sm text-main">{`In stock: ${product?.quantity}`}</span>
          </div>
          <div className="flex items-center gap-1">
            {renderStartFromNumber(product?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className="text-sm text-main italic">{`(Sold: ${product?.sold} pieces)`}</span>
          </div>
          <ul className="list-disc text-sm text-pink-500 pl-4">
            {product?.description?.map((el) => (
              <li className="leading-6" key={el}>
                {el}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Quantity</span>
              <SelectQuantity
                quantity={quantity}
                handleChangeQuantity={handleChangeQuantity}
                handleQuantity={handleQuantity}
              />
            </div>
            <Button fw>Add to Cart</Button>
          </div>
        </div>
        <div className="w-1/5">
          {productExtraInformation.map((el) => (
            <ProductExtraInfoItem
              key={el}
              title={el.title}
              icon={el.icon}
              sub={el.sub}
            />
          ))}
        </div>
      </div>
      <div className="w-main m-auto mt-8">
        <ProductInfomation
          totalRatings={product?.totalRatings}
          ratings={product?.ratings}
          nameProduct={product?.title}
          pid={product?._id}
          rerender={rerender}
        />
      </div>
      <div className="w-main m-auto mt-8">
        <h3 className="text-[20px] uppercase font-semibold py-[15px] border-b-2 border-main">
          Other Customers also buy:
        </h3>
        <CustomSliders normal={true} products={relatedProducts} />
      </div>
      <div className="w-full h-[100px]"></div>
    </div>
  );
};

export default DetailProduct;
