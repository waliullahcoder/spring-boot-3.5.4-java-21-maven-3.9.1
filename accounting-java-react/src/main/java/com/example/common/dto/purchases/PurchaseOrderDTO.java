package com.example.common.dto;
import com.fasterxml.jackson.annotation.JsonProperty; // Aita jemon khushi  field name pathano jai form theke
import lombok.Data;
import java.util.List;

@Data
public class PurchaseOrderDTO {
    @JsonProperty("purchaseOrder")
    private PurchaseOrderInfoDTO purchaseOrder; // nested
    @JsonProperty("purchaseOrderDetails")
    private List<PurchaseOrderDetailDTO> purchaseOrderDetails;
}
