package com.example.common.dto.purchases;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class PurchaseOrderFullResponseDTO {
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
    private String createdAt;
    private String updatedAt;

    private String vendorFirstName;
    private String vendorLastName;
    private String vendorAddress;
    private String vendorPhoneNo;
    private String vendorEmail;
    private String vendorZipCode;

    @JsonProperty("purchaseOrderDetails")
    private List<PurchaseOrderDetailResponseDTO> purchaseOrderDetails;
}
