package com.example.common.dto;

import lombok.Data;

@Data
public class VendorRequest {
    private String firstName;
    private String lastName;
    private String address;
    private String phoneNumber;
    private String email;
    private String zipCode;

}
