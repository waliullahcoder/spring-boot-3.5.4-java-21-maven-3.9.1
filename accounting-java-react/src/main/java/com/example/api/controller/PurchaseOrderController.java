package com.example.api.controller;

import com.example.common.dto.PurchaseOrderDTO;
import com.example.common.dto.PurchaseOrderDetailDTO;
import com.example.core.service.PurchaseOrderService;
import com.example.persistence.entity.PurchaseOrder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase/order")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @PostMapping("/create")
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrderDTO purchaseOrderDTO) {
        System.out.println("Received PurchaseOrderDTO: " + purchaseOrderDTO);
        PurchaseOrder created = purchaseOrderService.createPurchaseOrder(purchaseOrderDTO);
        System.out.println("Created PurchaseOrder: " + created);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrder(@PathVariable Long id,
                                                             @RequestBody PurchaseOrderDTO purchaseOrderDTO) {
        PurchaseOrder updated = purchaseOrderService.updatePurchaseOrder(id, purchaseOrderDTO);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/show/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrder(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrderById(id));
    }

    @GetMapping("/list")
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {
        System.out.println("Aira");
        List<PurchaseOrder> orders = purchaseOrderService.getAllPurchaseOrders();
        return ResponseEntity.ok(orders);
    }

}
