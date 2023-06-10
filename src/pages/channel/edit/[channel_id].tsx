import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import *  as yup from "yup";
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import axios from "axios";

const schema = yup.object({
    members: yup.array().of(yup.number()).required()
});
type FormData = yup.InferType<typeof schema>;

type ChannelEditForm = {
    id: number;
};
type Value = {
    value: number,
    label: string
}

function EditChannelPage() {
    const router = useRouter();
    const [channelId, setChannelId] = useState<any> ();
    const [valueOption, setValueOption] = useState<Value[]>([]);
    const [cookies] = useCookies(['token']);
    const [cookie] = useCookies(['id']);
    const id = cookie.id;
    const token = cookies.token;

    const { handleSubmit, setValue } = useForm<FormData>({resolver: yupResolver(schema)});

    useEffect(() => {
        async function getChannelId() {
            axios.get('http://localhost:8080/channel/${id}', {headers: {Authorization: `Bearer ${token}`}})
            .then((response) => {
                setChannelId(response.data.channel);
            })
            .catch((errors) => {
                console.error('erreur lors la récupération du channel', errors);
            })
        }
        getChannelId()
    }, [id]);

    useEffect(() => {
        async function getAllUsers() {
            axios.get('http://localhost:8080/users', {headers: {Authorization: `Bearer ${token}`}})
            .then((response) => {
                const value = response.data.users.map((i: any) => ({
                    value: i.id,
                    label: i.name
                }));

                setValueOption(value);
            })
            .catch((errors) => {
                console.error('erreur lors la récupération des utilisateurs', errors);
            })
        }
        getAllUsers()
    }, [id]);

    const create = async (data : FormData) => {
        axios.post('http://localhost:8080/channel/${id}/members', data, {headers: {Authorization: `Bearer ${token}`}})
        .then((response) => {
            console.log(response);
            router.push("/channel")
        })
        .catch((errors) => {
            console.error('erreur lors de la creation du channel', errors);
        })
    }

    return (
        <div>
            <h2>Modifier un channel</h2>
            <form onSubmit={handleSubmit(create)}>
                {channelId && (<input type="text" value={channelId.name}/>)}
                <Select
                    onChange={(e: any) => {
                        let ids = e.map((option: any) => option.value)
                        setValue('members', ids)
                    }}
                    closeMenuOnSelect= {true}
                    options={valueOption}
                />
                <button type="submit" className="editChannelButton" onClick={() => <Link to='/channel/${id}'></Link>}>Editer</button>
            </form>
        </div>
    )
};

export default EditChannelPage;