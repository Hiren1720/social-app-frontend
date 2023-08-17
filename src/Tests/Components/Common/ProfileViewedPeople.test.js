import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import ProfileViewedPeople  from '../../../Components/Common/ProfileViewedPeople';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test profile viewed people page', () => {

    const store = mockStore({
        userData: {
            profileViewers: [{
                author_info:[{profile_url:"https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",name:'user'}]
            },{
                author_info:[{profile_url:"https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",name:'user2'}]
            },]
        },
        requestData:{requests:{data:[{fromUserId:"1", toUserId:"2"},{fromUserId:"2", toUserId:"1"}]}}
    });

    const NullProfileViewer = mockStore({
        userData: {
            profileViewers: null
        },
        requestData:{requests:{data:[{fromUserId:"1", toUserId:"2"},{fromUserId:"2", toUserId:"1"}]}}
    });


    it('user viewed profile',  async () => {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><ProfileViewedPeople/></Provider></BrowserRouter>);
        const requestButton = await findByTestId('profile0');
        fireEvent.click(requestButton);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    });

    it('renders user request profile',  async () => {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><ProfileViewedPeople/></Provider></BrowserRouter>);
        const requestButton = await findByTestId('requests0');
        fireEvent.click(requestButton);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    });
    it('no viewed profile',  async () => {
        render(<BrowserRouter>
            <Provider store={NullProfileViewer}><ProfileViewedPeople/></Provider></BrowserRouter>);
    });

});

