package com.example.common.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String zipCode;
    private Boolean isSuperadmin = false; // default false
    private String email;
    private String password;
}
