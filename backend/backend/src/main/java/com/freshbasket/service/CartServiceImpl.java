package com.freshbasket.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshbasket.custom_exception.ResourseNotFoundException;
import com.freshbasket.dto.CartRequestDto;
import com.freshbasket.dto.CartResponseDto;
import com.freshbasket.entity.Cart;
import com.freshbasket.entity.CartItem;
import com.freshbasket.entity.Products;
import com.freshbasket.entity.User;
import com.freshbasket.repository.CartRepository;
import com.freshbasket.repository.ProductRepository;
import com.freshbasket.repository.UserReopsitory;
import com.freshbasket.security.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
	private final UserReopsitory userRepo;
	private final ProductRepository prodRepo;
	private final CartRepository cartRepo;
	private final SecurityUtil securityUtil;
	private final ModelMapper model;

	@Override
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
				.filter(item -> item.getProduct().getId().equals(product.getId())).findFirst().orElse(null);

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

		CartResponseDto cartResponseDto = model.map(savedCart, CartResponseDto.class);
		for (int i = 0; i < savedCart.getCartItems().size(); i++) {
			cartResponseDto.getCartItems().get(i).setProductId(savedCart.getCartItems().get(i).getProduct().getId());
			cartResponseDto.getCartItems().get(i).setCartItemId(savedCart.getCartItems().get(i).getId());
		}
		return cartResponseDto;
	}

	@Override
	public CartResponseDto removeCartItem(Long productId) {

		Long userId = securityUtil.getCurrentUserId();

		Cart cart = cartRepo.findByUserId(userId).orElseThrow(() -> new ResourseNotFoundException("Cart not found"));

		CartItem cartItem = cart.getCartItems().stream().filter(item -> item.getProduct().getId().equals(productId))
				.findFirst().orElseThrow(() -> new ResourseNotFoundException("Item not found in cart"));

		cart.getCartItems().remove(cartItem); // orphanRemoval = true

		recalculateCartTotal(cart);

		Cart savedCart = cartRepo.save(cart);
		CartResponseDto response = model.map(savedCart, CartResponseDto.class);

		savedCart.getCartItems().forEach(ci -> response.getCartItems().forEach(dto -> {
			if (ci.getId().equals(dto.getCartItemId())) {
				dto.setProductId(ci.getProduct().getId());
			}
		}));

		return response;
	}

	@Override
	public void clearCart() {

		Long userId = securityUtil.getCurrentUserId();

		Cart cart = cartRepo.findByUserId(userId).orElseThrow(() -> new ResourseNotFoundException("Cart not found"));

		cart.getCartItems().clear(); // orphanRemoval deletes rows
		cart.setTotalAmount(0.0);

		cartRepo.save(cart);
	}

	@Override
	public CartResponseDto updateCartItem(CartRequestDto dto) {

		Long userId = securityUtil.getCurrentUserId();

		Cart cart = cartRepo.findByUserId(userId).orElseThrow(() -> new ResourseNotFoundException("Cart not found"));

		CartItem cartItem = cart.getCartItems().stream()
				.filter(item -> item.getProduct().getId().equals(dto.getProductId())).findFirst()
				.orElseThrow(() -> new ResourseNotFoundException("Item not found in cart"));

		cartItem.setQuantity(dto.getQuantity());
		cartItem.setTotalPrice(dto.getQuantity() * cartItem.getProduct().getPrice());

		recalculateCartTotal(cart);

		Cart savedCart = cartRepo.save(cart);
		CartResponseDto response = model.map(savedCart, CartResponseDto.class);

		savedCart.getCartItems().forEach(ci -> response.getCartItems().forEach(dtoItem -> {
			if (ci.getId().equals(dtoItem.getCartItemId())) {
				dtoItem.setProductId(ci.getProduct().getId());
			}
		}));

		return response;
	}

	@Override
	public CartResponseDto getMyCart() {

		Long userId = securityUtil.getCurrentUserId();

		Cart cart = cartRepo.findByUserId(userId).orElseThrow(() -> new ResourseNotFoundException("Cart not found"));

		CartResponseDto response = model.map(cart, CartResponseDto.class);

		// set productId manually (same logic you already used)
		cart.getCartItems().forEach(ci -> response.getCartItems().forEach(dto -> {
			if (ci.getId().equals(dto.getCartItemId())) {
				dto.setProductId(ci.getProduct().getId());
			}
		}));

		return response;
	}

	private void recalculateCartTotal(Cart cart) {
		double total = cart.getCartItems().stream().mapToDouble(CartItem::getTotalPrice).sum();

		cart.setTotalAmount(total);
	}

}
