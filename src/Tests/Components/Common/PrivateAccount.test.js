import React from 'react';
import {render, fireEvent,screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import PrivateAccount  from '../../../Components/Common/PrivateAccount';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test private account  page', () => {

    // const store = mockStore({
    //   userData: {
    //     loginData: {
    //       email: 'testuser@example.com',
    //       password: 'password123',
    //       otp: ''
    //     },
    //     loading: true,
    //     userResult: null,
    //   }
    // });

    it('renders private account  field', async  () => {
        render(<PrivateAccount />);

        // Check if the elements are present in the rendered component
        // const titleElement = await getByClassName('account-private');
        // const linkElement = await screen.findByTestId("account-private");
        //     expect(linkElement).toBeInTheDocument();
        // const followTextElement = getAllByClassName('Follow this account to see their photos and videos.');

        // expect(titleElement).toBeInTheDocument();
        // expect(followTextElement).toBeInTheDocument();
    });


});

