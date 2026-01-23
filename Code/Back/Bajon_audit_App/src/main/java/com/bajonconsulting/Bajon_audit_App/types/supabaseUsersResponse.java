package com.bajonconsulting.Bajon_audit_App.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class supabaseUsersResponse
{
    private List<Map<String,Object>> users;

    public List<Map<String, Object>> getUsers() {
        return users;
    }
    public void setUsers(List<Map<String, Object>> users) {
        this.users = users;
    }
}
