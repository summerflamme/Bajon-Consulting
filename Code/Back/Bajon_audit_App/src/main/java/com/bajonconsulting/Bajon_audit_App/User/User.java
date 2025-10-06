package com.bajonconsulting.Bajon_audit_App.User;

import java.rmi.server.UID;
import java.security.Timestamp;
import java.sql.Time;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Users")
public class User {
    
    @Id
    private UID uid;
    private String displayName;
    private String email;
    private String phone; 
    private Timestamp createdAt; 
    private Timestamp lastSignInAt;

    User(){}

    User(UID uid, String dispalyName, String email, String phone, Timestamp createdAt, Timestamp LastSignInAt){
        this.uid = uid;
        this.displayName = dispalyName;
        this.email = email;
        this.phone = phone; 
        this.createdAt = createdAt;
        this.lastSignInAt = LastSignInAt;
    }
    //getter 

    public UID getUID(){
        return this.uid;
    } 
    
    public String getDisplayName(){
        return this.displayName;
    }

    public String getEmail(){
        return this.email;
    }

    public String getPhone(){
        return this.phone;
    }

    public Timestamp getCreatedAt(){
        return this.createdAt;
    }

    public Timestamp getLastSignInAt(){
        return this.lastSignInAt;
    }

    //Setter 

    public void setUID(UID uid){
        this.uid = uid;
    }

    public void setDisplayName(String displayName){
        this.displayName = displayName;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public void setPhone(String phone){
        this.phone = phone;
    }

    public void setCreatedAt(Timestamp createdAt){
        this.createdAt = createdAt;
    }

    public void setLastSignInAt(Timestamp lastSignInAp){
        this.lastSignInAt = lastSignInAp;
    }
}

