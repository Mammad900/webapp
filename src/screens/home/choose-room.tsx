import { faPen, faRotate, faStar, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { HMApi } from "../../hub/api";
import { store } from "../../store";
import ScrollView from "../../ui/scrollbar";
import { roomIcons } from "../settings/rooms/rooms";
import { ContextMenuItem } from "../../ui/context-menu";
import './choose-room.scss';
import { handleError, sendRequest } from "../../hub/request";
import { refreshRoomStates } from "./home";

export type HomePageChooseRoomProps = {
    roomStates: HMApi.T.RoomState[] | undefined | false,
    currentRoomId: string,
    onRoomSelected: (roomId: string) => void
}

export default function HomePageChooseRoom({ roomStates, currentRoomId, onRoomSelected }: HomePageChooseRoomProps) {
    function navigated(e: React.MouseEvent<HTMLAnchorElement>) {
        e.currentTarget.scrollIntoView({
            inline: 'center',
            block: 'center',
            behavior: 'smooth'
        });
    }

    return (
        <ScrollView
            className={`choose-room ${roomStates === undefined ? 'loading' : ''} ${roomStates === false ? 'error' : ''}`}
            tagName="nav"
            onContextMenu={e => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_CONTEXT_MENU',
                    contextMenu: {
                        x: e.clientX,
                        y: e.clientY,
                        children: [
                            <ContextMenuItem key={0}
                                icon={faPen}
                                href="/settings/rooms"
                            >
                                Edit rooms
                            </ContextMenuItem>
                        ]
                    }
                })
            }}
        >
            {roomStates instanceof Array ? <>
                <NavLink 
                    to="/home" 
                    className={({isActive}) => `${isActive ? 'active' : ''} favorites`}
                    end
                    onClick={navigated}
                >
                    <FontAwesomeIcon icon={faStar} />
                    <span>
                        Favorites
                    </span>
                </NavLink>
                {roomStates.map(roomState => (
                    <NavLink 
                        key={roomState.id} 
                        to={`/home/${roomState.id}`} 
                        className={({isActive}) => `${isActive ? 'active' : ''} ${roomState.disabled?'disabled':''}`}
                        onClick={navigated}
                        onContextMenu={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            store.dispatch({
                                type: 'SET_CONTEXT_MENU',
                                contextMenu: {
                                    x: e.clientX,
                                    y: e.clientY,
                                    children: [
                                        (roomState.disabled ? (
                                            <ContextMenuItem key={0}
                                                icon={faRotate}
                                                onClick={async () => {
                                                    await sendRequest({
                                                        type: 'rooms.restartRoom',
                                                        id: roomState.id
                                                    }).catch(handleError);
                                                    await refreshRoomStates();
                                                }}
                                            >
                                                Restart room
                                            </ContextMenuItem>
                                        ) : null),
                                        <ContextMenuItem key={1}
                                            icon={faPen}
                                            href={`/settings/rooms/${roomState.id}/edit`}
                                        >
                                            Edit
                                        </ContextMenuItem>
                                    ]
                                }
                            })
                        }}
                    >
                        <FontAwesomeIcon icon={roomIcons[roomState.icon]} />
                        <span>
                            {roomState.name}
                        </span>
                    </NavLink>
                ))}
            </> : (
                roomStates === undefined ? <>
                    <div className="circle" />
                    Loading rooms...
                </> : <>
                    <FontAwesomeIcon icon={faTimesCircle} />
                    There was an error loading the rooms
                </>
            ) }
        </ScrollView>
    );
}