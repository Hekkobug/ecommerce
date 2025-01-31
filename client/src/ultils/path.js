const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCT_CATEGORY: ':category',
    BLOG: 'blogs',
    OUT_SERVICE: 'services',
    FAQ: 'faqs',
    DETAIL_PRODUCT_CATEGORY_PID_TITLE:':category/:pid/:title',
    FINAL_REGISTER:'finalregister/:status',
    RESET_PASSWORD:'reset-password/:token',
    DETAIL_CART:'my-cart',
    CHECKOUT:'checkout',
    PRODUCTS: 'products',


    // Admin
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCTS: 'manage-products',
    MANAGE_ORDER: 'manage-order',
    CREATE_PRODUCTS: 'create-products',

    //Members
    MEMBER:'member',
    PERSONAL: 'personal',
    MY_CART: 'my-cart',
    HISTORY: 'buy-history',
    WISHLIST: 'wishlist',
}

export default path;