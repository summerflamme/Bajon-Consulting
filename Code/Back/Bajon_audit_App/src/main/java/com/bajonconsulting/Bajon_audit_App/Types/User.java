package com.bajonconsulting.Bajon_audit_App.Types;

import java.rmi.server.UID;
import java.security.Timestamp;

public class User {
    

    private UID uid;
    private String email;

    private Timestamp createdAt; 
    private Timestamp lastSignInAt;

    //metadata
    private String userRole ;
    private String phone; 
    private String displayName;
    private String firstName; 
    private String lastName;

    User(){}

    User(UID Uid, String DispalyName, String Email, String Phone, Timestamp CreatedAt, Timestamp LastSignInAt, String UserRole){
        this.uid = Uid;
        this.displayName = DispalyName;
        this.email = Email;
        this.phone = Phone; 
        this.createdAt = CreatedAt;
        this.lastSignInAt = LastSignInAt;
        this.userRole = UserRole; 
        this.firstName = displayName.split(" ")[1];
        this.lastName = displayName.split(" ")[0];
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

    public String getFirstName(){
        return this.firstName;
    }

    public String getLastName(){
        return this.lastName;
    }

    public String getUserRole(){
        return this.userRole; 
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

    public void setFirstName(String FirstName){
        this.firstName = FirstName;
    }

    public void setLastName(String LastName) {
        this.lastName = LastName;
    }

    public void setUserRole(String UserRole) {
        this.userRole = UserRole;
    }
}