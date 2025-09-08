package com.example.common.dto;

import lombok.Data;

@Data
public class PurchaseOrderInfoDTO {
    private Long vendorId;
    private Long totalQuantity;
    private Double totalAmount;
    private Integer discountPersantage;
    private Double discountAmount;
    private Integer taxPersantage;
    private Double taxAmount;
    private Double netAmount;
}
