import { Avatar } from '@material-ui/core'
import styled from 'styled-components'
import getRecipientEmail from '../utils/getRecipienEmail'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollection} from 'react-firebase-hooks/firestore'
import {useRouter} from 'next/router'
import {auth, db} from '../firebase'

function Chat({id, users}) {
const [user] = useAuthState(auth)
const router = useRouter()

const enterChat = () => {
    router.push(`/chat/${id}`)
}


const recepientMail = getRecipientEmail(users, user)
const [recepientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(users, user)))
const recipient = recepientSnapshot?.docs?.[0]?.data()
    return (
        <Container onClick={enterChat}>
            {recipient ? <UserAvatar src={recipient?.photoURL} /> : <UserAvatar>{getRecipientEmail[0]}</UserAvatar> }
            {recepientMail}
        </Container>
    )
}

export default Chat



const Container = styled.div`
display: flex;
align-items: center;
cursor: pointer;
padding: 15px;
word-break: break-word;

:hover {
    background-color: #e9eaeb
}
`

const UserAvatar = styled(Avatar)`
margin: 5px;
margin-right: 15px;
`



