import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import {useCookies} from 'react-cookie';
import axios from "axios";
import styles from '@styles/chat.module.css'
import { Link } from "react-router-dom";

interface User {
    id: number,
    name: string,
    email: string,
    bio: string
}

interface Message {
    id: number,
    sender: User,
    content: string,
    timestamp: string
}

interface Channel {
    id: number,
    name: string,
    type: string
}

function ChatPage() {
    const router = useRouter();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [cookies] = useCookies(['token']);
    const token = cookies.token;
    const [cookie, setCookie] = useCookies(['id']);
    const [tokens, setTokens] = useCookies(['userId']);

    useEffect(() => {
        async function getAllUsers() {
            axios.get('http://localhost:8080/users', {headers: {Authorization: `Bearer ${token}`}})
            .then((response) => {
                setUsers(response.data.users);
            })
            .catch((errors) => {
                console.error('erreur lors la récupération des utilisateurs', errors);
            })
        }
        getAllUsers()
    }, [users]);

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async() => {
        axios.get('http://localhost:8080/channels', {headers: {Authorization: `Bearer ${token}`}})
        .then((response) => {
            setChannels(response.data.channels);
        })
        .catch ((errors) => {
            console.error('erreur', errors);
        })
    };

    const click = (id: number) => {
        setCookie('id', id, {path: '/'})
        router.push('/channel/edit/${id}')
    }

    const clickNameChannel = (id: number) => {
        setCookie('id', id, {path: '/'})
        router.push('/channel/${id}')
    }

    const clickUsername = (userId: number) => {
        setTokens('userId', userId, {path: '/'})
        router.push('/message')
    }

    return(
        <div className={styles.container}>
            <div className={styles.leftSide}>
                <div className={styles.header}>
                    <div className={styles.userimg}>
                        <img src="../../components/pic/avatar.jpg" alt="" className={styles.cover}/>
                    </div>
                </div>
                <div>
                    <button onClick={() => <Link to='/login'></Link>}></button>
                </div>
                <div>
                    <button onClick={() => <Link to="/channel/create"></Link>}>Ajouter un channel</button>
                </div>
                <h2>Channels</h2>
                <ul>
                    {channels.map((channel) => (
                        <li key={channel.id}>
                            <p onClick={() => clickNameChannel(channel.id)}>{channel.name}</p> 
                            <button onClick={() => click(channel.id)} >mettre à jour</button>
                        </li>
                    ))}
                </ul>
                <div>
                <h2>Users</h2>
                <div>
                    {users.map((user) => (
                        <div key={user.id}>
                            <p onClick={() => clickUsername(user.id)} >{user.name}</p>
                        </div>
                    ))}
                </div>
                </div>
            </div>
            <div className={styles.rightSide}>

            </div>
        </div>
    );
}

export default ChatPage;