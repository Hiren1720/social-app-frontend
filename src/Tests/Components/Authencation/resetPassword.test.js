import React from 'react';
import {render, fireEvent,screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import ResetPassword from '../../../Components/Authencation/ResetPassword';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test reset password page', () => {

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

    it('renders new password input  field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><ResetPassword/></Provider></BrowserRouter>);
        const otpInput = await findByTestId('new-password');
        fireEvent.change(otpInput, {target: {value: '123456'}});
        expect(otpInput.value).toBe('123456');
    });

    it('renders confirm password input field',async ()=> {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><ResetPassword/></Provider></BrowserRouter>);
        const cPassword = await findByTestId('confirm-password');
        fireEvent.change(cPassword, {target: {value: '123456'}});
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    });

    it('click submit button',async ()=> {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><ResetPassword/></Provider></BrowserRouter>);
        const button = await findByTestId('submit');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    });

    it('click cancel button',async ()=> {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><ResetPassword/></Provider></BrowserRouter>);
        const button = await findByTestId('cancel');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    })

});

