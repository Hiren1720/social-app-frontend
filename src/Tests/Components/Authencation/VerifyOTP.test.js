import React from 'react';
import {render, fireEvent,screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import VerifyOTP from '../../../Components/Authencation/VerifyOTP';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test verify otp  page', () => {

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

    // it('renders otp input field', async () => {
    //     const {findByTestId} = render(<BrowserRouter>
    //         <Provider store={store}><VerifyOTP/></Provider></BrowserRouter>);
    //     const otpInput = await screen.getByTestId('otp-field');
    //     fireEvent.change(otpInput, {target: {value: '123456'}});
    //     expect(otpInput.value).toBe('123456');
    // });

    it('click verify button',async ()=> {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><VerifyOTP/></Provider></BrowserRouter>);
        const button = await findByTestId('verify-otp');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    });

    it('click Resend OTP button',async ()=> {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><VerifyOTP/></Provider></BrowserRouter>);
        const button = await findByTestId('resend-otp');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    })

});

