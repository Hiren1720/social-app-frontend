import Ably from "ably";
const url = process.env.REACT_APP_API_URL;

export const STREAM_URL = `${url}/stream`;

export const ssEvents = new EventSource(STREAM_URL);
export const ably = new Ably.Realtime.Promise({key:"PbeIpA.eZ-G_A:pz_TrYgruXMbVoNloJZiCill0ek7pJpw3nV3zEnueJ4"});
export const channel = ably.channels.get("social-app");
