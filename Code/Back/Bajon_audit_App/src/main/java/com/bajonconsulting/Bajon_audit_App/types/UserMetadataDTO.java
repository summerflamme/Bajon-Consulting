package com.bajonconsulting.Bajon_audit_App.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserMetadataDTO {

    private String email;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("firstName")
    private String firstName;

    private String phone;

    private String role;

    @JsonProperty("displayName")
    private String displayName;

    // Constructeurs
    public UserMetadataDTO() {}

    // Getters et setters

    //email
    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    //lastName
    public String getLastName() { return lastName; }

    public void setLastName(String lastName) { this.lastName = lastName; }

    //firtName
    public String getFirstName() { return firstName; }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    // phone
    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    //role
    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }


    //displayName
    public String getDisplayName() { return displayName; }

    public void setDisplayName(String displayName) { this.displayName = displayName; }
}
