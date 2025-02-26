import React from 'react';
import { render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import UserLogin from '../components/UserLogin';
import axios from 'axios';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

jest.mock('axios');
jest.mock('react-router-dom', () =>({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
        t: (key) => key,
        i18n: { 
            changeLanguage: jest.fn()
        },
    })
}))

describe('UserLogin Component unit tests', () => {
    let mockNavigate;

    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate = jest.fn()
        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    })
    test('changes language when button is clicked', () => {
        render(
            <BrowserRouter>
                <UserLogin />
            </BrowserRouter>
        );

        const englishButton = screen.getByText('English');
        const mandarinButton = screen.getByText('普通话 中文');

        fireEvent.click(englishButton);
        expect(require('react-i18next').useTranslation().i18n.changeLanguage).toHaveBeenCalledWith('en');

        fireEvent.click(mandarinButton);
        expect(require('react-i18next').useTranslation().i18n.changeLanguage).toHaveBeenCalledWith('zh');
    });

    test('navigates to product-catalog page if user is authenticated', async () => {
        const mockResponse = { data: { token: 'fakeToken' } };

        axios.post.mockResolvedValue(mockResponse);

        render(
            <BrowserRouter>
                <UserLogin />
            </BrowserRouter>
        );

        const usernameInput = screen.getByLabelText('userLogin.usernameFormGroup.label');
        const passwordInput = screen.getByLabelText('userLogin.passwordFormGroup.label');
        const submitButton = screen.getByRole('button', { name: 'userLogin.loginButton.recordLabel' });

        fireEvent.change(usernameInput, { target: { value: 'fakeUsername1' } });
        fireEvent.change(passwordInput, { target: { value: 'fakePassword456' } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/product-catalog');
        });
    });
});
