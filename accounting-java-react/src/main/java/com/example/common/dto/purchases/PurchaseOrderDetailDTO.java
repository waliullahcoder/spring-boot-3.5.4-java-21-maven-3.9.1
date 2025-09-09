package com.example.common.dto;

import lombok.Data;

@Data
public class PurchaseOrderDetailDTO {
    private Long productId;
    private String productName;
    private Long purchaseOrderQuantity;
    private Double purchaseOrderAmount;
}
