package com.cdac.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dto.OrderItemReqDto;
import com.cdac.dto.OrderItemResDto;
import com.cdac.dto.OrderReqDto;
import com.cdac.dto.OrderResDto;
import com.cdac.entity.Cart;
import com.cdac.entity.CartItem;
import com.cdac.entity.Order;
import com.cdac.entity.OrderItem;
import com.cdac.entity.OrderStatus;
import com.cdac.entity.Products;
import com.cdac.entity.User;
import com.cdac.repository.CartItemRepository;
import com.cdac.repository.CartRepository;
import com.cdac.repository.OrderRepository;
import com.cdac.repository.ProductRepository;
import com.cdac.repository.UserReopsitory;
import com.cdac.security.SecurityUtil;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

	private final UserReopsitory userRepo;
	private final OrderRepository orderRepo;
	private final ProductRepository productRepo;
	private final CartItemRepository cartItemRepo;
	private final SecurityUtil securityUtil;
	private final CartRepository cartRepo;
	private final ModelMapper model;

	@Override
	public OrderResDto addOrder(OrderReqDto reqDto) {

	    // 1️⃣ Get logged-in user
	    Long userId = securityUtil.getCurrentUserId();
	    User user = userRepo.findById(userId)
	            .orElseThrow(() -> new ResourseNotFoundException("User not found"));

	    // 2️⃣ Fetch product
	    Products product = productRepo.findById(reqDto.getProductId())
	            .orElseThrow(() -> new ResourseNotFoundException("Product not found"));

	    if (reqDto.getQuantity() <= 0) {
	        throw new IllegalArgumentException("Invalid quantity");
	    }

	    // 3️⃣ Create Order
	    Order order = new Order();
	    order.setUser(user);
	    order.setOrderDate(new Date());
	    order.setStatus(OrderStatus.PENDING);

	    // 4️⃣ Create ONE OrderItem
	    OrderItem orderItem = new OrderItem();
	    orderItem.setProduct(product);
	    orderItem.setQuantity(reqDto.getQuantity());
	    orderItem.setPriceAtPurchase(product.getPrice()); // ✅ FIXED

	    double totalAmount = product.getPrice() * reqDto.getQuantity();

	    order.setOrderItems(List.of(orderItem));
	    order.setTotalAmount(totalAmount);

	    // 5️⃣ Save order
	    Order savedOrder = orderRepo.save(order);

	    // 6️⃣ Build response
	    OrderResDto response = new OrderResDto();
	    response.setOrderId(savedOrder.getId());
	    response.setOrderDate(savedOrder.getOrderDate());
	    response.setStatus(savedOrder.getStatus().name());
	    response.setTotalAmount(savedOrder.getTotalAmount());

	    OrderItemResDto itemDto = new OrderItemResDto();
	    itemDto.setProductId(product.getId());
	    itemDto.setProductName(product.getName());
	    itemDto.setQuantity(reqDto.getQuantity());
	    itemDto.setPriceAtPurchase(product.getPrice());
	    itemDto.setSubTotal(product.getPrice() * reqDto.getQuantity());

	    response.setItems(List.of(itemDto));

	    return response;
	}

	@Override
	public List<OrderResDto> getMyOrder() {

	    // 1️⃣ Get logged-in user
	    Long userId = securityUtil.getCurrentUserId();
	    User user = userRepo.findById(userId)
	            .orElseThrow(() -> new ResourseNotFoundException("User not found"));

	    // 2️⃣ Fetch orders (NO exception if empty)
	    List<Order> orders = orderRepo.findByUser(user);

	    return mapToOrderResDtoList(orders);
	}

	@Override
	public List<OrderResDto> getAllOrders() {
		List<Order> orders = orderRepo.findAll();
		return mapToOrderResDtoList(orders);
	}

	private List<OrderResDto> mapToOrderResDtoList(List<Order> orders) {
	    List<OrderResDto> responseList = new ArrayList<>();

	    for (Order order : orders) {
	        OrderResDto dto = new OrderResDto();
	        dto.setOrderId(order.getId());
	        dto.setOrderDate(order.getOrderDate());
	        dto.setStatus(order.getStatus().name());
	        dto.setTotalAmount(order.getTotalAmount());
	        
	        List<OrderItemResDto> itemDtos = new ArrayList<>();

	        for (OrderItem item : order.getOrderItems()) {
	            OrderItemResDto itemDto = new OrderItemResDto();
	            itemDto.setProductId(item.getProduct().getId());
	            itemDto.setProductName(item.getProduct().getName());
	            itemDto.setQuantity(item.getQuantity());
	            itemDto.setPriceAtPurchase(item.getPriceAtPurchase());
	            itemDto.setSubTotal(item.getPriceAtPurchase() * item.getQuantity());
	            itemDtos.add(itemDto);
	        }

	        dto.setItems(itemDtos);
	        responseList.add(dto);
	    }
	    return responseList;
	}

	
}
