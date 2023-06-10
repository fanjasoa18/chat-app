import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

const schema = yup.object({
    content: yup.string().required()
}).required();
type FormData = {
    id: number;
    content: string;
    
};

type Message = {
    id: number;
    sender: string;
    content: string;
    date: string;
    time: string;
}

function DirectMessagePage() {
    const [cookies] = useCookies(['token']);
    const [cookie] = useCookies(['userId'])
    const token = cookies.token;
    const id = cookie.userId;
    const [messages, setMessages] = useState<Message[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema)
      });

    useEffect(() => {
        async function getMessageUser() {
            axios.get('http://localhost:8080/messages/${id}',{headers: {Authorization: `Bearer ${token}`}} )
            .then((response) => {
                setMessages(response.data.messages);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des messages de l\' utilisateur', error);
            });
        }
        getMessageUser();
    }, []);

    const handleSendMessage = async (data: FormData) => {
        data.id = id
        axios.post('http://localhost:8080/message', data, {headers: {Authorization: `Bearer ${token}`}})
        .then((response) => {
            console.log(response.data.message); 
        })
        .catch((error) => {
            console.error('Erreur lors de l\'envoi de message', error);
        });
    }

    return (
        <div>
            {messages && messages.length > 0 ? (
                <>
                <h1>Messages</h1>
                <ul>
                    {messages.map((message) => (
                        <li key={message.id}>
                            <strong>De: </strong> {message.sender}
                            <br />
                            <strong>Date: </strong> {message.date} - {message.time}
                            <br />
                            {message.content}
                        </li>
                    ))}
                </ul>
                </> 
            ) : (<p></p>)
            }
            <form onSubmit={handleSubmit(handleSendMessage)}>
                <input {...register('content', {required: true})}
                    type="text" 
                />
                <button className="sendMessageButton" type= "submit">Envoyer</button>
            </form>
        </div>
    );
};

export default DirectMessagePage;