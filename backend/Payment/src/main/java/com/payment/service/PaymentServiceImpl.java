package com.payment.service;

import java.util.Date;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.payment.dto.PaymentRequest;
import com.payment.dto.PaymentResponse;
import com.payment.dto.PaymentVerificationRequest;
import com.payment.entities.Payment;
import com.payment.entities.PaymentStatus;
import com.payment.feing.OrderFeignClient;
import com.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;
    private final OrderFeignClient orderFeignClient;

    // ✅ Inject Razorpay Secret Key
    @Value("${razorpay.api.secret}")
    private String razorpayKeySecret;

    // ✅ 1. CREATE PAYMENT ORDER
    @Override
    public PaymentResponse createPayment(PaymentRequest request) {

        try {
            // Convert ₹ → Paise (precise)
            int amountInPaise = (int) Math.round(request.getAmount() * 100);

            // Razorpay Order Create
            JSONObject options = new JSONObject();
            options.put("amount", amountInPaise);
            options.put("currency", "INR");
            options.put("receipt", "order_rcpt_" + request.getOrderId());

            Order razorpayOrder = razorpayClient.orders.create(options);

            // Save Payment Record
            Payment payment = Payment.builder()
                    .orderId(request.getOrderId())
                    .amount(Long.valueOf(amountInPaise))
                    .currency("INR")
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .status(PaymentStatus.CREATED)
                    .build();

            paymentRepository.save(payment);

            // Return Response DTO
            return new PaymentResponse(
                    payment.getRazorpayOrderId(),
                    payment.getAmount(),
                    payment.getCurrency()
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay Order: " + e.getMessage());
        }
    }

    // ✅ 2. VERIFY PAYMENT
    @Override
    public String verifyPayment(PaymentVerificationRequest request) {

        try {
            // Signature Verification
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            // ✅ Correct Verification (No getApiSecret)
            boolean isValid = Utils.verifyPaymentSignature(
                    options,
                    razorpayKeySecret
            );

            if (!isValid) {
                throw new RuntimeException("Invalid Payment Signature");
            }

            // Fetch Payment Record
            Payment payment = paymentRepository
                    .findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Payment record not found"));

            // Update Payment Success
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaymentDate(new Date());

            paymentRepository.save(payment);

            // Notify Order Service
            orderFeignClient.markOrderAsPaid(payment.getOrderId(), request.getRazorpayPaymentId());

            return "Payment Verified Successfully ✅";

        } catch (Exception e) {
            throw new RuntimeException("Payment Verification Failed: " + e.getMessage());
        }
    }
}
