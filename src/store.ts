import { createStore } from "redux";
import { HMApi } from "./comms/api";
import { DialogProps } from "./ui/dialogs";
import { NotificationProps } from "./ui/notifications";
import { uniqueId } from "./uniqueId";

export type StoreState = {
    token: string | null;
    notifications: NotificationProps[];
    dialogs: DialogProps[];
    rooms: HMApi.Room[] | false | null; // null means loading, false means error
};

export type StoreAction = {
    type: "SET_TOKEN",
    token: string | null
} | {
    type: "ADD_NOTIFICATION",
    notification: Omit<NotificationProps, "id">
} | {
    type: "REMOVE_NOTIFICATION",
    id: string
} | {
    type: "ADD_DIALOG",
    dialog: Omit<DialogProps, "id">
} | {
    type: "REMOVE_DIALOG",
    id: string
} | {
    type: "SET_ROOMS",
    rooms: HMApi.Room[] | false | null
};

export const store= createStore<StoreState, StoreAction, {}, {}>((state= {
    token: localStorage.getItem('home_modules_token') || null,
    notifications: [],
    dialogs: [],
    rooms: null
}, action)=> {
    switch(action.type) {
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.token
            };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    {
                        ...action.notification,
                        id: uniqueId()
                    }
                ]
            };
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(e=> e.id!==action.id)
            };
        case 'ADD_DIALOG':
            return {
                ...state,
                dialogs: [
                    ...state.dialogs,
                    {
                        ...action.dialog,
                        id: uniqueId()
                    }
                ]
            };
        case 'REMOVE_DIALOG':
            return {
                ...state,
                dialogs: state.dialogs.filter(e=> e.id!==action.id)
            };
        case 'SET_ROOMS':
            return {
                ...state,
                rooms: action.rooms
            };
        default:
            return state;
    }
}, (window as any).__REDUX_DEVTOOLS_EXTENSION__ ?.());