import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import VerifyOTP from '../../../Components/Authencation/VerifyOTP';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test Login page', () => {

    const store = mockStore({
        userData: {
            loginData: {
                email: 'testuser@example.com',
                password: 'password123',
                otp: '123456'
            },
            loading: false,
            verifyOTPResult: null,
            userResult: null,
        }
    });

    it('renders otp input field', () => {
        const {getByPlaceholderText} = render(<BrowserRouter>
            <Provider store={store}><VerifyOTP/></Provider></BrowserRouter>);
        const otpInput = getByPlaceholderText('Enter OTP');
        fireEvent.change(otpInput, {target: {value: '123456'}});
        expect(otpInput.value).toBe('123456');
    });

    it('click verify button',()=> {
        const mockHandleOnSubmit = jest.fn();
        const {getByText} = render(<BrowserRouter>
            <Provider store={store}><VerifyOTP/></Provider></BrowserRouter>);
        const button = getByText('Verify');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    });

    it('click Resend OTP button',()=> {
        const mockHandleOnSubmit = jest.fn();
        const {getByText} = render(<BrowserRouter>
            <Provider store={store}><VerifyOTP/></Provider></BrowserRouter>);
        const button = getByText('Resend OTP');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    })

});

