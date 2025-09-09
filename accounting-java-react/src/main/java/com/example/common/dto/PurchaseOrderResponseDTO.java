package com.example.common.dto;

import lombok.Data;
@Data
public class PurchaseOrderResponseDTO {
    private Long id;
    private Long vendorId;
    private Long totalQuantity;
    private Double totalAmount;
    private Integer discountPersantage;
    private Double discountAmount;
    private Integer taxPersantage;
    private Double taxAmount;
    private Double netAmount;
    private Double productPrice;
    private String vendorFirstName;
    private String vendorLastName;
}
