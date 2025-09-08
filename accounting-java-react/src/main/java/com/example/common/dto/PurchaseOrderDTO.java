package com.example.common.dto;

import lombok.Data;
import java.util.List;

@Data
public class PurchaseOrderDTO {
    private PurchaseOrderInfoDTO purchaseOrder; // nested
    private List<PurchaseOrderDetailDTO> purchaseOrderDetails;
}
