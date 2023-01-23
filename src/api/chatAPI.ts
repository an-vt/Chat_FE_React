import { Room } from "../models";
import axiosClient from "./axiosClient";

const CHAT_ENDPOINT = "/api/v1/chat";
const chatApi = {
  getListRoom(userId: string): Promise<Room[] | undefined> {
    const url = `${CHAT_ENDPOINT}/message/${userId}`;
    return axiosClient.get(url);
  },
};

export default chatApi;
