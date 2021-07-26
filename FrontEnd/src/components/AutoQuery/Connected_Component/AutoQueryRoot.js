import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

import TableQuery from './TableQuery'
import Results from './Results'
import RobotView from './RobotView'
import RobotHistoric from './RobotHistoric'
import task from '../../../services/task'

/**
 * Root Panel of AutoQuery module
 * Using Hooks
 */
const AutoQueryRoot = () => {

    const QUERRY = 'Query'
    const RESULT = 'Result'
    const MY_ROBOT = 'MyRobot'
    const HISTORIC = 'Historic'

    const [currentMainTab, setCurrentMainTab] = useState('Query');
    const [lastTaskId, setLastTaskId] = useState(null);
    const username = useSelector(state => state.OrthancTools.username)

    useEffect(() => {
        task.getTaskOfUser(username, 'retrieve').then(id => {
            setLastTaskId(id[0])
        }).catch(() => {
        })
    }, [])

    function getComponentToDisplay() {
        let component = null
        switch (currentMainTab) {
            case QUERRY:
                component = <TableQuery switchTab={switchTab}/>
                break
            case RESULT:
                component = <Results switchTab={switchTab} setTaskId={setLastTaskId}/>
                break
            case MY_ROBOT:
                component = <RobotView id={lastTaskId} onDelete={() => {
                    switchTab(QUERRY)
                    setLastTaskId(null);
                }}/>
                break
            case HISTORIC:
                component = <RobotHistoric username={username}/>
                break
            default:
                break
        }

        return component
    }

    function switchTab(tabName) {
        setCurrentMainTab(tabName)
    }

    return (
        <div>
            <div className='mb-5'>
                <ul className='nav nav-pills nav-fill'>
                    <li className='nav-item'>
                        <button
                            className={currentMainTab === QUERRY ? 'col link-button nav-link active' : ' col link-button nav-link'}
                            onClick={() => setCurrentMainTab(QUERRY)}>Query List
                        </button>
                    </li>
                    <li className='nav-item'>
                        <button
                            className={currentMainTab === RESULT ? 'col link-button nav-link active' : 'col link-button nav-link'}
                            onClick={() => setCurrentMainTab(RESULT)}>Results
                        </button>
                    </li>
                    <li className='nav-item'>
                        <button
                            className={currentMainTab === MY_ROBOT ? 'col link-button nav-link active' : 'col link-button nav-link' + (!lastTaskId ? " disabled" : "")}
                            onClick={() => {
                                if (lastTaskId) setCurrentMainTab(MY_ROBOT)
                            }}>My Retrieve Robot
                        </button>
                    </li>
                    <li className='nav-item'>
                        <button
                            className={currentMainTab === HISTORIC ? 'col link-button nav-link active' : 'col link-button nav-link'}
                            onClick={() => setCurrentMainTab(HISTORIC)}>History
                        </button>
                    </li>
                </ul>
            </div>
            <div>
                {getComponentToDisplay()}
            </div>
        </div>
    )
}

export default AutoQueryRoot