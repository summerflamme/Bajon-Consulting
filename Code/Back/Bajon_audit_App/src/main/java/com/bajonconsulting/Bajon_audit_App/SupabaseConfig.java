package com.bajonconsulting.Bajon_audit_App;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SupabaseConfig {

    @Value("${supabase.url}")
    private String url;

    @Value("${supabase.anon-key}")
    private String anonKey;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    public String getUrl() {
        return url;
    }

    public String getAnonKey() {
        return anonKey;
    }

    public String getServiceRoleKey() {
        return serviceRoleKey;
    }
}
