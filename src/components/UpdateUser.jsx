import React, { useEffect, useState } from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'


const UpdateUser = () => {
    const { id } = useParams()
    const [user, setUser] = useState({
        id: id,
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
    })
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) =>{
        i18n.changeLanguage(lng);
     }

    const fetchSingleUser = async () => {
        try {
            const response = await axios.get(`https://fakestoreapi.com/users/${id}`)
            if (response && response.data) {
                return response.data
            }
            console.warn('No data found for User Id')
            return null
        } catch (err) {
            console.error(err)
            return null;
        }
    }

    const loadUser = async () => {
        const data = await fetchSingleUser();
        if (!data || data.length === 0) {
            return
        }

        // data = data[0]

        if (data) {
            setUser({
                id: id,
                email: data.email,
                username: data.username,
                password: data.password,
                name: {
                    firstname: data.name.firstname,
                    lastname: data.name.lastname
                },
                address: {
                    city: data.address.city,
                street: data.address.street,
                number: 0,
                zipcode: data.address.zipcode,
                geolocation: {
                    lat: data.address.geolocation.lat,
                    long: data.address.geolocation.long,
                }
            },   
            phone: ','
            });
        } else {
            console.warn('No data found for user');
        }
    };
    useEffect(() => {
        loadUser()
    }, [id])

    const editUserAPI = async (updatedUser) => {
        try {
            const response = await axios.put(
                `https://fakestoreapi.com/users/${updatedUser.id}`,
                {
                    email: updatedUser.email,
                    username: updatedUser.username,
                    password: updatedUser.password,
                    name: {
                        firstname: updatedUser.firstname,
                        lastname: updatedUser.lastname
                    },
                    address: {
                        city: updatedUser.city,
                        street: updatedUser.street,
                        number: updatedUser.number,
                        zipcode: updatedUser.zipcode,
                        geolocation: {
                            lat: updatedUser.lat,
                            long: updatedUser.long
                        }
                    },
                    phone: updatedUser.phone
                },
            );
            alert('User Updated Successfully')
        } catch (err) {
            console.error('Error updating user: ', err);
            alert('Failed to update user')

        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        editUserAPI(user);
    }

    return (
        <Container>
            <header>
            <h1>{t('updateUser.header')}</h1>
            </header>
            <div>
                <Button variant='warning' onClick={()=> changeLanguage('en')}>English</Button>
                <Button variant='warning' onClick={()=> changeLanguage('zh')}>普通话 中文</Button>
            </div>
            <section>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mx-1 my-2" controlId='email'>
                    <Form.Label>{t('updateUser.emailFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('updateUser.emailFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, email: event.target.value })
                        }
                        value={user.email}
                        required
                        aria-label={t('updateUser.emailFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Form.Group className="mx-1 my-2" controlId='username'>
                    <Form.Label>{t('updateUser.usernameFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('updateUser.usernameFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, username: event.target.value })
                        }
                        value={user.username}
                        required
                        aria-label={t('updateUser.usernameFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Form.Group className="mx-1 my-2" controlId='password'>
                    <Form.Label>{t('updateUser.passwordFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder={t('updateUser.passwordFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, password: event.target.value })
                        }
                        value={user.password}
                        required
                        aria-label={t('updateUser.passwordFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Form.Group className="mx-1 my-2" controlId='firstName'>
                    <Form.Label>{t('updateUser.firstNameFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('updateUser.firstNameFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, firstname: event.target.value })
                        }
                        value={user.name.firstname}
                        required
                        aria-label={t('updateUser.firstNameFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Form.Group className="mx-1 my-2" controlId='lastName'>
                    <Form.Label>{t('updateUser.lastNameFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('updateUser.lastNameFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, lastname: event.target.value })
                        }
                        value={user.name.lastname}
                        required
                        aria-label={t('updateUser.lastNameFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Container className='border border-info rounded p-1 m-1'>
                    <h2 className='mt-2 font-weight-bold'>{t('updateUser.addressHeader')}</h2>
                    <Form.Group className="mx-1 my-2" controlId='city'>
                        <Form.Label>{t('updateUser.cityFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('updateUser.cityFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, city: event.target.value })
                            }
                            value={user.address.city}
                            required
                            aria-label={t('updateUser.cityFormGroup.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='street'>
                        <Form.Label>{t('updateUser.streetFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('updateUser.streetFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, street: event.target.value })
                            }
                            value={user.address.street}
                            required
                            aria-label={t('updateUser.streetFormGroup.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='number'>
                        <Form.Label>{t('updateUser.numberFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder={t('updateUser.numberFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, number: event.target.value })
                            }
                            value={user.address.number}
                            required
                            aria-label={t('updateUser.numberFormGroup.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='zipCode'>
                        <Form.Label>{t('updateUser.zipCodeFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('updateUser.zipCodeFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, zipcode: event.target.value })
                            }
                            value={user.address.zipcode}
                            required
                            aria-label={t('updateUser.zipCode.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='lat'>
                        <Form.Label>{t('updateUser.latitudeFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('updateUser.latitudeFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, lat: event.target.value })
                            }
                            value={user.address.geolocation.lat}
                            required
                            aria-label={t('updateUser.latitudeFormGroup.recordLabel')}
                        />
                    </Form.Group>
                    <Form.Group className="mx-1 my-2" controlId='long'>
                        <Form.Label>{t('updateUser.longitudeFormGroup.label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('updateUser.longitudeFormGroup.placeholder')}
                            onChange={event =>
                                setUser({ ...user, long: event.target.value })
                            }
                            value={user.address.geolocation.long}
                            required
                            aria-label={t('updateUser.longitudeFormGroup.recordLabel')}
                        />
                    </Form.Group>
                </Container>
                <Form.Group className="mx-1 my-2" controlId='phone'>
                    <Form.Label>{t('updateUser.phoneNumberFormGroup.label')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('updateUser.phoneNumberFormGroup.placeholder')}
                        onChange={event =>
                            setUser({ ...user, phone: event.target.value })
                        }
                        value={user.phone}
                        required
                        aria-label={t('updateUser.phoneNumberFormGroup.recordLabel')}
                    />
                </Form.Group>
                <Button 
                variant="success" 
                type="submit"
                aria-label={t('updateUser.submitButton.recordLabel')}>
                    {t('updateUser.submitButton.buttonText')}
                </Button>
            </Form>
            </section>
        </Container>
    )
}

export default UpdateUser;