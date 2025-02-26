import { createSlice } from '@reduxjs/toolkit';


const loadCartFromSessionStorage = () => {
    const cart= sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}; // Loads cart from session storage if available or returns an empty array if nothing is saved

const saveCartToSessionStorage = (cart) => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}; //helper function allows us to save the cart to session storage

const initialState = {
    cart: loadCartFromSessionStorage(), //initially sets cart to whatever is saved in session storage
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // reducer to either add a new item entirely or increase quantity of item by one if product being added is already in cart
        addToCart: (state, action) => {
            const product = action.payload;
            const existingProduct = state.cart.find((item) => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity +=1;
            } else {
                state.cart.push({...product, quantity: 1 });
            }
            saveCartToSessionStorage(state.cart) //updates session storage to reflect use of reducer
        },
        // reducer to either lower quanity of item by one if quantity in cart is 2 or more or remove item entirely if quantity is 1
        removeFromCart: (state, action) => {
            const product = action.payload;
            const existingProduct = state.cart.find((item) => item.id === product.id);
            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1;
                } else {
                    state.cart = state.cart.filter((item) => item.id !== product.id);
                }

                saveCartToSessionStorage(state.cart); //updates session storage to reflect use of reducer
            }
        },
        // reducer to clear cart entirely or to reset after checkout
        clearCart: (state) => {
            state.cart = [];
            sessionStorage.removeItem('cart'); //empties cart from session storage
        },
    },
});
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;