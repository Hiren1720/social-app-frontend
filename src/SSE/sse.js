import Ably from "ably";
const url = process.env.REACT_APP_API_URL;

export const STREAM_URL = `${url}/stream`;

export const ssEvents = new EventSource(STREAM_URL);
export const ably = new Ably.Realtime.Promise({
    authUrl: "https://ably.com/ably-auth/token/docs",
});
export const channel = ably.channels.get("social-app");
