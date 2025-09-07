package com.example.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomerUpdateDto {
    private String firstName;
    private String lastName;
    private String address;
    private String phoneNumber;
    private String email;
    private String zipCode;
}
