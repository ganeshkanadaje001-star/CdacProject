package com.cdac.service;

import java.util.List;

import com.cdac.dto.OrderReqDto;
import com.cdac.dto.OrderResDto;

public interface OrderService {
OrderResDto addOrder(OrderReqDto orderReqDto);
List<OrderResDto> getMyOrder();
List<OrderResDto> getAllOrders();
}
