package com.example.core.service;

import com.example.common.dto.PurchaseOrderDTO;
import com.example.persistence.entity.PurchaseOrder;

import java.util.List;

public interface PurchaseOrderService {

    PurchaseOrder createPurchaseOrder(PurchaseOrderDTO dto);

    PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrderDTO dto);

    PurchaseOrder getPurchaseOrderById(Long id);

    List<PurchaseOrder> getAllPurchaseOrders();
}
