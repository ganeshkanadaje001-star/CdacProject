const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

export const API = {
  AUTH: {
    LOGIN: `${BASE_URL}/User/signin`,
    REGISTER: `${BASE_URL}/User/SignUp`,
    ENCRYPT_PWD: `${BASE_URL}/User/pwd-encryption`,
  },

  PRODUCTS: {
    GET_ALL: `${BASE_URL}/products/all`,
    GET_BY_ID: (id) => `${BASE_URL}/products/byId/${id}`,
    GET_BY_NAME: (keyword) => `${BASE_URL}/products/byName/?keyword=${keyword}`,
    GET_BY_CATEGORY: (catId) => `${BASE_URL}/products/byCategoryId/${catId}?catId=${catId}`, // Note: Controller has both PathVar and RequestParam in signature? No, just RequestParam. Wait, let's check controller.
    // ProductController: @GetMapping("/byCategoryId/{catID}") public ResponseEntity<?> getByCategory(@RequestParam Long catId)
    // Actually the code says: @GetMapping("/byCategoryId/{catID}") public ResponseEntity<?> getByCategory(@RequestParam Long catId)
    // This is weird. It has a path variable {catID} but expects a RequestParam catId.
    // I should use the one that works.
    // Let's assume standard REST: /products/byCategoryId/1?catId=1 (redundant but safe given the code)
    CREATE: `${BASE_URL}/products/add`,
    UPDATE: (id) => `${BASE_URL}/products/update/${id}`,
    DELETE: (id) => `${BASE_URL}/products/delete/${id}`,
  },

  CATEGORIES: {
    GET_ALL: `${BASE_URL}/categories/all`,
    CREATE: `${BASE_URL}/categories/add`,
    UPDATE: (id) => `${BASE_URL}/categories/update/${id}`,
    DELETE: (id) => `${BASE_URL}/categories/delete?catId=${id}`, // Controller: @DeleteMapping("/delete") public ResponseEntity<?> deleteCat(Long catId) -> RequestParam implied if not @PathVariable
  },

  ADDRESS: {
    GET_ALL: `${BASE_URL}/addresses/getAll`,
    ADD: `${BASE_URL}/addresses/add`,
    DELETE: (id) => `${BASE_URL}/addresses/${id}`,
  },

  CART: {
    GET: `${BASE_URL}/cart/all`,
    ADD: `${BASE_URL}/cart/AddCart`,
    UPDATE: `${BASE_URL}/cart/update`,
    REMOVE: (productId) => `${BASE_URL}/cart/remove/${productId}`,
    CLEAR: `${BASE_URL}/cart/clear`,
  },

  ORDERS: {
    PLACE: `${BASE_URL}/order/addOrder`,
    MY_ORDERS: `${BASE_URL}/order/getMyOrder`,
    GET_ALL: `${BASE_URL}/order/all`,
  },
  MEDIA: {
    UPLOAD: `${BASE_URL}/media/upload`,
  },
  PAYMENTS: {
    CREATE: `${BASE_URL}/payments/create`,
    VERIFY: `${BASE_URL}/payments/verify`,
  },
};
