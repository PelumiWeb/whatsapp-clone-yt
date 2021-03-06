import styled from 'styled-components'
import Head from 'next/head'
import Sidebar from '../../components/Sidebar.js'
import ChatScreen from '../../components/ChatScreen.js'
import {db, auth} from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '../../utils/getRecipienEmail.js'

function Chat({messages, chat}) {
    const [user] = useAuthState(auth)

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatScreenContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatScreenContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id)
        //Prep the message on the server
    const messageRes = await ref.collection('messages').get()

    const messages = messageRes?.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    //Prep the chats
     const chatRes = await ref.get()
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

return {
    props: {
        messages: JSON.stringify(messages),
        chat: chat
    }
}

}

const Container = styled.div`
display: flex;
`

const ChatScreenContainer = styled.div`
flex: 1;
overflow: scroll;
height: 100vh;
::-webkit-scrollbar {
display: none
}

--ms-overflow-style: none;
scrollbar-width: none
`
