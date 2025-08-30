package com.example.common.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String zipCode;
    private Integer isSuperadmin = 0; // accept 0/1
    private String email;
    private String password;

    // convenience getter for boolean
    public Boolean getIsSuperadminAsBoolean() {
        return isSuperadmin != null && isSuperadmin == 1;
    }
}
