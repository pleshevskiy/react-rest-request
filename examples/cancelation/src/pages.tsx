import React from 'react';
import { useRequest } from 'react-rest-request';
import { Link } from 'react-router-dom';
import { DelayEndpoint } from './endpoint';


export function MainPage() {
    return <Link to='/delay'>Move to delay page</Link>
}

export function DelayPage() {
    const { data, loading, cancel, isCanceled } = useRequest(
        DelayEndpoint,
        {
            params: {
                seconds: 10,
            }
        }
    );

    return (
        <div>
            <div>
                <Link to='/'>Back to main page</Link>
            </div>
            {!data ? (
                <div>{ loading ? 'Loading...' : isCanceled ? 'Request was canceled' : 'Something went wrong' }</div>
            ) : <div>Success</div>}

            <button type='button' onClick={() => cancel() }>
               Cancel immediately!
            </button>
        </div>
    )
}
