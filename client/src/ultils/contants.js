import path from "./path";
import icons from "./icons";

export const navigation = [
  {
    id: 1,
    value: "HOME",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "PRODUCTS",
    path: `/${path.PRODUCT}`,
  },
  {
    id: 3,
    value: "BLOGS",
    path: `/${path.BLOG}`,
  },
  {
    id: 4,
    value: "OUT SERVICES",
    path: `/${path.OUT_SERVICE}`,
  },
  {
    id: 5,
    value: "FAQS",
    path: `/${path.FAQ}`,
  },
];

const {
  IoShieldOutline,
  CiDeliveryTruck,
  IoGiftOutline,
  MdOutlineReplay,
  LiaTtySolid,
} = icons;
export const productExtraInformation = [
  {
    id: 1,
    title: "Guarantee",
    sub: "Quality Checked",
    icon: <IoShieldOutline />,
  },
  {
    id: 2,
    title: "Free Shipping",
    sub: "Free On All Products",
    icon: <CiDeliveryTruck />,
  },
  {
    id: 3,
    title: "Special Gift Cards",
    sub: "Special Gift Cards",
    icon: <IoGiftOutline />,
  },
  {
    id: 4,
    title: "Free Return",
    sub: "Within 7 Days",
    icon: <MdOutlineReplay />,
  },
  {
    id: 5,
    title: "Consultancy",
    sub: "Lifetime 24/7/356",
    icon: <LiaTtySolid />,
  },
];

export const productInfoTabs = [
  {
    id: 1,
    name: "Description",
    content: `Technology: GSM / HSPA / LTE
                Dimensions: 212.8 x 125.6 x 6.6 mm
Weight: 298 g
Display: Super AMOLED 8.4 inches
Resolution: 1600 x 2560
OS: Android OS, v4.4.2 (KitKat)
Chipset: Snapdragon 800
CPU: Quad-core 2.3 GHz
Internal: 16/32 GB, 3 GB RAM
Camera: 8 MP - 2.1 MP
Ever since the 2011 unveiling of the Galaxy Tab 7.7 we've been waiting for the next generation of Super AMOLED tablets. Three years later they have arrived - the Samsung Galaxy Tab S duo comes in 10.5" and 8.4" sizes and like the Tab 7.7 before them, they are stunningly thin.

Separate from the Galaxy Tab and Galaxy Note lines, the Galaxy Tab S tablets still share a lot with them. The powerful hardware platform, combined with proprietary TouchWiz features like Multi Window, instantly put the two at the forefront of functionality. Just look at that specs sheet.`,
  },
  {
    id: 2,
    name: "Warranty",
    content: `Warranty Information
LIMITED WARRANTIES
Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:

Frames Used In Upholstered and Leather Products
Limited Lifetime Warranty
A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
  },
  {
    id: 3,
    name: "Delivery",
    content: `Purchasing & Delivery
Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
  },
  {
    id: 4,
    name: "Payment",
    content: `Purchasing & Delivery
Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
  }
];

export const colors = [
  'black',
  'brown',
  'gray',
  'white',
  'pink',
  'yellow',
  'orange',
  'purple',
  'green',
  'blue',
]

export const sorts =[
  {
    id:1,
    value:'-sold',
    text: 'Best selling'
  },
  {
    id:2,
    value:'-title',
    text: 'Alphabetically,A-Z'
  },
  {
    id:3,
    value:'title',
    text: 'Alphabetically,Z-A'
  },
  {
    id:4,
    value:'-price',
    text: 'Price, high to low'
  },
  {
    id:5,
    value:'price',
    text: 'Price, low to high'
  },
  {
    id:6,
    value:'-createAt',
    text: 'Date, new to old'
  },
  {
    id:7,
    value:'createAt',
    text: 'Date, old to new'
  },
]

export const voteOptions =[
  {
    id:1,
    text:'Terrible'
  },
  {
    id:2,
    text:'Bad'
  },
  {
    id:3,
    text:'Neutral'
  },
  {
    id:4,
    text:'Good'
  },
  {
    id:5,
    text:'Perfect'
  },
]
const {LuLayoutDashboard,MdOutlineGroupAdd,TfiHarddrives,TfiClipboard,ImProfile,HiOutlineShoppingCart,GoHistory,FaHeartPulse} = icons
export const adminSidebar =[
  {
    id:1,
    type: 'SINGLE',
    text:'Dashboard',
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <LuLayoutDashboard size={25} />
  },
  {
    id:2,
    type: 'SINGLE',
    text:'Manage users',
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <MdOutlineGroupAdd size={25}/>
  },
  {
    id:3,
    type: 'PARENT',
    text:'Manage products',
    icon: <TfiHarddrives size={25}/>,
    submenu:[
      {
        text:'Create product',
        path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
      },
      {
        text:'Manage products',
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
      },
    ]
  },
  {
    id:4,
    type: 'SINGLE',
    text:'Manage orders',
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
    icon: <TfiClipboard size={25}/>
  },
]
export const memberSidebar =[
  {
    id:1,
    type: 'SINGLE',
    text:'Personal',
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <ImProfile className={'text-orange-400'} size={25} />
  },
  {
    id:2,
    type: 'SINGLE',
    text:'My cart',
    path: `/${path.MEMBER}/${path.MY_CART}`,
    icon: <HiOutlineShoppingCart className={'text-yellow-700'} size={25}/>
  },
  {
    id:3,
    type: 'SINGLE',
    text:'Buy histories',
    path: `/${path.MEMBER}/${path.HISTORY}`,
    icon: <GoHistory className={'text-blue-600'} size={25}/>
  },
  {
    id:4,
    type: 'SINGLE',
    text:'Wishlist',
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <FaHeartPulse className={'text-red-500'} size={25}/>
  },
]
export const roles =[
  {
    code: 777,
    value:'Admin'
  },
  {
    code: 111,
    value:'User'
  },
]
export const blockStatus =[
  {
    code: true,
    value:'Blocked'
  },
  {
    code: false,
    value:'Active'
  },
]