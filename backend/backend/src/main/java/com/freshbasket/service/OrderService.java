package com.freshbasket.service;

import java.util.List;

import com.freshbasket.dto.OrderReqDto;
import com.freshbasket.dto.OrderResDto;

public interface OrderService {
OrderResDto addOrder(OrderReqDto orderReqDto);
List<OrderResDto> getMyOrder();
List<OrderResDto> getAllOrders();
void markOrderPaid(Long orderId,String paymentId);
}
