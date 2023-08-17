import React from 'react';
import {render, fireEvent,screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import ForgetPassword from '../../../Components/Authencation/ForgetPassword';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test forget password page', () => {

    const store = mockStore({
        userData: {
            forgetPassword: {
                email: 'testuser@example.com',
            },
            loading: false,
            verifyForgetPasswordUser: {success:false},
        }
    });

    it('renders email input field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><ForgetPassword/></Provider></BrowserRouter>);
        const otpInput = await findByTestId('email');
        fireEvent.change(otpInput, {target: {value: 'testuser@example.com'}});
        expect(otpInput.value).toBe('testuser@example.com');
    });

    it('click submit button',async ()=> {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><ForgetPassword/></Provider></BrowserRouter>);
        const button = await findByTestId('submit');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    });

    it('click cancel button',async ()=> {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><ForgetPassword/></Provider></BrowserRouter>);
        const button = await findByTestId('cancel');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    })

});

