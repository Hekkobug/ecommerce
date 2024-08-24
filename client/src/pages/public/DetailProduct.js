import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts } from "../../apis";
import Breadcrumb from "../../components/common/Breadcrumb";
import Slider from "react-slick";
import ReactImageMagnify from "react-image-magnify";
import DOMPurify from 'dompurify';
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
import clsx from "clsx";

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
  const [varriant, setVarriant] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    title:'',
    thumb:'',
    images:[],
    price:'',
    color:'',
  });

  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) {
      setProduct(response.productData);
      setCurrentImage(response.productData?.thumb);
    }
  };

  useEffect(() => {
    if(varriant){
      setCurrentProduct({
        title: product?.varriants?.find(el => el.sku === varriant)?.title,
        color: product?.varriants?.find(el => el.sku === varriant)?.color,
        images: product?.varriants?.find(el => el.sku === varriant)?.images,
        price: product?.varriants?.find(el => el.sku === varriant)?.price,
        thumb: product?.varriants?.find(el => el.sku === varriant)?.thumb,
      })
    }
  },[varriant,product])

  const fetchProducts = async () => {
    const response = await apiGetProducts({ category });
    if (response.success) setRelatedProducts(response.products);
  };

  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
      window.scrollTo(0, 0);
    }
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
          <h3 className="font-semibold">{currentProduct.title ||product?.title}</h3>
          <Breadcrumb title={currentProduct.title || product?.title} category={category} />
        </div>
      </div>
      <div className="w-main m-auto mt-4 flex">
        <div className="flex flex-col gap-4 w-2/5">
          <div className="h-[458px] w-[458px] border items-center overflow-hidden">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Wristwatch by Ted Baker London",
                  isFluidWidth: true,
                  src: currentProduct.thumb || currentImage,
                },
                largeImage: {
                  src: currentProduct.thumb || currentImage,
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
              {currentProduct.images.length === 0 && product?.images?.map((el) => (
                <div className="flex-1" key={el}>
                  <img
                    onClick={(e) => handleClickImage(e, el)}
                    src={el}
                    alt="sub-product"
                    className="h-[143px] cursor-pointer border object-contain"
                  ></img>
                </div>
              ))}
              {currentProduct.images.length > 0 && currentProduct.images?.map((el) => (
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
              formatPrice(currentProduct.price || product?.price)
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
          {product?.description?.length >1 && product?.description?.map((el) => (
              <li className="leading-6" key={el}>
                {el}
              </li>
            ))}
            {product?.description?.length === 1 && <div className="text-sm mb-8 line-clamp-[10]" dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(product?.description[0])}}></div>}
          </ul>
          <div className="my-4 flex gap-4">
              <span className="font-bold">Color:</span>
              <div className="flex flex-wrap gap-4 items-center w-full">
                <div onClick={() => setVarriant(null)} className={clsx("flex items-center gap-2 p-2 border cursor-pointer",!varriant && 'border-main')}>
                  <img src={product?.thumb} alt="thumb" className="w-8 h-8 rounded-md object-cover"></img>
                  <span className="flex flex-col">
                  <span>{product?.color}</span>
                  <span className="text-sm">{product?.price}</span>
                  </span>
                </div>
                {product?.varriants?.map(el => (
                  <div onClick={() => setVarriant(el.sku)} className={clsx("flex items-center gap-2 p-2 border cursor-pointer",varriant === el.sku && 'border-main')}>
                  <img src={el.thumb} alt="thumb" className="w-8 h-8 rounded-md object-cover"></img>
                  <span className="flex flex-col">
                  <span>{el?.color}</span>
                  <span className="text-sm">{el?.price}</span>
                  </span>
                </div>
                ))}
              </div>
          </div>
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
