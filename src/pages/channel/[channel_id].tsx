import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from 'react-cookie';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import { channel } from "diagnostics_channel";

const schema = yup.object({
    content: yup.string().required(),
})

type FormData = {
   id: number,
   content: string
}

type Message = {
    sender: string;
    content: string;
    date: string;
    time: string;
};

function ChannelPage() {
    const router = useRouter();
    const [cookies] = useCookies(['token']);
    const [cookie] = useCookies(['id']);
    const token = cookie.id;
    const id = cookie.id;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({resolver: yupResolver(schema)});

    useEffect(() => {
        async function getChatChannel() {
            axios.get('http://localhost:8080/messages/channel/${id}', {headers: {Authorization: `Bearer ${token}`}})
            .then((response) => {
                setMessages(response.data.messages);
            })
            .catch((errors) => {
                console.error('Erreur lors de la récupération des messages dans le channel', errors);                
            });
        }
        getChatChannel();
    }, [])

    useEffect(() => {
        async function getChannelUser() {
            axios.get('http://localhost:8080/channel/${id}', {headers: {Authorization: `Bearer ${token}`}})
            .then((response) => {
                setMessages(response.data.messages);
            })
            .catch((errors) => {
                console.error('Erreur lors de la récupération des channels de l\'utilisateur', errors);                
            });
        }
        getChannelUser();
    }, [])

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
            <h4>
                { channel &&  (<p>{channel.name}</p>)}
            </h4>
            <ul>
                {messages && messages.length > 0 ? (
                    messages.map((message, index) => (
                        <li key={index}>
                            <strong>De: </strong> {message.sender}
                            <br />
                            <strong>Date: </strong> {message.date} - {message.time}
                            <br />
                            {message.content}
                        </li>
                    ))) : (<p></p>)
                }    
            </ul>
            <div>
                <form onSubmit={handleSubmit(handleSendMessage)}>
                <input {...register('content', {required: true})}
                    type="text" 
                />
                <button type="submit" className="sendMessageButton" >Envoyer</button>
                </form>
            </div>
        </div>
    );
};

export default ChannelPage;