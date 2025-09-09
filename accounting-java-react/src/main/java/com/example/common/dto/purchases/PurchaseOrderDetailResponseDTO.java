package com.example.common.dto.purchases;
import lombok.Data;

import java.util.List;

@Data
public class PurchaseOrderDetailResponseDTO {
    private Long id;
    private Long purchaseOrderId;
    private Long productId;
    private String productName;
    private Long purchaseOrderQuantity;
    private Double purchaseOrderAmount;
    private String createdAt;
    private String updatedAt;

}
