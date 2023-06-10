import React, { useEffect, useState } from "react";
import router, { useRouter } from "next/router";
import Select from 'react-select'
import { useCookies} from 'react-cookie';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import *  as yup from "yup";
import axios from "axios";

const schema = yup.object({
    channelName: yup.string().max(50).required(),
    type: yup.mixed().oneOf(['public', 'private']).required(),
    members: yup.array().of(yup.number()).required()
}).required();
type FormData = yup.InferType<typeof schema>;

type User = {
    name: string,
    email: string,
    bio: string
}

type Value = {
    value: number,
    label: string
}

const CreateChannelPage = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>();
    const [valueOption, setValueOption] = useState<Value[]>([]);
    const [cookies] = useCookies(['token']);
    const token = cookies.token;

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({resolver: yupResolver(schema)});

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
    }, [users]);

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
            <h2>Créer un channel</h2>
            <form onSubmit={handleSubmit(create)}>
                <input {...register("channelName")}
                    type="text" 
                    id="channelName" 
                    placeholder="Nom de votre channel"
                />
                <br />
                <select {...register('type')} name="type" >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <br />
                <Select 
                    onChange= {(e: any) => {
                        let ids = e.map((option: any) => option.value)
                        setValue('members', ids)
                    }}
                    closeMenuOnSelect= {true}
                    options= {valueOption}
                />
                <button type="submit" className="createChannelButton">Créer le channel</button>
            </form>
        </div>
    );
};

export default CreateChannelPage;