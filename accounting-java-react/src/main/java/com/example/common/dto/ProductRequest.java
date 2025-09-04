package com.example.common.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private String name;
    private String model;
    private String code;
    private Long categoryId;
    private Integer quantity;
    private Double salePrice;
    private Double purchasePrice;
    private String image;
}
