import React, { useState, useEffect } from 'react'
import { Container, ListGroup, Button } from 'react-bootstrap'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserList = () => {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) =>{
        i18n.changeLanguage(lng);
     }

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://fakestoreapi.com/users');
            console.log(response)
            setUsers(response.data);
            return response.data   
        }
        catch (error) {
            console.error(error)
        }}

    const deleteUserAPI = async (id) => {
        try {
            const response = await axios.delete(`https://fakestoreapi.com/users/${id}`);
            console.log(response)
            fetchUsers();
        }
        catch (error) {
            console.error(error)
        }}
    const handleDeleteUser = (id) => {
        deleteUserAPI(id);
    }

    const handleEditButton = (id) => {
        navigate(`/update-user/${id}`);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

  return (
    <Container>
        <header>
        <h1>{t('userListheader')}</h1>
        </header>
        <div>
            <Button variant='warning' onClick={()=> changeLanguage('en')}>English</Button>
            <Button variant='warning' onClick={()=> changeLanguage('zh')}>普通话 中文</Button>
        </div>
        <section>
        <ListGroup>
            {users.map((user) => (
                <ListGroup.Item 
                variant='info' 
                key={user.id}
                aria-labelledby={t('userList.listGroupUser.recordLabel', { userUsername: user.username })}
                role='listitem'
                >
                    <p>{t('userList.listGroupUser.name', {userNameFirstname: user.name.firstname, userNameLastname: user.name.lastname})}<br />
                    {t('userList.listGroupUser.username', { userUsername: user.username})}<br />
                    {t('userList.listGroupUser.password', { userPassword: user.password })}<br />
                    {t('userList.listGroupUser.email', { userEmail: user.email })}<br />
                    {t('userList.listGroupUser.phone', { userPhone: user.phone })}<br /></p>
                    <Button 
                    variant='danger' 
                    className='shadow-sm m-1 p-1' 
                    onClick={() => handleDeleteUser(user.id)}
                    aria-label={t('userList.deleteButton.recordLabel', { userUsername:user.username })}
                    >{t('userList.deleteButton.buttonText')}</Button>
                    <Button 
                    variant='warning' 
                    className='shadow-sm m-1 p-1' 
                    onClick={() => handleEditButton(user.id)}
                    aria-label={t('userList.editButton.recordLabel', { userUsername: user.username })}
                    >{t('userList.editButton.buttonText')}</Button>
                </ListGroup.Item>
            ))}
        </ListGroup>
        </section>
    </Container>
  )
}

export default UserList;