package com.example.common.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String zipCode;
    private Boolean isSuperadmin = false; // default false
    private String email;
    private String password;
}
