import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Container, ListGroup, Dropdown, Card, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useTranslation } from 'react-i18next';



const ProductCatalog = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); 
  // allows me to filter by category once selected in the bootstrap dropdown menu
  const [sorting, setSorting] = useState('asc')
  // Fake Store API defaults to ascending sorting
  const [searchBar, setSearchBar] = useState('');
  // state for search by product name
  const [priceMaxOrMin, setPriceMaxOrMin] = useState('max');
  const [priceSearchBar, setPriceSearchBar] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) =>{
      i18n.changeLanguage(lng);
    }

  useEffect(() => {
    const loginToken = sessionStorage.getItem('authenticationToken');
    const storedUserData = sessionStorage.getItem('userData');

    if (!loginToken || !storedUserData) {
      navigate('/');
    } else {
      fetchProducts();
      fetchCategories();
    }
  }, [navigate, sorting]);


  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products?sort=${sorting}`);
      setProducts(response.data);
      return response.data
    }
    catch (error) {
      console.error(error)
    }
  }
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products/categories');
      setCategories(response.data);
      return response.data
    }
    catch (error) {
      console.error(error)
    }
  };

  const handleCategorySelect = useCallback((category) =>{
    setSelectedCategory(category);
  }, []);

  const handleSorting = useCallback((order) => {
    setSorting(order);
  }, []);
  
  const handleSearch = useCallback((event) => {
    setSearchBar(event.target.value);
  }, []);

  const handlePriceMaxMin = useCallback((event) => {
    setPriceMaxOrMin(event.target.value);
  }, []);

  const handlePriceSearch = useCallback((event) => {
    setPriceSearchBar(event.target.value);
  }, []);

  // Added useCallback to memoize the functions for each event listener to minimize rerendering



  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
    const titleMatch = product.title.toLowerCase().includes(searchBar.toLowerCase());
    const categoryMatch = selectedCategory === '' || product.category === selectedCategory;
    let priceMatch = true
    if (priceSearchBar) {
      if (priceMaxOrMin === 'max') {
        priceMatch = product.price <= priceSearchBar;
      } else {
        priceMatch = product.price >= priceSearchBar;
      }
    }
    return titleMatch && categoryMatch && priceMatch;
  });
 }, [products, searchBar, priceSearchBar, priceMaxOrMin, selectedCategory]);

  // Added useMemo to memoize the filteredProducts array to minimize rerendering

  return (
    <Container>
      <header>
      <h1>{t('productCatalog.header')}</h1>
      </header>
      <div>
        <Button variant='warning' onClick={()=> changeLanguage('en')}>English</Button>
        <Button variant='warning' onClick={()=> changeLanguage('zh')}>普通话 中文</Button>
      </div>
      {/* Dropdown to set sorting by price */}
      <section>
      <Dropdown>
        <Dropdown.Toggle 
        variant="success" 
        id="dropdownPriceSort"
        aria-label={t('productCatalog.dropdownSortPrice.recordLabel')}
        >
          {t('productCatalog.dropdownSortPrice.toggleText')}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item 
          onClick={() => handleSorting('asc')}
          aria-label={t('productCatalog.dropdownSortPrice.ascItem.recordLabel')}
          >{t('productCatalog.dropdownSortPrice.ascItem.itemText')}
          </Dropdown.Item>
          <Dropdown.Item 
          onClick={() => handleSorting('desc')}
          aria-label={t('productCatalog.dropdownSortPrice.descItem.recordLabel')}
          >{t('productCatalog.dropdownSortPrice.descItem.itemText')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Dropdown list to select and filter by category*/}
      <Dropdown>
        <Dropdown.Toggle 
        variant="success" 
        id="dropdownSelectCategory"
        aria-label={t('productCatalog.dropdownSelectCategory.recordLabel')}
        >
          {t('productCatalog.dropdownSelectCategory.toggleText')}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {categories.map((category) => (
            <Dropdown.Item 
            key={category} 
            onClick={() => handleCategorySelect(category)}
            aria-label={t('productCatalog.dropdownSelectCategory.categoryItem.recordLabel', { category })}>
              {t('productCatalog.dropdownSelectCategory.categoryItem.itemText', { category })}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Form>
        <Form.Group className="my-2" controlId="searchByItem">
          <Form.Label>{t('productCatalog.itemSearchFormGroup.label')}</Form.Label>
          <Form.Control
          type="text" 
          placeholder={t('productCatalog.itemSearchFormGroup.placeholder')}
          value={searchBar} 
          onChange={handleSearch}
          aria-label={t('productCatalog.itemSearchFormGroup.recordLabel')}
          />
        </Form.Group>
        <Form.Group className="my-2">
          <Form.Label>{t('productCatalog.priceSearchFormGroup.label')}</Form.Label>
          <Form.Control
          type="number" 
          placeholder={t('productCatalog.priceSearchFormGroup.placeholder')} 
          value={priceSearchBar} 
          onChange={handlePriceSearch}     
          aria-label={t('productCatalog.priceSearchFormGroup.recordLabel')}
          />

        <Dropdown>
          <Dropdown.Toggle 
          variant="success" 
          id="dropdownPriceFilter"
          aria-label={t('productCatalog.dropdownPriceFilter.recordLabel')}
          >
            {priceMaxOrMin === 'max' ? t('productCatalog.dropdownPriceFilter.toggleTextMax') : t('productCatalog.dropdownPriceFilter.toggleTextMin')}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item 
            onClick={() => handlePriceMaxMin('max')}
            aria-label={t('productCatalog.dropdownPriceFilter.maxItem.recordLabel')}>{t('productCatalog.dropdownPriceFilter.maxItem.itemText')}</Dropdown.Item>
            <Dropdown.Item 
            onClick={() => handlePriceMaxMin('min')}
            aria-label={t('productCatalog.dropdownPriceFilter.minItem.recordLabel')}>{t('productCatalog.dropdownPriceFilter.minItem.itemText')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </Form.Group>
      </Form>
      </section>
      {/* Map through products */}
      <section>
      <ListGroup>
        {filteredProducts.map((product) => (
          <Card variant='info' key={product.id}>
            <Card.Img 
            variant="top" 
            src={product.image}
            alt={t('productCatalog.listGroupProducts.image.alt', { productTitle: product.title })}
            aria-label={t('productCatalog.listGroupProducts.image.recordLabel', { productTitle: product.title })}/>
            <Card.Body>
              <Card.Title>{t('productCatalog.listGroupProducts.title',{ productTitle: product.title })}</Card.Title>
              <Card.Text>
                {t('productCatalog.listGroupProducts.category', { productCategory: product.category})}<br />
                {t('productCatalog.listGroupProducts.price', { productPrice: product.price})}<br />
                {t('productCatalog.listGroupProducts.description', { productDescription: product.description })}<br />
                <Button 
                variant='success' 
                onClick={() => dispatch(addToCart(product))}
                aria-label={t('productCatalog.listGroupProducts.addButton.recordLabel', { productTitle: product.title })}>
                  {t('productCatalog.listGroupProducts.addButton.buttonText')}
                  </Button>
                {/* disptch addToCart reducer on click of add to cart button */}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </ListGroup>
      </section>
    </Container>
  )
}

export default ProductCatalog