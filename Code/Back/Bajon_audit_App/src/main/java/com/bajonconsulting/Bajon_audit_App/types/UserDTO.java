package com.bajonconsulting.Bajon_audit_App.types;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDTO {


    @JsonProperty("id")
    private String uid;
    private String email;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("last_sign_in_at")
    private String lastSignInAt;

    //metadata
    @JsonProperty("user_metadata")
    private UserMetadataDTO userMetadata;


    public UserDTO() {
    }

    //getter / setter

    //UID
    public String getUID() {
        return this.uid;
    }

    public void setUID(String uid) {
        this.uid = uid;
    }

    //email
    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    //createdat
    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }


    //lastSginInAt

    public String getLastSignInAt() {
        return this.lastSignInAt;
    }

    public void setLastSignInAt(String lastSignInAp) {
        this.lastSignInAt = lastSignInAp;
    }

    public UserMetadataDTO getUserMetadata() {
        return this.userMetadata;
    }

    public void setUserMetadata(UserMetadataDTO userMetadata) {
        this.userMetadata = userMetadata;
    }

    public String getDsipalyName() {
        return userMetadata.getDisplayName();
    }

    public String getPhone() {
        return userMetadata.getPhone();
    }

    public String getCurrentRole() {
        return userMetadata.getRole();
    }

    public String getFirstName() {
        return userMetadata.getFirstName();
    }

    public String getLastName() {
        return userMetadata.getLastName();
    }
}

