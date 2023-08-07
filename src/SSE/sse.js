const url = process.env.REACT_APP_API_URL;

export const STREAM_URL = `${url}/stream`;

export const ssEvents = new EventSource(STREAM_URL);
