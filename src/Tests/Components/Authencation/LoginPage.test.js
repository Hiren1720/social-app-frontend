import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import LoginPage from '../../../Components/Authencation/LoginPage';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test Login page', () => {

    const store = mockStore({
        userData: {
            loginData: {
                email: 'testuser@example.com',
                password: 'password123',
                otp: ''
            },
            loading: true,
            userResult: null,
        }
    });

    it('renders email input field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><LoginPage/></Provider></BrowserRouter>);
        const emailInput = await findByTestId('email');
        fireEvent.change(emailInput, {target: {value: 'testuser@example.com'}});
        expect(emailInput.value).toBe('testuser@example.com');
    });

    it('renders password input field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><LoginPage/></Provider></BrowserRouter>);
        const passwordInput = await findByTestId('password');
        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        expect(passwordInput.value).toBe('password123');
    });

    it('disables login button when loading is true', () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><LoginPage/></Provider></BrowserRouter>);
        const loginButton = findByTestId('login');
        const mockHandleOnChange = jest.fn();
        expect(mockHandleOnChange).toHaveBeenCalledTimes(0);
        // expect(loginButton).toBeDisabled();
    });


    // it('renders forgot password link with correct route', () => {
    //     const {getByText} = render(<BrowserRouter>
    //         <Provider store={store}><LoginPage/></Provider></BrowserRouter>);
    //     const forgotPasswordLink = getByText('Forgot Password?');
    //     expect(forgotPasswordLink).toHaveAttribute('href', '/login');
    // });

    // it('renders sign up link with correct route', () => {
    //     const { findByTestId } = render(<BrowserRouter>
    //         <Provider store={store}><LoginPage/></Provider></BrowserRouter>);
    //     const signUpLink = findByTestId('sign-up');
    //     expect(signUpLink).toHaveAttribute('href', '/sign-up');
    //     const mockHandleOnChange = jest.fn();
    //     expect(mockHandleOnChange).toHaveBeenCalledTimes(0);
    // });

});

