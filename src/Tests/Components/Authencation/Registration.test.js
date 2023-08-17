import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import Registration from '../../../Components/Authencation/Registration';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test Registration Page page', () => {

    const store = mockStore({
        userData: {
            user: {
                "name": "testuser",
                "password": "password123",
                "userName": "testuser",
                "birthDate": '2023-04-19T22:01',
                "email": "testuser@example.com",
                "contact": "1234567890",
                "gender": "Male" || 'Female',
                "hobby": ['Reading','Riding','Programing','Gaming'],
                "state": "Gujarat",
                status: false,
            },
            loading: true,
            userResult: null,
        }
    });

    it('renders name input field',async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const nameInput = await findByTestId('name');
        fireEvent.change(nameInput, {target: {value: 'testuser'}});
        expect(nameInput.value).toBe('testuser');
        const mockHandleOnChange = jest.fn();
        expect(mockHandleOnChange).toHaveBeenCalledTimes(0);
    });

    it('renders user name input field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const userNameInput = await findByTestId('user-name');
        fireEvent.change(userNameInput, {target: {value: 'testuser'}});
        const mockHandleOnChange = jest.fn();
        expect(userNameInput.value).toBe('testuser');
        expect(mockHandleOnChange).toHaveBeenCalledTimes(0);
    });
    //
    it('renders email input field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const emailInput = await findByTestId('email');
        fireEvent.change(emailInput, {target: {value: 'testuser@example.com'}});
        const mockHandleOnChange = jest.fn();
        expect(emailInput.value).toBe('testuser@example.com');
        expect(mockHandleOnChange).toHaveBeenCalledTimes(0);
    });
    //
    it('renders password input field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const passwordInput = await findByTestId('password');
        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        expect(passwordInput.value).toBe('password123');
        const mockHandleOnChange = jest.fn();
        expect(mockHandleOnChange).toHaveBeenCalledTimes(0);
    });
    //
    it('renders phone input field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const phoneInput = await findByTestId('contact');
        fireEvent.change(phoneInput, {target: {value: '1234567890'}});
        const mockHandleOnChange = jest.fn();
        expect(phoneInput.value).toBe('1234567890');
        expect(mockHandleOnChange).toHaveBeenCalledTimes(0);
    });
    //
    it('renders state dropdown', async () => {
        const mockHandleOnChange = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const stateSelect = await findByTestId('select-state');
        fireEvent.change(stateSelect, {target: {value: 'Gujarat'}});
        expect(stateSelect.value).toBe('Gujarat');
        expect(mockHandleOnChange).toHaveBeenCalledTimes(0);
    });
    //
    it('renders Birth Date input field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const dateInput = await findByTestId('birth-date');
        fireEvent.change(dateInput, {target: {value: '2023-04-19T22:01'}});
        expect(dateInput.value).toBe('2023-04-19T22:01');
    });
    //
    it('renders Gender Radio input field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const maleInput = await findByTestId('gender-male');
        fireEvent.change(maleInput, {target: {value: 'Male'}});
        expect(maleInput.value).toBe('Male');
        const femaleInput = await findByTestId('gender-female');
        fireEvent.change(femaleInput, {target: {value: 'Female'}});
        expect(femaleInput.value).toBe('Female');
    });

    it('render checkboxes', async () => {
        const { getByLabelText } = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        // Check and uncheck the checkboxes
        fireEvent.change(await getByLabelText('Programming'),{target: {value: 'Programming',}});
        expect(await getByLabelText('Programming').value).toBe('Programming');

        fireEvent.change(await getByLabelText('Reading'),{target: {value: 'Reading'}});
        expect(await getByLabelText('Reading').value).toBe('Reading');

        fireEvent.change(await getByLabelText('Gaming'),{target: {value: 'Gaming'}});
        expect(await getByLabelText('Gaming').value).toBe('Gaming');

        fireEvent.change(await getByLabelText('Riding'),{target: {value: 'Riding'}});
        expect(await getByLabelText('Riding').value).toBe('Riding');
    });



});

