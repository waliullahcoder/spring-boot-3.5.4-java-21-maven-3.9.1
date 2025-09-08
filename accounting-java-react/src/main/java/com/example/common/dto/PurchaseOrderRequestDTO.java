package com.example.common.dto;

import lombok.Data;
import java.util.List;

@Data
public class PurchaseOrderRequestDTO {
    private PurchaseOrderDTO purchaseOrder;           // maps to "purchaseOrder" object
    private List<PurchaseOrderDetailDTO> purchaseOrderDetails; // maps to "purchaseOrderDetails" array
}
