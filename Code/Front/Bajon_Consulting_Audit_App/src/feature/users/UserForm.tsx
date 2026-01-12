import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import '../auth/auth.css';
import { PhoneInput } from 'react-international-phone';
import type { EditionMode } from '../../types/editionMode';
import type { User } from "@supabase/supabase-js";
import 'react-international-phone/style.css';

import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../feature/auth/useAuth';

interface UserFormProps {
    mode: EditionMode;
    user?: User;    
}

function UserForm({ mode, user }: UserFormProps) {
    const { currentUser, currentRole } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // ----------------- PROTECTION D'ACCES -----------------
    useEffect(() => {
        if (!currentUser) return;

        // Création uniquement pour admins
        if (mode === 'creation' && currentRole !== "Administrateur") {
            navigate("/audits", { replace: true });
        }

        // Edition
        if (mode === 'edition') {
            if (currentRole === "Administrateur") return;
            if (id && currentUser.id !== id) {
                navigate("/audits", { replace: true });
            }
        }
    }, [currentUser, currentRole, id, navigate, mode]);

    // ----------------- ETAT FORMULAIRE -----------------
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [role, setRole] = useState<Role[]>([]);
    const [currentRoleState, setCurrentRoleState] = useState('');
    const [currentUserState, setCurrentUserState] = useState<User | undefined>(user); 
    const [APIResp, setAPIresp] = useState([]);

    interface Role {
        id: number;
        rolename: string;
    }

    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    const validPhone = new RegExp('^(\\+33|0)[1-9](\\d{2}){4}$');

    // ----------------- FETCH USER SI EDITION -----------------
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/api/users/${id}`)
            .then(res => setCurrentUserState(res.data))
            .catch(error => console.error("Error fetching user: ", error));
        }
    }, [id]);

    // ----------------- FETCH ROLES -----------------
    useEffect(() => {
        const fetchRole = async () => {
            const { data, error } = await supabase.from('role').select('*');
            if(error) console.error("Erreur de récupération", error);
            else setRole(data ?? []);
        };
        fetchRole();
    }, []);

    // ----------------- FETCH LIST USERS (APIResp) -----------------
    useEffect(() => {
        axios.get("http://localhost:8080/api/users/listUsers")
            .then(response => setAPIresp(response.data))
            .catch(error => console.error("Error fetching data: ", error));
    }, []);

    // ----------------- INIT FORM SI EDITION -----------------
    useEffect(() => {
        if (mode === 'edition' && currentUserState) {
            setEmail(currentUserState.email ?? '');
            setLastName(currentUserState.user_metadata.displayName?.split(' ')[0] ?? '');
            setFirstName(currentUserState.user_metadata.displayName?.split(' ')[1] ?? '');
            setPhone(currentUserState.user_metadata?.phone ?? '');
            setCurrentRoleState(currentUserState.user_metadata?.role ?? '');
        }
    }, [mode, currentUserState]);

    // ----------------- HANDLE SUBMIT -----------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validEmail.test(email)) {
            setMessage("Email invalide");
            return;
        }

        if (!currentRoleState || currentRoleState === "") {
            setMessage("Veuillez sélectionner un rôle");
            return;
        }

        if (mode === 'creation') {
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

        if (mode === 'creation') {
            const createUserPost = { email, password, lastName, firstName, phone, currentRole: currentRoleState };
            axios.post("http://localhost:8080/api/users/createUser", createUserPost)
                .then(response => console.log("User created", response.data))
                .catch(error => console.log("Error creating users", error));
        } else if (mode === 'edition' && currentUserState) {
            const updateUser = { id, email, lastName, firstName, phone, currentRole: currentRoleState };
            axios.post(`http://localhost:8080/api/users/updateUser/${id}`, updateUser)
                .then(response => console.log("User updated", response.data))
                .catch(error => console.log("Error updating user:", error));
        }

        setMessage("");
    }

    // ----------------- RENDER FORMULAIRE -----------------
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
                        <label htmlFor='firstName'>Prénom</label>
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
                        <label htmlFor='phone'>Numéro de téléphone</label>
                        <PhoneInput
                            defaultCountry='fr'
                            value={phone}
                            onChange={(phone) => setPhone(phone)}
                        />
                        <label htmlFor='role'>Rôle</label>
                        <select
                            name="role"
                            id="role"
                            value={currentRoleState}
                            onChange={(e) => setCurrentRoleState(e.target.value)}
                        >
                            <option value="">Sélectionner un rôle</option>
                            {role.map(r => (
                                <option key={r.id} value={r.rolename}>{r.rolename}</option>
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

                        <button type="submit">
                            {mode === 'edition' ? 'Sauvegarder les modifications' : 'Créer un compte'}
                        </button>
                    </form>
                    {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default UserForm;
