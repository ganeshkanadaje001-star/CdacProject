package com.cdac.service;

import java.util.Optional;
import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dto.CartRequestDto;
import com.cdac.dto.CartResponseDto;
import com.cdac.entity.Cart;
import com.cdac.entity.CartItem;
import com.cdac.entity.Products;
import com.cdac.entity.User;
import com.cdac.repository.CartItemRepository;
import com.cdac.repository.CartRepository;
import com.cdac.repository.ProductRepository;
import com.cdac.repository.UserReopsitory;
import com.cdac.security.SecurityUtil;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
	private final UserReopsitory userRepo;
	private final ProductRepository prodRepo;
	private final CartRepository cartRepo;
	private final CartItemRepository cartItemRepository;
	private final SecurityUtil securityUtil;
	private final ModelMapper model;

	public CartResponseDto addToCartService(CartRequestDto dto) {

		Long userId = securityUtil.getCurrentUserId();

		Cart cart = cartRepo.findByUserId(userId).orElseGet(() -> {
			User user = userRepo.findById(userId).orElseThrow(() -> new ResourseNotFoundException("User not found"));
			Cart newCart = new Cart();
			newCart.setUser(user);
			newCart.setTotalAmount(0.0);
			return cartRepo.save(newCart);
		});

		Products product = prodRepo.findById(dto.getProductId())
				.orElseThrow(() -> new ResourseNotFoundException("Product not found"));

		CartItem cartItem = cart.getCartItems().stream()
				.filter(item -> item.getProduct().getProductId().equals(product.getProductId())).findFirst()
				.orElse(null);

		if (cartItem == null) {
			cartItem = new CartItem();
			cartItem.setProduct(product);
			cartItem.setQuantity(dto.getQuantity());
			cartItem.setTotalPrice(dto.getQuantity() * product.getPrice());
			cart.getCartItems().add(cartItem); 
		} else {
			cartItem.setQuantity(cartItem.getQuantity() + dto.getQuantity());
			cartItem.setTotalPrice(cartItem.getQuantity() * product.getPrice());
		}

		double total = cart.getCartItems().stream().mapToDouble(CartItem::getTotalPrice).sum();

		cart.setTotalAmount(total);

		Cart savedCart = cartRepo.save(cart);
        
		CartResponseDto cartResponseDto= model.map(savedCart, CartResponseDto.class);
		cartResponseDto.getCartItems().forEach(f ->
        savedCart.getCartItems().stream()
                .filter(ci -> ci.getCartItemId().equals(f.getCartItemId()))
                .findFirst()
                .ifPresent(ci ->
                        f.setProductId(ci.getProduct().getProductId()))
);
		return cartResponseDto;
	}
	@Override
	public CartResponseDto removeCartItem(Long productId) {

	    Long userId = securityUtil.getCurrentUserId();

	    Cart cart = cartRepo.findByUserId(userId)
	            .orElseThrow(() -> new ResourseNotFoundException("Cart not found"));

	    CartItem cartItem = cart.getCartItems().stream()
	            .filter(item -> item.getProduct().getProductId().equals(productId))
	            .findFirst()
	            .orElseThrow(() -> new ResourseNotFoundException("Item not found in cart"));

	    cart.getCartItems().remove(cartItem); // orphanRemoval = true

	    recalculateCartTotal(cart);

	    Cart savedCart = cartRepo.save(cart);
	    CartResponseDto response = model.map(savedCart, CartResponseDto.class);

	    savedCart.getCartItems().forEach(ci ->
	        response.getCartItems().forEach(dto -> {
	            if (ci.getCartItemId().equals(dto.getCartItemId())) {
	                dto.setProductId(ci.getProduct().getProductId());
	            }
	        })
	    );

	    return response;
	}
	
	@Override
	public void clearCart() {

	    Long userId = securityUtil.getCurrentUserId();

	    Cart cart = cartRepo.findByUserId(userId)
	            .orElseThrow(() -> new ResourseNotFoundException("Cart not found"));

	    cart.getCartItems().clear(); // orphanRemoval deletes rows
	    cart.setTotalAmount(0.0);

	    cartRepo.save(cart);
	}
	@Override
	public CartResponseDto updateCartItem(CartRequestDto dto) {

	    Long userId = securityUtil.getCurrentUserId();

	    Cart cart = cartRepo.findByUserId(userId)
	            .orElseThrow(() -> new ResourseNotFoundException("Cart not found"));

	    CartItem cartItem = cart.getCartItems().stream()
	            .filter(item -> item.getProduct().getProductId().equals(dto.getProductId()))
	            .findFirst()
	            .orElseThrow(() -> new ResourseNotFoundException("Item not found in cart"));

	    cartItem.setQuantity(dto.getQuantity());
	    cartItem.setTotalPrice(dto.getQuantity() * cartItem.getProduct().getPrice());

	    recalculateCartTotal(cart);

	    Cart savedCart = cartRepo.save(cart);
	    CartResponseDto response = model.map(savedCart, CartResponseDto.class);

	    savedCart.getCartItems().forEach(ci ->
	        response.getCartItems().forEach(dtoItem -> {
	            if (ci.getCartItemId().equals(dtoItem.getCartItemId())) {
	                dtoItem.setProductId(ci.getProduct().getProductId());
	            }
	        })
	    );

	    return response;
	}
	@Override
	public CartResponseDto getMyCart() {

	    Long userId = securityUtil.getCurrentUserId();

	    Cart cart = cartRepo.findByUserId(userId)
	            .orElseThrow(() -> new ResourseNotFoundException("Cart not found"));

	    CartResponseDto response = model.map(cart, CartResponseDto.class);

	    // set productId manually (same logic you already used)
	    cart.getCartItems().forEach(ci ->
	        response.getCartItems().forEach(dto -> {
	            if (ci.getCartItemId().equals(dto.getCartItemId())) {
	                dto.setProductId(ci.getProduct().getProductId());
	            }
	        })
	    );

	    return response;
	}

	private void recalculateCartTotal(Cart cart) {
	    double total = cart.getCartItems()
	            .stream()
	            .mapToDouble(CartItem::getTotalPrice)
	            .sum();

	    cart.setTotalAmount(total);
	}

}
