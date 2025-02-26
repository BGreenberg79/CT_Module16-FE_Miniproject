import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserLogin = () => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState({
        username: '',
        password: ''
    });

    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }

    const loginAPI = async (loginUser) => {
        // API Request authenticates user 
        try{
            const response = await axios.post('https://fakestoreapi.com/auth/login',
            {username: loginUser.username,
            password: loginUser.password})

            // returning the response.data will provide the token we needto save to session storage 
            return response.data;}
        catch (error) {
            console.error(error)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
        const responseData = await loginAPI(loginUser);

        if (responseData && responseData.token) {
            sessionStorage.setItem('authenticationToken', responseData.token);
            sessionStorage.setItem('userData', JSON.stringify(responseData)); //stores all of user's data
            navigate('/product-catalog');
        } else {
            alert('Invalid username or password');
        }}
        catch (error) {
            console.error(error)
        }
    }


  return (
    <Container>
        <header>
            <h1>{t('userLogin.header')}</h1>
        </header>
        <div>
            <Button variant='warning' onClick={()=> changeLanguage('en')}>English</Button>
            <Button variant='warning' onClick={()=> changeLanguage('zh')}>普通话 中文</Button>
        </div>
        <section>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mx-1 my-2" controlId='usernameLogin'>
                    <Form.Label>{t('userLogin.usernameFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('userLogin.usernameFormGroup.placeholder')}
                        onChange={event =>
                            setLoginUser({...loginUser, username: event.target.value})
                        }
                        value={loginUser.username}
                        required
                        aria-label={t('userLogin.usernameFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Form.Group className="mx-1 my-2" controlId='passwordLogin'>
                    <Form.Label>{t('userLogin.passwordFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder={t('userLogin.passwordFormGroup.placeholder')}
                        onChange={event =>
                            setLoginUser({...loginUser, password: event.target.value})
                        }
                        value={loginUser.password}
                        required
                        aria-label={t('userLogin.passwordFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Button 
                variant="success" 
                type="submit"
                aria-label={t('userLogin.loginButton.recordLabel')}>
                        {t('userLogin.loginButton.buttonText')}
                </Button>
            </Form>
        </section>
    </Container>
      )
}

export default UserLogin;