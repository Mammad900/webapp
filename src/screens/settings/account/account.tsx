import './account.scss';
import React from 'react';
import { connect } from 'react-redux';
import { handleError, logoutFromHub, sendRequest } from '../../../hub/request';
import { store, StoreState } from '../../../store';
import { IntermittentButton } from '../../../ui/button';
import { Link, Outlet } from 'react-router-dom';
import ScrollView from '../../../ui/scrollbar';

function SettingsPageAccount({token}: Pick<StoreState, 'token'>) {
    const [sessionsCount, setSessionsCount] = React.useState(-1); // Special values: -1 = loading, -2 = error

    React.useEffect(()=>{
        sendRequest({
            'type': 'account.getSessionsCount'
        }).then(res=> {
            if(res.type==='ok') {
                setSessionsCount(res.data.sessions);
            } else {
                setSessionsCount(-2);
                handleError(res);
            }
        }).catch(err=> {
            setSessionsCount(-2);
            handleError(err);
        });
    }, []);

    return (
        <ScrollView tagName='main' id="settings-account-info">
            <h1>
                Logged in to Home_modules hub as: <strong>@{token?.split(':')[0]}</strong>
                <IntermittentButton onClick={()=>logoutFromHub()} onCatch={handleError} attention>
                    Log out
                </IntermittentButton>
            </h1>

            <h2>Account settings</h2>

            <p>
                <Link to="/settings/account/active-sessions" className='button'>
                    Active sessions {sessionsCount > 0 ? <>({sessionsCount})</> : ''}
                </Link>
            </p>

            <Link to="/settings/account/change-password" className='button'>Change password</Link> 
            <> </>
            <Link to="/settings/account/change-username" className='button'>Change username</Link> 

            <Outlet />
        </ScrollView>
    )
}

export default connect<Pick<StoreState, 'token'>, {}, {}, StoreState>(({token})=>({token}))(SettingsPageAccount);