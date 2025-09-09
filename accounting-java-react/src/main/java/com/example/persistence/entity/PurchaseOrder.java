package com.example.persistence.entity;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderDetail> details;
}
