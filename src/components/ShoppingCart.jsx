import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Container, ListGroup, Card, Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart, clearCart } from '../redux/cartSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { act } from '@testing-library/react'

const ShoppingCart = () => {

    const { cart } = useSelector((state) => state.cart)
    // useSelector allows us to access the cart state from the store
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) =>{
        i18n.changeLanguage(lng);
     }

    const [showCheckoutNotfication, setShowCheckoutNotification] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [products, setProducts] = useState({});

// useCallback to optimize performance by memoizing the fetchProductsForPrice function
    const fetchProductsForPrice = useCallback(async (productId) => {
        // Check for product data already cached in local storage  
        try{
        const cachedProduct = localStorage.getItem(`product-${productId}`);
        if (cachedProduct) {
            setProducts((prevProducts) => ({
                ...prevProducts,
                [productId]: JSON.parse(cachedProduct),
            }));
            return;
        } 

        if (!products[productId]) { //prevent fetching the same product multiple times
        
            const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
            const productData = response.data;
            localStorage.setItem(`product-${productId}`, JSON.stringify(productData)); // cache product data in local storage
            act(()=>{
                setProducts((prevProducts) => ({
                ...prevProducts,
                [productId]: productData,
            }));
        });
            }} catch (error) {
                console.error('Error fetching product details:', error);
            }
    }, [products]);


    // Fetch order history from FakeStoreAPI
        const fetchOrderHistory = useCallback(async () => {
            try {
            // Check for cached order history in local storage
            const cachedOrderHistory = localStorage.getItem('orderHistory');
            if (cachedOrderHistory) {
                act(()=>{
                setOrderHistory(JSON.parse(cachedOrderHistory));
                })
                return;
            }
        
            
                const response = await axios.get('https://fakestoreapi.com/carts');

                // Fetch products for each order
                const allProductIds = new Set();
                response.data.forEach(order => {
                    order.products.forEach(item => {
                        allProductIds.add(item.productId); // Collect productIds
                    });
                });

                // Fetch details for all unique productIds
                const productDetails = {}
                await Promise.all(
                    Array.from(allProductIds).map( async (productId) => {
                        await fetchProductsForPrice(productId);
                        productDetails[productId] = JSON.parse(localStorage.getItem(`product-${productId}`));
            })
            );
                    

                const responseWithPrice = response.data.map((order) => {
                    const totalPrice = order.products.reduce((total, item) => {
                        const product = productDetails[item.productId];
                        if (!product) return total; //Skips product if fetch call hasn't been completed yet or fails
                        return total + (product.price * item.quantity);
                    }, 0);
                    return {
                        ...order,
                        totalPrice,
                        products: order.products.map(item => ({
                            ...item,
                            ...productDetails[item.productId],
                        })),
                    };
                })
// cache order history in local storage
                localStorage.setItem('orderHistory', JSON.stringify(responseWithPrice));
                act(()=>{setOrderHistory(responseWithPrice);
                });
            } catch (error) {
                console.error(error);
            }
    }, [fetchProductsForPrice]);

    useEffect(() => {
        fetchOrderHistory();;
    }, [fetchOrderHistory]);
// memoize totalprice of each order in history
    // const calculateTotalPrice = useMemo(() => {
    //     return orderHistory..reduce((total, item) => {
    //         const product = products[item.productId];
    //         if (!product) {
    //             return total; //Skips product if fetch call hasn't been completed yet or fails
    //         }
    //         return total + (product.price * item.quantity);
    //     }, 0);
    // }, [products]);

    // Check for login and user data
    useEffect(() => {
        const loginToken = sessionStorage.getItem('authenticationToken');
        const storedUserData = sessionStorage.getItem('userData');

        if (!loginToken || !storedUserData) {
            navigate('/');
        }
    }, [navigate]);

    // memoize total price of all items in active user cart
    const handlePriceTotal = useMemo(() => {
        return cart.reduce((total, product) => total + (product.price * product.quantity), 0)
    }, [cart]);
