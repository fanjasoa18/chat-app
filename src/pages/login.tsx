import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import *  as yup from "yup";
import axios from "axios";
import styles  from '@styles/login.module.css';
import { Link } from "react-router-dom";

const schema = yup.object({
    email: yup.string().email().max(100).required(),
    password: yup.string().required(),
}).required();
type FormData = yup.InferType<typeof schema>;

function Login() {
    const router = useRouter();
    const [cookies, setCookies] = useCookies(['token']);
    
    const { register, handleSubmit, formState: { } } = useForm<FormData>({resolver: yupResolver(schema)});

    const login = async (data: FormData) => {
        console.log(data);
        axios.post('http://localhost:8080/users/login', data)
        .then((response) => {
            const token = response.data.user.token;
            setCookies("token", token, { path: '/'})
            router.push('/chat');
        })
        .catch((error) => {
            console.error('Identifiant invalid', error);
        })
    }

    return(
        <>
        <div className={styles.content}>
            <h2>Login</h2>
            <p>Bonjour, veuillez entrer vos détails</p>
            <form onSubmit={handleSubmit(login)}  name='loginForm' className={styles.form}>
                <input {...register("email")}
                    type="email" 
                    name="email"
                    placeholder="Votre email" 
                />
                <input {...register("password")}
                    type="password" 
                    name="password"
                    placeholder="Votre mot de passe" 
                />
                <button type="submit" className="loginButton">Se connecter</button>
            </form>
            <p className={styles.color}>
                Pas de compte? Veuillez 
                <Link to="/sign-up">s'inscrire</Link>
            </p>
            <footer className={styles.foot}>
                <p className={styles.foot}>☻chat-app</p>
            </footer>
        </div>
        </>
    );
};
export default Login;