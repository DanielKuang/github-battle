import React from 'react'
import {battle} from '../utils/api'
import {FaCompass, FaBriefcase, FaUsers, FaUserFriends, FaCode, FaUser} from 'react-icons/fa'
import Card from './card'
import Proptypes from 'prop-types'
import Loading from './loading'
import Tooltip from './tooltip'
import queryString from 'query-string'
import {Link} from 'react-router-dom'

function ProfileList ({profile}){
    return(
    <ul className='card-list'>
        <li>
            <FaUser color='rgb(239,115,115)' size={22}/>
            {profile.name}
        </li>
        {profile.location && (
            <Tooltip text='Location'>
                <li>
                    <FaCompass color='rgb(144,115,255)' size={22}/>
                    {profile.location}
                </li>
            </Tooltip>
            )     
        }
        {profile.company && (
            <Tooltip text='Company'>
                <li>
                    <FaCompass color='#795548' size={22}/>
                    {profile.company}
                </li>
            </Tooltip>)
        }
        <li>
            <FaUsers color='rgb(129,195,245)' size={22}/>
            {profile.followers.toLocaleString()} followers
        </li>
        <li>
            <FaUserFriends color='rgb(64,195,183)' size={22}/>
            {profile.following.toLocaleString()} following
        </li>
    </ul>    

    )
}

ProfileList.propTypes = {
    profile: Proptypes.object.isRequired
}

export default class Results extends React.Component {
    state = {
        winner:null,
        loser:null,
        error:null,
        loading:true        
    }

    componentDidMount(){
        const {playerOne, playerTwo} = queryString.parse(this.props.location.search)

        battle([playerOne, playerTwo]).then((results)=>{
            this.setState({
                winner: results[0],
                loser: results[1],
                error: null,
                loading: false
            })
        }).catch(({message})=>{
            this.setState({
                error: message,
                loading: false
            })
        })
    }
    render(){

        const {winner, loser, error, loading} = this.state

        if (loading === true){
            return <Loading text='Battling' />
        }

        if (error){
            return(
                <p className='center-text error'>{error}</p>
            )
        }
        return (
            <React.Fragment>
                <div className='grid container-sm space-around'>
                    <Card 
                        header={winner.score === loser.score ? 'Tie': 'Winner'}
                        subheader={`Score: ${winner.score.toLocaleString()}`}
                        avatar={winner.profile.avatar_url}
                        href={winner.profile.html_url}
                        name={winner.profile.login}>
                        
                        <ProfileList profile={winner.profile}/>
                    </Card>

                    <Card 
                        header={winner.score === loser.score ? 'Tie': 'Loser'}
                        subheader={`Score: ${loser.score.toLocaleString()}`}
                        avatar={loser.profile.avatar_url}
                        href={loser.profile.html_url}
                        name={loser.profile.login}>

                        <ProfileList profile={loser.profile}/>    
                    </Card>
                </div>
                <Link className='dark-btn btn btn-space' to='/battle'>
                RESET
                </Link>
            </React.Fragment>
        )
    }
}