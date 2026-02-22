package com.freshbasket.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.freshbasket.custom_exception.ResourseNotFoundException;
import com.freshbasket.dto.OrderItemReqDto;
import com.freshbasket.dto.OrderItemResDto;
import com.freshbasket.dto.OrderReqDto;
import com.freshbasket.dto.OrderResDto;
import com.freshbasket.entity.Cart;
import com.freshbasket.entity.CartItem;
import com.freshbasket.entity.Order;
import com.freshbasket.entity.OrderAddress;
import com.freshbasket.entity.OrderItem;
import com.freshbasket.entity.OrderStatus;
import com.freshbasket.entity.Products;
import com.freshbasket.entity.User;
import com.freshbasket.repository.CartItemRepository;
import com.freshbasket.repository.CartRepository;
import com.freshbasket.repository.OrderRepository;
import com.freshbasket.repository.ProductRepository;
import com.freshbasket.repository.UserReopsitory;
import com.freshbasket.security.SecurityUtil;

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

	    Long userId = securityUtil.getCurrentUserId();
	    User user = userRepo.findById(userId)
	            .orElseThrow(() -> new ResourseNotFoundException("User not found"));

	    Cart cart = cartRepo.findByUserId(userId)
	            .orElseThrow(() -> new ResourseNotFoundException("Cart not found"));

	    if (cart.getCartItems().isEmpty()) {
	        throw new IllegalArgumentException("Cart is empty");
	    }

	    com.freshbasket.entity.Address selectedAddress = user.getAddresses().stream()
	            .filter(a -> a.getId().equals(reqDto.getAddressId()))
	            .findFirst()
	            .orElseThrow(() -> new ResourseNotFoundException("Address not found"));

	    Order order = new Order();
	    order.setUser(user);
	    order.setOrderDate(new Date());
	    order.setStatus(OrderStatus.PENDING);

	    OrderAddress shipping = new OrderAddress(
	            selectedAddress.getAddressLine(),
	            selectedAddress.getCity(),
	            selectedAddress.getState(),
	            selectedAddress.getPincode(),
	            selectedAddress.getCountry()
	    );
	    order.setShippingAddress(shipping);

	    List<OrderItem> orderItems = new ArrayList<>();
	    double totalAmount = 0.0;

	    for (CartItem cartItem : cart.getCartItems()) {
	        Products product = cartItem.getProduct();

	        OrderItem orderItem = new OrderItem();
	        orderItem.setProduct(product);
	        orderItem.setQuantity(cartItem.getQuantity());
	        orderItem.setPriceAtPurchase(product.getPrice());

	        orderItems.add(orderItem);
	        totalAmount += product.getPrice() * cartItem.getQuantity();
	    }

	    order.setOrderItems(orderItems);
	    order.setTotalAmount(totalAmount);

	    Order savedOrder = orderRepo.save(order);

	    cart.getCartItems().clear();
	    cart.setTotalAmount(0.0);
	    cartRepo.save(cart);

	    OrderResDto response = new OrderResDto();
	    response.setOrderId(savedOrder.getId());
	    response.setOrderDate(savedOrder.getOrderDate());
	    response.setStatus(savedOrder.getStatus().name());
	    response.setTotalAmount(savedOrder.getTotalAmount());

	    List<OrderItemResDto> itemDtos = new ArrayList<>();
	    for (OrderItem item : savedOrder.getOrderItems()) {
	        OrderItemResDto itemDto = new OrderItemResDto();
	        itemDto.setProductId(item.getProduct().getId());
	        itemDto.setProductName(item.getProduct().getName());
	        itemDto.setQuantity(item.getQuantity());
	        itemDto.setPriceAtPurchase(item.getPriceAtPurchase());
	        itemDto.setSubTotal(item.getPriceAtPurchase() * item.getQuantity());
	        itemDtos.add(itemDto);
	    }

	    response.setItems(itemDtos);

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

	@Override
	public void markOrderPaid(Long orderId, String paymentId) {

	    Order order = orderRepo.findById(orderId)
	            .orElseThrow(() -> new RuntimeException("Order not found"));

	    // ✅ Update payment details
	    order.setPaid(true);

	    // ✅ Save Razorpay Payment ID
	    order.setPaymentTransactionId(paymentId);

	    // ✅ Update Order Status
	    order.setStatus(OrderStatus.CONFIRMED);

	    orderRepo.save(order);
	}
	 @Override
	    public OrderResDto updateOrderStatus(Long orderId, OrderStatus status) {

	        // 1. Find order
	        Order order = orderRepo.findById(orderId)
	                .orElseThrow(() -> new RuntimeException("Order not found"));

	        // 2. Update status
	        order.setStatus(status);

	        // 3. Save updated order
	        Order updatedOrder = orderRepo.save(order);

	        // 4. Return response DTO
	        return model.map(updatedOrder, OrderResDto.class);
	    }

}
