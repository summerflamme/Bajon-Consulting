import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../feature/auth/auth.css';

function UserForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    const validPhone = new RegExp('^(\\+33|0)[1-9](\\d{2}){4}$');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

    if (!validEmail.test(email)) {
            setMessage("Email invalide");
            return;
        }
        if (password.length < 6) {
            setMessage("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas");
            return;
        }

        if (!validPhone.test(phone)) {
            setMessage("Numéro de téléphone invalide");
            return;
        }
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    displayName: displayName,
                    phone: phone
                }
            }
        });


        console.log(data);
        if (error) {
            console.error("Erreur lors de la création du compte:", error.message);
            setMessage("Erreur lors de la création du compte: " + error.message);
        } else {
            console.log("Compte créé avec succès:", data);
            setMessage("");
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setDisplayName('');
            setPhone('');
        }   
    }


    

    return (
    <div className="background-zone">
    <div className="user-form">
        <h2>Créer un compte</h2>
        <div className="login-box">
        <form onSubmit={handleSubmit}>
            <label htmlFor="displayName">Nom Prénom</label>
            <input
                placeholder='Christophe Bajon'
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
                placeholder='BajonConsulting@gmail.com'
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="phoneNumber">Numéro de téléphone</label>
            <input
                placeholder='0606060606'
                type="text"
                id="phoneNumber"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
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
            <button type="submit">Créer un compte</button>
        </form>
        {message && 
        <p style={{ color: "red", marginTop: "10px" }} >{message}</p>}
    </div>
    </div>
    </div>
);
}
export default UserForm;