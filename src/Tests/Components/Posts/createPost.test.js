import React from 'react';
import {render, fireEvent,screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider, useSelector} from 'react-redux';
import CreatePost from '../../../Components/Posts/CreatePost';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test Login page', () => {

    const store = mockStore({
        userData: {
            users: [
                { userName: 'user1' },
                { userName: 'user2' },
                { userName: 'user3' },
                // Add more users as needed
            ]
        },
        postData:{
            loading:false,
            postResult:null
        }
    });

    it('renders title field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><CreatePost/></Provider></BrowserRouter>);
        const otpInput = await findByTestId('title');
        fireEvent.change(otpInput, {target: {value: 'title'}});
        expect(otpInput.value).toBe('title');
    });

    it('renders content field', async () => {
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><CreatePost/></Provider></BrowserRouter>);
        const otpInput = await findByTestId('content');
        fireEvent.change(otpInput, {target: {value: 'content'}});
        expect(otpInput.value).toBe('content');
    });

    it('renders file input  field', async () => {
        const imageFile = new File(['file content'], 'test.jpg', { type: 'image/jpeg' });
        const videoFile = new File(['file content'], 'test.mp4', { type: 'video/mp4' });
        const {findByTestId,findByText} = render(<BrowserRouter>
            <Provider store={store}><CreatePost/></Provider></BrowserRouter>);
        const fileInput = await findByTestId('fileInput');
        fireEvent.change(fileInput,   { target: { files: [imageFile, videoFile]}});

        // const file1 = 'test.jpg';
        // const file2 = 'test.mp4';
        //
        // // Before clicking the button, files should not be displayed
        // expect(await screen.queryByText(file1)).toBeNull();
        // expect(await screen.queryByText(file2)).toBeNull();
        //
        // fireEvent.click(fileInput);
        //
        // // After clicking the button, files should be displayed
        // expect(await screen.queryByText(file1)).toBeInTheDocument();
        // expect(await screen.queryByText(file2)).toBeInTheDocument();
        expect(fileInput.files[0].name).toBe('test.jpg');
        expect(fileInput.files[1].name).toBe('test.mp4');
        // const file1 = 'http://res.cloudinary.com/socialposts/image/upload/v1692268083/Screenshot_2023-06-20_182322_1_ztac2z.png';
        // const file2 = 'https://res.cloudinary.com/socialposts/video/upload/v1692268070/bear_in_the_river_720p_h2638v.mp4';
        //
        // // Verify that the selected files are displayed in the UI
        // await findByText(file1);
        // await findByText(file2);
    });

    it('renders drag and drop  field', async () => {
        const imageFile = new File(['file content'], 'test1.jpg', { type: 'image/jpeg' });
        const videoFile = new File(['file content'], 'test1.mp4', { type: 'video/mp4' });
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><CreatePost/></Provider></BrowserRouter>);
        const fileInput = await findByTestId('dragAnDrop');
        fireEvent.drop(fileInput,   { dataTransfer: { files: [imageFile, videoFile]}});
        // expect(fileInput.files[0].name).toBe('test1.jpg');
        // expect(fileInput.files[1].name).toBe('test1.mp4');
        // fireEvent.drop(dropArea, { dataTransfer: { files: [mockImageFile, mockVideoFile] } });

        // Wait for changes to take effect (this might be necessary)
        await findByTestId('gallery');

        const dragOverEvent = new Event('dragover', { bubbles: true, cancelable: true });
        fireEvent(fileInput, dragOverEvent);

        // Check if default behavior is prevented
        expect(dragOverEvent.defaultPrevented).toBe(true);
    });

    it('renders mention input  field', async () => {
        const mockHandleMentions = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><CreatePost/></Provider></BrowserRouter>);
        const mentionInput = await findByTestId('mention-input');
        fireEvent.change(mentionInput, { target: { value: "@[display](@user1) [@display](@user2) " } });
        expect(mentionInput).toBeInTheDocument();

    });



    // it('set file  button',async ()=> {
    //   const addButton = screen.getByText('Add Files');
    //   const file1 = 'file1.jpg';
    //   const file2 = 'file2.mp4';
    //
    //   // Before clicking the button, files should not be displayed
    //   expect(screen.queryByText(file1)).toBeNull();
    //   expect(screen.queryByText(file2)).toBeNull();
    //
    //   fireEvent.click(addButton);
    //
    //   // After clicking the button, files should be displayed
    //   expect(screen.getByText(file1)).toBeInTheDocument();
    //   expect(screen.getByText(file2)).toBeInTheDocument();
    // })

    it('click create button',async ()=> {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><CreatePost/></Provider></BrowserRouter>);
        const button = await findByTestId('create');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    });

    it('click cancel button',async ()=> {
        const mockHandleOnSubmit = jest.fn();
        const {findByTestId} = render(<BrowserRouter>
            <Provider store={store}><CreatePost/></Provider></BrowserRouter>);
        const button = await findByTestId('cancel');
        fireEvent.click(button);
        expect(mockHandleOnSubmit).toHaveBeenCalledTimes(0);
    })


});

