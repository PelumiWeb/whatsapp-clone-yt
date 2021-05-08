import styled from "styled-components"
import {Avatar, IconButton, Button} from '@material-ui/core'
import { Chat, MoreVert, Search } from "@material-ui/icons"
import * as EmailValidator from 'email-validator'
import { auth, db } from "../firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
import {useCollection} from 'react-firebase-hooks/firestore'
import Chats from './Chat'


function Sidebar() {
    const [user] = useAuthState(auth)
    const userData = db.collection('chats').where('users', 'array-contains', user.email)
    const [chatsSnapshot] = useCollection(userData) 


    const logOut = () => {
        auth.signOut()
    }
    const createChat = () => {
        const input = prompt('please enter an email address for the user you wish to vhat with.');
        if (!input) {
            return null
        }

        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            // This function should be called
            db.collection('chats').add({
                users: [user.email, input]

            })
        }
    }

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find(chat => chat.data().users.find((user) => user === recipientEmail)?.length > 0 );
    

    return (
        <Container>
            <Header>
                   <UserAvatar src={user.photoURL} onClick={logOut} />
                   <IconContainer>
                       <IconButton>
                       <Chat />
                       </IconButton>
                       <IconButton>
                       <MoreVert />
                       </IconButton>
                   </IconContainer>
           </Header>
           <SearchContainer>
            <Search />
            <SearchInput placeholder="This is the input"/>
           </SearchContainer> 
           <SidebarButton onClick={createChat}>
               Start a new chat
           </SidebarButton>
           {chatsSnapshot?.docs.map(chat => 
            <Chats key={chat.id} id={chat.id} users={chat.data().users}/>
            )}
        </Container>
    )
}

export default Sidebar


const Container = styled.div`
flex: .3;
`
const SearchContainer = styled.div`
display: flex;
align-items: center;
padding: 20px;
border-radius: 2px;
`
const SearchInput = styled.input`
outline: 0;
border: none;
flex: 1;


`
const IconContainer = styled.div``

const UserAvatar = styled(Avatar)`
cursor: pointer;
:hover {
    opacity: .8
} 

` 
const SidebarButton = styled(Button)`
width: 100%;
&&& {
    border-top: 1px solid whitesmoke;
border-bottom: 1px solid whitesmoke;
}`

const Header = styled.div`
display: flex;
position: sticky;
width: 100%;
top: 0;
background-color: white;
z-index: 1;
justify-content: space-between;
align-items: center;
padding: 15px;
height: 80px;
border-bottom: 1px solid whitesmoke;
`

 

