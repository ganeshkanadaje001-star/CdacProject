package com.payment.service;

import com.payment.dto.PaymentRequest;
import com.payment.dto.PaymentResponse;
import com.payment.dto.PaymentVerificationRequest;

public interface PaymentService {
	PaymentResponse createPayment(PaymentRequest request);
	String verifyPayment(PaymentVerificationRequest request);
}