// memoize total number of items in active user cart
    const handleTotalItems = useMemo(() => {
        return cart.reduce((total, product) => total + product.quantity, 0)
    }, [cart]);

    const handleCheckout = async () => {
        // Fetch data from sessionStorage
        const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
        const userId = storedUserData ? storedUserData.id : null;
        const date = new Date().toISOString().split('T')[0]; // Gets current date in YYYY-MM-DD format

        if (!userId) {
            console.error('User ID is missing');
            return;
        }

        // Prepare the order data
        const orderData = {
            userId,
            date,
            // Map cart data from store to match FakeStoreAPI's order format
            products: cart.map(product => ({
                productId: product.id,
                quantity: product.quantity,
            })),
        };

        try {
            // uses Axios to post order Data to FakeStoreAPI
            const response = await axios.post('https://fakestoreapi.com/carts', orderData);
            console.log('Order created:', response.data);

            // After successful order creation, clear the cart and show checkout notification
            dispatch(clearCart());
            setShowCheckoutNotification(true);
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    const handleCloseNotification = () => {
        setShowCheckoutNotification(false);
    }

    // handles choosing an order as the selected order from the order history section
    const handleShowOrderDetails = (orderId) => {
        const order = orderHistory.find(o => o.id === orderId);
        setSelectedOrder(order);
    };

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <Container>
            <h1>{t('shoppingCart.header')}</h1>
            <div>
                <Button variant='warning' onClick={()=> changeLanguage('en')}>English</Button>
                <Button variant='warning' onClick={()=> changeLanguage('zh')}>普通话 中文</Button>
            </div>
            <section>
            <ListGroup>
                {cart.length === 0 ? (
                    <h2>{t('shoppingCart.emptyCart')}</h2>
                ) : (
                    cart.map((product) => (
                        <ListGroup.Item key={product.id}>
                            <Card>
                                <Card.Img variant='top' src={product.image} alt={t('shoppingCart.cartListGroup.image.alt', { productTtitle : product.title})}/> {/*Added alt text for screen reader*/}
                                <Card.Body>
                                    <Card.Title>{t('shoppingCart.cartListGroup.title',{ productTitle: product.title })}</Card.Title>
                                    <Card.Text>
                                        {t('shoppingCart.cartListGroup.price', { productPrice: product.price})}<br />
                                        {t('shoppingCart.cartListGroup.description', { productDescription: product.description })}
                                        {t('shoppingCart.cartListGroup.quantity', {productQuantity : product.quantity})}<br />
                                        <Button 
                                        variant='success' 
                                        onClick={() => dispatch(addToCart(product))}
                                        aria-label={t('shoppingCart.addButton.recordLabel', {productTitle: product.title})}>
                                        {t('shoppingCart.addButton.buttonText')}</Button>
                                        {/* dispatches addToCart reducer from cartSlice */}
                                        <Button 
                                        variant='danger' 
                                        onClick={() => dispatch(removeFromCart(product))}
                                        aria-label={t('shoppingCart.removeButton.recordLabel')}>
                                        {t('shoppingCart.removeButton.buttonText')}</Button>
                                        {/* dispatches removeFromCart reducer from cartSlice */}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </ListGroup.Item>)))}
            </ListGroup>
            <p>{t('shoppingCart.totalItems')} {handleTotalItems}</p>
            <p>{t('shoppingCart.totalPrice')} {handlePriceTotal}</p>
            <Button 
            variant='danger' 
            onClick={() => dispatch(clearCart())}
            aria-label={t('shoppingCart.clearButton.recordLabel')}
            >{t('shoppingCart.clearButton.buttonText')}</Button>
            <Button 
            variant='success' 
            onClick={handleCheckout}
            aria-label={t('shoppingCart.checkoutButton.recordLabel')}
            >{t('shoppingCart.checkoutButton.buttonText')}</Button>
            <Modal 
            show={showCheckoutNotfication} 
            onHide={handleCloseNotification}
            aria-labelledby={t('shoppingCart.completionModal.recordLabel')}
            >
                <Modal.Header closeButton>
                    <Modal.Title id='checkoutNotification'>{t('shoppingCart.completionModal.modalTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('shoppingCart.completionModal.modalBody')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseNotification}>
                        {t('shoppingCart.completionModal.closeButton')}
                    </Button>
                </Modal.Footer>
            </Modal>
            </section>
            
            <section>
            <h2>{t('shoppingCart.orderHistoryHeader')}</h2>
            <ListGroup>
                {orderHistory.map((order) => (
                    <ListGroup.Item 
                    key={order.id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{t('shoppingCart.historyListGroup.orderId', {orderId: order.id})}</Card.Title>
                                    <Card.Text>
                                        {t('shoppingCart.historyListGroup.dateCreated')} {new Date(order.date).toLocaleDateString()}<br />
                                        {/* Uses local date string to support internationalization instead of raw date */}
                                        {t('shoppingCart.historyListGroup.totalPrice', {orderTotalPrice : order.totalPrice})}<br />
                                        <Button 
                                        variant='success' 
                                        onClick={() => handleShowOrderDetails(order.id)}
                                        aria-label={t('shoppingCart.historyListGroup.detailsButton.recordLabel', {orderId: order.id})}
                                        >{t('shoppingCart.historyListGroup.detailsButton.buttonText')}</Button>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            {/* Modal to show details of a selected order */}
            <Modal 
            show={selectedOrder !== null} 
            onHide={handleCloseOrderDetails}
            aria-labelledby={t('shoppingCart.detailsModal.recordLabel')}
            >
                <Modal.Header closeButton>
                    <Modal.Title id='orderDetails'>{t('shoppingCart.detailsModal.modalTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder &&(<>
                    {t('shoppingCart.detailsModal.orderId', {selectedOrderId: selectedOrder.id})} <br />
                    {t('shoppingCart.detailsModal.date')} {new Date(selectedOrder.date).toLocaleDateString()} <br />
                    {t('shoppingCart.detailsModal.totalPrice', {selectedOrderTotalPrice: selectedOrder.totalPrice})} <br />
                    {t('shoppingCart.detailsModal.productHeader')}<br/>
                            <ListGroup>
                                {selectedOrder.products.map((product) => (
                                    <ListGroup.Item key={product.productId}>
                                        {t('shoppingCart.detailsModal.productList.productId', {productProductId: product.productId})} <br />
                                        {t('shoppingCart.detailsModal.productList.quantity', {productQuantity: product.quantity})} <br />
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            </>)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseOrderDetails}>
                        {t('shoppingCart.detailsModal.closeButton')}
                    </Button>
                </Modal.Footer>
            </Modal>

            </section>
        </Container>
    )
}

export default ShoppingCart;