import styled from 'styled-components'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '../firebase'
import moment from 'moment'

function Message({user, message}) {
    const [userLoggedIn] = useAuthState(auth)
    const TypeOfMessage =  user === userLoggedIn.email ? Sender : Receiver
    return (
        <Container>
            <TypeOfMessage>{message.message}
            <TimeSpan>
            {message.timestamp ? moment(message.timestamp).format('LT'): '...'}
            </TimeSpan>
            </TypeOfMessage>
        </Container>
    )
}

export default Message

const Container = styled.div`
`

const MessageElement = styled.p`
width: fit-content;
padding: 15px;
border-radius: 3px;
margin: 10px;
min-width: 60px;
padding-bottom: 26px;
position: absolute;
text-align: right;
`


const TimeSpan = styled.span`
color: 'gray';
padding: 10px;
font-size: 8px;
position: absolute;
bottom: 0;
text-align: right;
right: 0%;
`

const Sender = styled(MessageElement)`
margin-left: auto;
background-color: #dcf8c6;
`
const Receiver = styled(MessageElement) `
background-color: whitesmoke;
text-align: left
`
