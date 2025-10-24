import React, { useEffect, useState } from 'react';

import { supabase } from '../../supabaseClient';
import '../auth/auth.css';
import { PhoneInput } from 'react-international-phone';
import type { EditionMode } from '../../types/editionMode';
import type { User } from "@supabase/supabase-js"
import 'react-international-phone/style.css';

import axios from "axios";
import { useParams } from 'react-router-dom';

interface UserFormProps {
    mode : EditionMode
    user? : User    
}

function UserForm( {mode, user} : UserFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [role, setRole] = useState<Role[]>([]);
    const [currentRole, setCurrentRole] = useState('');
    const [currentUser, setCurrentUser] = useState<User | undefined>(user); 
    const [APIResp, setAPIresp] = useState([]);
    const { id } = useParams<{ id: string }>();
    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    const validPhone = new RegExp('^(\\+33|0)[1-9](\\d{2}){4}$');

    interface Role {
        id: number;
        rolename: string;
    }


    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/api/users/${id}`)
            .then(responce => {
                setCurrentUser(responce.data);
            })
            .catch(error => {
            console.error("Error feching user: ", error)
        })
    }
}, [id]);

    useEffect(() => {
        const fetchRole = async () => {
            const { data, error } = await supabase
            .from('role')
            .select('*')
            if(error){
                console.error("Erreur de récupération", error)
            }else{
                setRole(data ?? []);
            }
        };
        fetchRole()
    }, [])


    useEffect (() => {
        axios
        .get("http://localhost:8080/api/users/listUsers")
        .then(response => {
            setAPIresp(response.data);
        })
        .catch(error => {
            console.error("Error fetching data: ", error)
        });
    },);

    useEffect(() => {
        if (mode === 'edition' && currentUser) {
            setEmail(currentUser.email ?? '');
            setLastName(currentUser.user_metadata.displayName?.split(' ')[0] ?? '');
            setFirstName(currentUser.user_metadata.displayName?.split(' ')[1] ?? '');
            setPhone(currentUser.user_metadata?.phone ?? '');
            setCurrentRole(currentUser.user_metadata?.role ?? '');
        }
    }, [mode, currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        
        if (!validEmail.test(email)) {
            setMessage("Email invalide");
            return;
        }

        if (!currentRole || currentRole === "") {
            setMessage("Veuillez sélectionner un rôle");
            return;
        }

        if (mode === 'creation' ){
            if (password.length < 6) {
            setMessage("Le mot de passe doit contenir au moins 6 caractères");
            return;
            }
        
        
            if (password !== confirmPassword) {
                setMessage("Les mots de passe ne correspondent pas");
                return;
            }
        }

        if (!validPhone.test(phone)) {
            setMessage("Numéro de téléphone invalide"); 
            return;
        }

        if( mode === 'creation'){
            const createUserPost = {email, password, lastName, firstName, phone, currentRole}
            axios
            .post("http://localhost:8080/api/users/createUser", createUserPost)
            .then(response => {
            console.log("User creat", response.data);
            })
            .catch( error => {
            console.log("Error creating users", error)
            })
            } else {
                setMessage("");
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFirstName('');
                setLastName('');
                setPhone('');
        }   

        if(mode === 'edition' && currentUser){
            const updateUser = {id,email,lastName, firstName, phone, currentRole}
            axios
            .post(`http://localhost:8080/api/users/updateUser/${id}`, updateUser)
            .then(response => {
                console.log("User update :  ", response.data)
        })
            .catch(error => {
                console.log("error update user :", error.data)
            })
        }
        else{
            setMessage("");
            setEmail(email);
            setLastName(lastName);
            setFirstName(firstName);
            setPhone(phone)
            setCurrentRole(currentRole);
        }
    }
    return (
    <div className="background-zone">
    <div className="user-form">
        <div className="login-box">
            <h2>{mode === 'edition' ? 'Modifier un compte' : 'Créer un compte'}</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="lastName">Nom</label>
            <input
                placeholder='Bajon'
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor='firstName'> Prénom </label>
            <input
                placeholder='Christophe'
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
                placeholder='BajonConsulting@gmail.com'
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor='phone'> Numéro de téléphone</label>
                <PhoneInput
                    defaultCountry='fr'
                    value={phone}
                    onChange={(phone) => setPhone(phone)}></PhoneInput>
            <label htmlFor='role'> Rôle</label>
            <select name="role" id="role" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}>
                <option value="" > Sélectionner un rôle</option>
                {role.map(role => (
                    <option key={role.id} value={role.rolename}>{role.rolename}</option>
                ))}
            </select>
            {mode === 'creation' && (
                <>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        placeholder='************'
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                        placeholder='************'
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </>
            )}
            <button type="submit">{mode === 'edition' ? 'Sauvegarder les modifications' : 'Créer un compte'}</button>
        </form>
        {message && 
        <p style={{ color: "red", marginTop: "10px" }} >{message}</p>}
    </div>
    </div>
    </div>
);
}
export default UserForm;