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

    it('renders name input field', () => {
        const {getByPlaceholderText} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const nameInput = getByPlaceholderText('Name');
        fireEvent.change(nameInput, {target: {value: 'testuser'}});
        expect(nameInput.value).toBe('testuser');
    });

    it('renders user name input field', () => {
        const {getByPlaceholderText} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const userNameInput = getByPlaceholderText('User Name');
        fireEvent.change(userNameInput, {target: {value: 'testuser'}});
        expect(userNameInput.value).toBe('testuser');
    });

    it('renders email input field', () => {
        const {getByPlaceholderText} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const emailInput = getByPlaceholderText('Email');
        fireEvent.change(emailInput, {target: {value: 'testuser@example.com'}});
        expect(emailInput.value).toBe('testuser@example.com');
    });

    it('renders password input field', () => {
        const {getByPlaceholderText} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const passwordInput = getByPlaceholderText('Password');
        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        expect(passwordInput.value).toBe('password123');
    });

    it('renders phone input field', () => {
        const {getByPlaceholderText} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const phoneInput = getByPlaceholderText('Contact');
        fireEvent.change(phoneInput, {target: {value: '1234567890'}});
        expect(phoneInput.value).toBe('1234567890');
    });

    it('renders state dropdown', () => {
        const {getByPlaceholderText} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const stateSelect = getByPlaceholderText('Select State');
        fireEvent.change(stateSelect, {target: {value: 'Gujarat'}});
        expect(stateSelect.value).toBe('Gujarat');
    });

    it('renders Birth Date input field', () => {
        const {getByPlaceholderText} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const dateInput = getByPlaceholderText('Birth Date');
        fireEvent.change(dateInput, {target: {value: '2023-04-19T22:01'}});
        expect(dateInput.value).toBe('2023-04-19T22:01');
    });

    it('renders Gender Radio input field', () => {
        const {getByPlaceholderText} = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        const maleInput = getByPlaceholderText('Male');
        fireEvent.change(maleInput, {target: {value: 'Male'}});
        expect(maleInput.value).toBe('Male');
        const femaleInput = getByPlaceholderText('Female');
        fireEvent.change(femaleInput, {target: {value: 'Female'}});
        expect(femaleInput.value).toBe('Female');
    });

    it('render checkboxes', () => {
        const { getByPlaceholderText } = render(<BrowserRouter>
            <Provider store={store}><Registration/></Provider></BrowserRouter>);
        // Check and uncheck the checkboxes
        fireEvent.change(getByPlaceholderText('Programming'),{target: {value: 'Programming'}});
        expect(getByPlaceholderText('Programming').value).toBe('Programming');

        fireEvent.change(getByPlaceholderText('Reading'),{target: {value: 'Reading'}});
        expect(getByPlaceholderText('Reading').value).toBe('Reading');

        fireEvent.change(getByPlaceholderText('Gaming'),{target: {value: 'Gaming'}});
        expect(getByPlaceholderText('Gaming').value).toBe('Gaming');

        fireEvent.change(getByPlaceholderText('Riding'),{target: {value: 'Riding'}});
        expect(getByPlaceholderText('Riding').value).toBe('Riding');
    });

});

