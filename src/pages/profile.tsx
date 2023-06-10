import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import *  as yup from "yup";
import axios from "axios";

const schema = yup.object({
    name: yup.string().required(),
    currentPassword: yup.string().required(),
    newPassword: yup.string().required(),
    confirmPassword: yup.string().required(),
    bio: yup.string().required(),
}).required();
type FormData = yup.InferType<typeof schema>;

const ProfilePage = () => {
  const [ cookies ] = useCookies(['token']);
  const token = cookies.token;
  const [data, setData] = useState<any>(undefined);
  const [showInput, setShowInput]= useState(false);
  const { register, handleSubmit } = useForm<FormData>({resolver: yupResolver(schema)});

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    axios.get('http://localhost:8080/user', {headers: {Authorization: `Bearer ${token}`}})
    .then((response) => {
      console.log(response.data.user);
      setData(response.data.user);  
    })
    .catch((errors) => {
      console.error('erreur', errors);
    })
  }

  const updateProfile = async (data: FormData) => {
    axios.put('http://localhost:8080/user',data, {headers: {Authorization: `Bearer ${token}`}})
    .then((response) => {
        console.log(response.data.user);
        setShowInput(false);
    })
    .catch((error) => {
      console.error('erreur', error)
    })
}
  const addUpdate = () => {
    setShowInput(true);
  }

  return (
    <div>
      {showInput ? (
        data && (    
          <form onSubmit={handleSubmit(updateProfile)}>
            <h1>Modifier le profil de l'utilisateur</h1>
            <label>
              Nom :
              <input {...register("name")}
                type="text"
                name="name"
                placeholder='votre nouveau nom'
              />
            </label>
            <label>
              Ancien mot de passe :
              <input {...register("currentPassword")}
                type="password"
                name="currentPassword"
                placeholder='votre ancien mot de passe'
              />
            </label>
            <label>
              Nouveau mot de passe :
              <input {...register("newPassword")}
                type="password"
                name="newPassword"
                placeholder='votre nouveau mot de passe'
              />
            </label>
            <label>
              Confirmer le nouveau mot de passe :
              <input {...register("confirmPassword")}
                type="password"
                name="confirmPassword"
                placeholder='confirmer votre mot de passe'
              />
            </label>
            <label>
              Biographie :
              <textarea {...register("bio")}
                name="bio"
                placeholder='entrer votre biographie'
              />
            </label>
            <button type="submit">Soumettre</button>
          </form>
        )
      ) : (
        data && (
          <div>
            <h2>{data.name}</h2>
            <h4>{data.email}</h4>
            <h4>{data.bio}</h4>
            <button onClick={addUpdate}>modifier le profil</button>
          </div>
        )
      )}
      
    </div>
  );
};

export default ProfilePage;
