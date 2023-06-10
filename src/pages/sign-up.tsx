import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import *  as yup from "yup";
import useUser from '../components/zustandStore/userStore';
import { useRouter } from "next/router";
import styles from '@styles/signup.module.css';
import axios from "axios";

const schema = yup.object({
    name: yup.string().max(200).required(),
    email: yup.string().email().max(100).required(),
    password: yup.string().min(8).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Le mot de passe doit correspondre').required(),
}).required();
type FormData = yup.InferType<typeof schema>;

function SignUp () {
    const router = useRouter();
    const { setName, setEmail, setPassword } = useUser();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({resolver: yupResolver(schema)});
    
    const signUp = async (data: FormData) => {
        axios.post('http://localhost:8080/users', data)
        .then((response) => {
            setName(response.data.name);
            setEmail(response.data.email);
            setPassword(response.data.password);
            router.push('/login')
        })
        .catch((error) => {
            console.error('Il y a une erreur lors de l\'inscritpion', error);
        })
    }

    return(
        <>
        <div className={styles.content}>
        <h2>Signup</h2>
        <p>Bonjour, veuillez entrer vos détails</p>
        <form onSubmit={handleSubmit(signUp)} name='registrationForm' className={styles.form}>
            <input {...register("name", {required: true})}
                type="text" 
                name="name"
                placeholder="Votre nom" 
            />
            <p>{errors.name?.message}</p>

            <input {...register("email", {required: true})}
                type="email" 
                name="email"
                placeholder="Votre email" 
            />
            <p>{errors.email?.message}</p>

            <input {...register("password", {required: true})}
                type="password" 
                name="password"
                placeholder="Votre mot de passe" 
            />
            <p>{errors.password?.message}</p>

            <input {...register("confirmPassword", {required: true})}
                type="password" 
                name="confirmPassword"
                placeholder="Ecrire un nouveau mot de passe" 
            />
            <p>{errors.confirmPassword?.message}</p>

            <button type="submit" className="registerButton">S'inscrire</button>
        </form>
        <footer className={styles.foot}>
            <p className={styles.foot}>☻chat-app</p>
        </footer>
        </div>
        </>
    );
};
export default SignUp;