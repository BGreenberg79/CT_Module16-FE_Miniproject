import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';


const CreateUser = () => {

    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) =>{
        i18n.changeLanguage(lng);
    }
    const [user, setUser] = useState({
        email: '',
        username: '',
        password: '',
        name: {
            firstname: '',
            lastname: ''
        },
        address: {
            city: '',
            street: '',
            number: 0,
            zipcode: '',
            geolocation: {
                lat: '',
                long: ''
            }
        },
        phone: '',
    });

    const addUserAPI = async (user) => {
        try {
            const response = await axios.post('https://fakestoreapi.com/users',
            {
                email: user.email,
                username: user.username,
                password: user.password,
                name: {
                    firstname: user.name.firstname,
                    lastname: user.name.lastname
                },
                address: {
                    city: user.address.city,
                    street: user.address.street,
                    number: user.address.number,
                    zipcode: user.address.zipcode,
                    geolocation: {
                        lat: user.address.geolocation.lat,
                        long: user.address.geolocation.long
                    }
                },
                phone: user.phone
            });
        return response.data;
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addUserAPI(user);
    }


    return (
        <Container>
            <header>
            <h1>{t('createUser.header')}</h1>
            </header>
            <div>
                <Button variant='warning' onClick={()=> changeLanguage('en')}>English</Button>
                <Button variant='warning' onClick={()=> changeLanguage('zh')}>普通话 中文</Button>
            </div>
            <section>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mx-1 my-2" controlId='email'>
                    <Form.Label>{t('createUser.emailFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('createUser.emailFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, email: event.target.value })
                        }
                        value={user.email}
                        required
                        aria-label={t('createUser.emailFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Form.Group className="mx-1 my-2" controlId='username'>
                    <Form.Label>{t('createUser.usernameFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('createUser.usernameFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, username: event.target.value })
                        }
                        value={user.username}
                        required
                        aria-label={t('createUser.usernameFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Form.Group className="mx-1 my-2" controlId='password'>
                    <Form.Label>{t('createUser.passwordFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder={t('createUser.passwordFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, password: event.target.value })
                        }
                        value={user.password}
                        required
                        aria-label={t('createUser.passwordFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Form.Group className="mx-1 my-2" controlId='firstName'>
                    <Form.Label>{t('createUser.firstNameFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('createUser.firstNameFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, name: {...user.name, firstname: event.target.value }})
                        }
                        value={user.name.firstname}
                        required
                        aria-label={t('createUser.firstNameFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Form.Group className="mx-1 my-2" controlId='lastName'>
                    <Form.Label>{t('createUser.lastNameFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('createUser.lastNameFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, name: {...user.name, lastname: event.target.value }})
                        }
                        value={user.name.lastname}
                        required
                        aria-label={t('createUser.lastNameFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Container className='border border-info rounded p-1 m-1'>
                    <h2 className='mt-2 font-weight-bold'>{t('createUser.addressHeader')}</h2>
                    <Form.Group className="mx-1 my-2" controlId='city'>
                        <Form.Label>{t('createUser.cityFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('createUser.cityFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, address:{ ...user.address, city: event.target.value }})
                            }
                            value={user.address.city}
                            required
                            aria-label={t('createUser.cityFormGroup.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='street'>
                        <Form.Label>{t('createUser.streetFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('createUser.streetFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, address:{...user.address, street: event.target.value }})
                            }
                            value={user.address.street}
                            required
                            aria-label={t('createUser.streetFormGroup.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='number'>
                        <Form.Label>{t('createUser.numberFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder={t('createUser.numberFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, address:{ ...user.address, number: parseInt(event.target.value, 10) }})
                            }
                            value={user.address.number}
                            required
                            aria-label={t('createUser.numberFormGroup.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='zipCode'>
                        <Form.Label>{t('createUser.zipCodeFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('createUser.zipCodeFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, address:{...user.address, zipcode: event.target.value }})
                            }
                            value={user.address.zipcode}
                            required
                            aria-label={t('createUser.zipCodeFormGroup.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='lat'>
                        <Form.Label>{t('createUser.latitudeFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('createUser.latitudeFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, address: {...user.address, geolocation:{ ...user.address.geolocation, lat: event.target.value }}})
                            }
                            value={user.address.geolocation.lat}
                            required
                            aria-label={t('createUser.latitudeFormGroup.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='long'>
                        <Form.Label>{t('createUser.longitudeFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('createUser.longitudeFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, address: {...user.address, geolocation:{ ...user.address.geolocation, long: event.target.value }}})
                            }
                            value={user.address.geolocation.long}
                            required
                            aria-label={t('createUser.longitudeFormGroup.recordLabel')}
                        />
                    </Form.Group>
                </Container>
                <Form.Group className="mx-1 my-2" controlId='phone'>
                    <Form.Label>{t('createUser.phoneNumberFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('createUser.phoneNumberFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, phone: event.target.value })
                        }
                        value={user.phone}
                        required
                        aria-label={t('createUser.phoneNumberFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Button 
                variant="success" 
                type="submit"
                aria-label={t('createUser.submitButton.recordLabel')}>
                    {t('createUser.submitButton.buttonText')}
                </Button>
            </Form>
            </section>
        </Container>
    )
}

export default CreateUser;