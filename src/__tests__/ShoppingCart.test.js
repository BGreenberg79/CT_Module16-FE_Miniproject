import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import { Provider } from 'react-redux';
import ShoppingCart from '../components/ShoppingCart';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { configureStore }  from '@reduxjs/toolkit';
import cartReducer from '../redux/cartSlice';
import { addToCart } from '../redux/cartSlice';

jest.mock('axios');

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            if (key === 'shoppingCart.cartListGroup.price') {
                return '$100';
            }
            if (key === 'shoppingCart.cartListGroup.title') {
                return 'testItem';
            }
            if (key === 'shoppingCart.removeButton.buttonText') {
                return 'Remove';
            }
            if (key === 'shoppingCart.clearButton.buttonText') {
                return 'Clear Cart';
            }
            if (key === 'shoppingCart.checkoutButton.buttonText') {
                return 'Checkout';
            }
            return key;
        },
        i18n: {
            changeLanguage: jest.fn(),
        },
    }),
}));


const mockCartItem = {
    id: 1,
    title: 'testItem',
    price: 100,
    category: 'testCategory',
    description: 'testDescription',
    image: 'testImage',
    quantity: 1
}

describe('ShoppingCart Component integration tests', () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                cart: cartReducer
            }
        });
        sessionStorage.setItem('authenticationToken', 'mockToken');
        sessionStorage.setItem('userData', JSON.stringify({ id: 1, name: 'Test User' }));
        axios.get.mockResolvedValue({
            data: {
                id: 1,
                title: 'testItem',
                price: 100,
                category: 'testCategory',
                description: 'testDescription',
                image: 'testImage',
            },
        });
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    userId: 1,
                    date: '2023-10-01',
                    products: [
                        {
                            productId: 1,
                            quantity: 1,
                        },
                    ],
                },
            ],
        });
        axios.post.mockResolvedValueOnce({ data: { success: true } });
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        sessionStorage.clear();
        jest.clearAllMocks();
        console.log.mockRestore();
    });

    test('render empty shopping cart message when empty', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ShoppingCart />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText(/shoppingCart.emptyCart/i)).toBeInTheDocument();
    });

    // test('adds items when add button is clicked', async () => {
    //     render(
    //         <Provider store={store}>
    //             <BrowserRouter>
    //                 <ShoppingCart />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     await act(async () => {
    //         store.dispatch(addToCart(mockCartItem));
    //     });

    //     screen.debug()

    //         expect(await screen.findByText('testItem')).toBeInTheDocument();
    //         expect(await screen.findByText('$100')).toBeInTheDocument();
    // });

    test('removes items when remove button is clicked', async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ShoppingCart />
                </BrowserRouter>
            </Provider>
        );

        await act(async () => {
            store.dispatch(addToCart(mockCartItem))
    });


        const removeButton = screen.getByRole('button', {name: /Remove/i});
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(screen.queryByText(/testItem/i)).toBeNull();
        });
    });

    // test('clears cart when clear button is clicked', async () => {

    //     render(
    //         <Provider store={store}>
    //             <BrowserRouter>
    //                 <ShoppingCart />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     await act(async () => {
    //         store.dispatch(addToCart(mockCartItem));
    //     });

    //     const clearButton = await screen.findByRole('button', {name:'Clear Cart'});
    //     fireEvent.click(clearButton);

    //     expect(await screen.findByText(/shoppingCart.emptyCart/i)).toBeInTheDocument();
    // });

    test('checks out successfully and clears cart', async () => {
        axios.post.mockResolvedValueOnce({ data: { success: true } });

        render (
            <Provider store={store}>
                <BrowserRouter>
                    <ShoppingCart />
                </BrowserRouter>
            </Provider>
        );

        await act(async () => {
            store.dispatch(addToCart(mockCartItem));
        });

        const checkoutButton = screen.getByRole('button', { name: /Checkout/i });
        fireEvent.click(checkoutButton)

        await waitFor(() => {
            expect(screen.getByText(/shoppingCart.emptyCart/i)).toBeInTheDocument();
        });
    });
});