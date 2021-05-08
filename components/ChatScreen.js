import React, {useState, useRef} from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import { AttachFile, InsertEmoticon, MoreVert } from '@material-ui/icons'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import {useCollection} from 'react-firebase-hooks/firestore'
import Message from './Message'
import firebase from 'firebase'
import getRecipientEmail from '../utils/getRecipienEmail'
import TimeAgo from 'timeago-react'

function ChatScreen({chat, messages}) {
    console.log(chat, messages )
    const [user] = useAuthState(auth)
    const router = useRouter()
    const [input, setInput] = useState('')
    const endChatScroll = useRef(null)
    const [messagesSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'))

    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(chat.users, user)
    ))


    const showMessages = () => {    
     
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => {
                <Message 
                key={message.id}
                user={message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime()
                }}
                />
            })
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} 
                message={message}/>
            ))
        }
    }

    const scrollToBottom = () => {
        endChatScroll.current.scrollIntoView(
            {
                behaviour: 'smooth',
                block: 'start'
            }
        )
    }

const sendMessage = (e) => {
e.preventDefault()
db.collection('users').doc(user.id).set({
    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),

}, {merge : true})

db.collection('chats').doc(router.query.id).collection('messages').add({
timestamp: firebase.firestore.FieldValue.serverTimestamp(),
message: input,
user: user.email,
photoUrl: user.photoURL

})
setInput('')
scrollToBottom()

}

const recipient = recipientSnapshot?.docs?.[0]?.data()
const recepientEmail = getRecipientEmail(chat.users, user)
    return (
        <Container>
         <Header>
            {recipient ? 
            <Avatar src={recipient?.photoURL}/> :
            <Avatar>{recepientEmail?.[0]}</Avatar>
            }

            <HeaderInformation>
                <h3>{recepientEmail}</h3>
                {recipientSnapshot ? (<p>Last seen: {' '}{recipient?.lastSeen?.toDate() ? (
                    <TimeAgo />
                ): 'Unavailable'}</p>) : (<p>Loading Last Active...</p>)}
            </HeaderInformation>
            <HeaderIcon>
                <IconButton>
                    <MoreVert />
                </IconButton>
                <IconButton>
                    <AttachFile />
                </IconButton>
            </HeaderIcon>
         </Header>
        <MessageContainer>
            {showMessages()}
            
        <EndMessenger ref={endChatScroll}/>
        </MessageContainer>
        <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)}/>
        <button  disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
        </InputContainer>

        </Container>
    )
}

export default ChatScreen

const Container = styled.div`` 

const Header = styled.div`
position: sticky;
background-color: white;
z-index: 100;
display: flex;
padding: 11px;
height: 80px;
align-items: center;
border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
margin-left: 15px;
flex: 1;

> h3 {
   margin-bottom: 3px; 
}

> p {
    font-size: 14px;
    color: 'gray'
}
`

const HeaderIcon = styled.div`
`

const MessageContainer = styled.div`
padding: 30px;
background-color: #e5ded8;
min-height: 90vh;
`

const EndMessenger = styled.div`
margin-bottom: 50px

`

const InputContainer = styled.form`
display: flex;
align-items: center;
padding: 10px;
position: sticky;
bottom: 0;
background-color: white; 
z-index: 100

`

const Input = styled.input`
flex: 1;
outline: 0;
border: none;
border-radius: 10px;
background-color: whitesmoke;
padding: 20px;
margin-left: 16px;
margin-right: 15px


`

